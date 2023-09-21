// @ts-nocheck
import {
  ConversationChain,
  LLMChain,
  MultiRetrievalQAChain,
  MultiRouteChain,
} from "langchain/chains";
import { isObjectEmpty } from "../../helpers";
import { getDocsFromRedis } from "../redis/service";
import { getStoreByWorkspaceId } from "../store/service";
import { OpenAI } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { prisma } from "../../prisma";
import { PromptTemplate } from "langchain/prompts";
import { multiPromptChain } from "../gpt/service";
import { getDocs } from "../qdrant/service";
import { HumanMessage } from "langchain/schema";
import {
  extractFirstURL,
  summarizeWebsite,
} from "../function/summarizeWebsite";
import { getWebsiteLinks } from "../function/findAllWebsiteLinks";
import { createList, findAudience } from "../function/cleanWebsite";
import { FastifyReply } from "fastify";
import { Readable } from "stream";

export const processMessage = async ({
  message,
  workspaceId,
  storeId,
  metadata,
}: {
  message: string;
  workspaceId: string;
  storeId?: string;
  metadata?: any;
}) => {
  if (!message) throw new Error("Message is empty");
  if (!workspaceId) throw new Error("Workspace is empty");
  try {
    const stores = await getStoreByWorkspaceId({
      workspaceId: workspaceId,
      storeId,
    });

    const getDocsFromRedisInParallel: any = stores.map((store) => {
      return getDocsFromRedis({
        workspaceId: workspaceId,
        storeId: store.id,
        message: message,
        similarityCount: 1,
      });
    });

    const results = await Promise.all(getDocsFromRedisInParallel);
    console.log("🚀 ~ file: service.ts:35 ~ results:", results);

    const cleanResults = results.filter((obj) => !isObjectEmpty(obj));

    if (cleanResults.length === 0) {
      const prompt = PromptTemplate.fromTemplate(message);

      const chat = new ChatOpenAI({});
      const chain = new ConversationChain({ llm: chat, verbose: true });
      const result = await chain.call({ input: message });

      // const chain = new LLMChain({
      //   llm: new OpenAI({
      //     temperature: 0.1,
      //   }),
      //   prompt,
      // });

      // const result = await chain.run(prompt);
      // console.log(
      //   "🚀 ~ file: service.ts:31 ~ constgetDocsFromRedisInParallel:any=stores.map ~ message:",
      //   message
      // );

      // console.log("🚀 ~ file: service.ts:49 ~ result:", result);

      if (!result) {
        return {
          result: "Sorry, nothing I can find here",
        };
      }

      return {
        result: result.response,
      };
    }

    const retrieverNames = cleanResults.map((result, index) => `index`);
    const retrieverDescriptions = cleanResults.map(
      (result) => "Used for all questions"
    );

    const retrievers = cleanResults.map((result) =>
      result.vectorStore.asRetriever()
    );

    const multiRetrievalQAChain = MultiRetrievalQAChain.fromLLMAndRetrievers(
      new OpenAI(),
      {
        retrieverNames,
        retrieverDescriptions,
        retrievers,
        // retrievalQAChainOpts: {
        //   returnSourceDocuments: true,
        // },
      }
    );

    let chain = await multiRetrievalQAChain.call({
      input: message,
    });

    return chain;
  } catch (error) {
    console.log(error);
  }
};

export const chatGptStream = async ({
  message,
  workspaceId,
  reply,
}: {
  message: string;
  workspaceId?: string;
  reply?: any;
}) => {
  const model = new ChatOpenAI({
    streaming: true,
  });
  let responseText = "";

  const readableStream = new Readable();
  readableStream._read = () => {};

  reply.header("Content-Type", "application/json; charset=utf-8");
  reply.header("Transfer-Encoding", "chunked");
  reply.send(readableStream);

  const response = await model.call([new HumanMessage(message)], {
    callbacks: [
      {
        handleLLMNewToken(token: string) {
          let tokenString = JSON.stringify({
            streaming: true,
            data: {
              message: token,
            },
          });
          console.log(tokenString);
          readableStream.push({ token }.token || "");
          responseText += { token }.token || "";
        },
      },
    ],
  });

  // readableStream.push(
  //   JSON.stringify({
  //     success: true,
  //     data: {
  //       message: responseText,
  //     },
  //   })
  // );
  readableStream.push(null);

  return response;
};

export const processBasicMessageV2 = async ({
  message,
  workspaceId,
  storeIds = [],
  tagKey,
  metadata,
  reply,
}: {
  message: string;
  workspaceId?: string;
  storeIds?: string[];
  tagKey?: string;
  metadata?: any;
  reply: FastifyReply;
}) => {
  if (!message) throw new Error("Message is empty");

  // Fetch tags
  const tags = await fetchTags(workspaceId);

  // Match tag with message
  const matchedTag = matchMessageWithTag({ message, tags });

  if (matchedTag.id) {
    const response = await handleMatchedTag({
      tag: matchedTag,
      workspaceId,
      message,
      metadata,
      reply,
    });

    return reply.send({
      success: true,
      data: {
        message: response,
      },
    });
  }

  if (tagKey) {
    return await handleTagKey({ tagKey, workspaceId, message, reply });
  }

  console.log(reply);

  return await handleNoMatch({ workspaceId, message, reply });
};

// Helper Functions
const fetchTags = async (workspaceId: string) => {
  return await prisma.tags.findMany({
    where: {
      OR: [{ is_system_tag: true }, { workspace: workspaceId }],
    },
  });
};

const matchMessageWithTag = ({
  message,
  tags,
}: {
  message: string;
  tags: any[];
}) => {
  let matchedTag = {};
  let lowercaseMessage = message.toLowerCase();

  tags.forEach((tag) => {
    if (matchedTag.id) return;
    tag.base_message.forEach((baseMessage) => {
      if (matchedTag.id) return;
      if (lowercaseMessage.includes(baseMessage.toLowerCase())) {
        matchedTag = tag;
      }
    });
  });

  return matchedTag;
};

const handleMatchedTag = async ({
  tag,
  workspaceId,
  message,
  metadata,
  reply,
}: {
  tag: any;
  workspaceId: string;
  message: string;
  metadata: any;
  reply: FastifyReply;
}) => {
  if (workspaceId && tag?.command_type === "respond") {
    let similarDoc = await getDocs({
      message,
      key: workspaceId,
      similarityCount: 1,
      filter: {
        should: [
          {
            key: "metadata.workspace_id",
            match: {
              value: workspaceId,
            },
          },
        ],
      },
    });

    if (similarDoc?.[0]) {
      await chatGptStream({
        message: `Answer this: ${message}, using this information: ${similarDoc?.[0].pageContent}`,
        workspaceId,
        reply,
      });
    }
  }

  if (tag?.function) {
    return await runFunction({
      tagFunction: tag.function,
      message,
      metadata,
      tag,
    });
  }

  if (tag?.ai_template) {
    let cleanTemplate = replaceInputWithValue(tag.ai_template, message);
    await chatGptStream({
      message: `${cleanTemplate}`,
      workspaceId,
      reply,
    });
  }

  return null;
};

const handleTagKey = async ({
  tagKey,
  workspaceId,
  message,
  reply,
}: {
  tagKey: string;
  workspaceId: string;
  message: string;
  chat: any;
  reply: FastifyReply;
}) => {
  const tag = await prisma.tags.findFirst({
    where: {
      key: tagKey,
    },
  });

  if (tag) {
    let cleanTemplate = message;
    if (tag.ai_template) {
      cleanTemplate = replaceInputWithValue(tag.ai_template, message);
    }

    await chatGptStream({
      message: `${cleanTemplate}`,
      workspaceId,
      reply,
    });
  }

  let filter = {};
  if (workspaceId) {
    filter = {
      key: "metadata.workspace_id",
      match: {
        value: workspaceId,
      },
    };
  }

  let similarTag = await getDocs({
    message,
    key: "tags",
    similarityCount: 5,
    filter: {
      should: [
        {
          key: "metadata.type",
          match: {
            value: "system",
          },
        },
        filter,
      ],
    },
  });

  if (similarTag?.[0] && similarTag[1] > 0.8) {
    const relatedTag = await prisma.tags.findFirst({
      where: {
        id: similarTag[0].metadata.id,
      },
    });

    if (!relatedTag) {
      return await chatGptStream({
        message,
        workspaceId,
        reply,
      });
    } else {
      let cleanTemplate = message;
      if (relatedTag.ai_template) {
        cleanTemplate = replaceInputWithValue(relatedTag.ai_template, message);
      }

      await chatGptStream({
        message: `${cleanTemplate}`,
        workspaceId,
        reply,
      });
    }
  } else {
    await chatGptStream({
      message,
      workspaceId,
      reply,
    });
  }
};

const handleNoMatch = async ({
  workspaceId,
  message,
  reply,
}: {
  workspaceId?: string;
  message: string;
  reply: FastifyReply;
}) => {
  return await chatGptStream({
    message,
    workspaceId,
    reply,
  });
};

export const saveMessage = async ({
  message,
  customerId,
  storeId,
  originalMessageId,
}: {
  message: string;
  customerId: string;
  originalMessageId?: string;
  storeId?: string;
}) => {
  if (!message) return "Message is not found";

  try {
    let data: {
      content: string;
      customer: string;
      original_message?: string;
      gpt_message?: string;
      store?: string;
    } = {
      content: message,
      customer: customerId,
      original_message: originalMessageId,
      gpt_message: "",
    };

    if (!customerId) {
      data.gpt_message = message;
    }

    if (storeId) {
      data.store = storeId;
    }

    if (originalMessageId) {
      data.original_message = originalMessageId;
    }

    const newMessage = await prisma.messages.create({
      data,
    });

    return newMessage;
  } catch (error) {
    console.log(error);
  }
};

const replaceInputWithValue = (
  inputString: string | null,
  replacementValue: string
) => {
  if (!inputString) return "";
  const pattern = /\[input\]/g;
  const replacedString = inputString.replace(pattern, replacementValue);
  return replacedString || "";
};

export const runFunction = async ({ tagFunction, message, metadata, tag }) => {
  if (!tagFunction) return "Sorry, I cannot run this now.";
  switch (tagFunction) {
    case "find-all-website-links":
      return await getWebsiteLinks({
        message,
        metadata: {
          link_type: "all",
        },
      });
    case "find-audience":
      return await findAudience({
        message,
        metadata,
        tag,
      });
    case "organize-list":
      return await createList({
        message,
        metadata,
        tag,
      });
    case "find-all-success-website-links":
      return await getWebsiteLinks({
        message,
        metadata: {
          link_type: "success",
        },
      });
    case "find-all-error-website-links":
      return await getWebsiteLinks({
        message,
        metadata: {
          link_type: "error",
        },
      });
    case "summarize-website":
      return await summarizeWebsite({ message, metadata });
    default:
      return "Sorry, I cannot run this now.";
  }
};

// export const processBasicMessageV3 = async ({
//   message,
//   userId,
//   res,
// }: {
//   message: string;
//   userId: string;
//   res?: any;
// }) => {
//   let aggregatedTokens = [];

//   const chat = new ChatOpenAI({
//     streaming: true,
//   });
//   res.header("Content-Type", "application/octet-stream");

//   if (!message) throw new Error("Message is empty");

//   // Check how messages sent based on userId
//   // If message >= 10, return message reached max limit for the day

//   try {
//     // const prompt = PromptTemplate.fromTemplate(message);

//     // const chain = new LLMChain({
//     //   llm: new OpenAI({
//     //     // temperature: 0.1,
//     //   }),
//     //   prompt,
//     // });
//     let count = 0;

//     const response = await chat.call([new HumanMessage(message)], {
//       callbacks: [
//         {
//           handleLLMNewToken(token: string) {
//             console.log("New token:", token);
//             aggregatedTokens.push(token);
//             count++;
//             res.sse({ id: count, data: token });
//           },
//         },
//       ],
//     });

//     if (!response) {
//       return {
//         result: "Sorry, nothing I can find here",
//       };
//     }

//     res.sse();

//     return {
//       // @ts-ignore
//       result: response,
//     };
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const processBasicMessageV2 = async ({
//   message,
//   workspaceId,
//   storeIds = [],
//   tagKey,
//   metadata,
// }: {
//   message: string;
//   workspaceId?: string;
//   storeIds?: string[];
//   tagKey?: string;
//   metadata?: any;
// }) => {
//   const chat = new ChatOpenAI({});

//   if (!message) throw new Error("Message is empty");

//   // Get all tags that workspace and is_system_tag = true
//   const tags = await prisma.tags.findMany({
//     where: {
//       OR: [{ is_system_tag: true }, { workspace: workspaceId }],
//     },
//   });

//   let matchedTag = {};
//   let lowercaseMessage = message.toLowerCase();

//   tags.forEach(async (tag) => {
//     if (!tag.base_message || !tag.base_message.length) return;
//     if (matchedTag.id) return;

//     tag.base_message.forEach((baseMessage) => {
//       if (matchedTag.id) return;
//       baseMessage = baseMessage.toLowerCase();
//       if (lowercaseMessage.includes(baseMessage)) {
//         matchedTag = tag;
//         return;
//       }
//     });

//     if (matchedTag.id) return;
//   });

//   if (matchedTag.id) {
//     if (workspaceId && matchedTag.command_type === "respond") {
//       let similarDoc = await getDocs({
//         message,
//         key: workspaceId,
//         similarityCount: 1,
//         filter: {
//           should: [
//             {
//               key: "metadata.workspace_id",
//               match: {
//                 value: workspaceId,
//               },
//             },
//           ],
//         },
//       });

//       if (similarDoc?.[0]) {
//         const result = await chat.predict(
//           `Answer this: ${message}, using this information: ${similarDoc?.[0].pageContent}`
//         );

//         return result;
//       }
//     }

//     if (matchedTag.function) {
//       const functionResponse = await runFunction({
//         tagFunction: matchedTag.function,
//         message,
//         metadata,
//         tag: matchedTag,
//       });

//       return functionResponse;
//     }

//     let cleanTemplate = message;
//     if (matchedTag?.ai_template) {
//       cleanTemplate = replaceInputWithValue(matchedTag?.ai_template, message);

//       const result = await chat.predict(cleanTemplate);
//       return result;
//     }
//   }

//   if (tagKey) {
//     // Check if tag has a key
//     const tag = await prisma.tags.findFirst({
//       where: {
//         key: tagKey,
//       },
//     });

//     // If tag has a key and has ai template refer to that prompt
//     // If tag has no ai template, use basic prompt
//     if (tag) {
//       // Write a regex to replace [input] with message
//       if (workspaceId && tag.command_type === "respond") {
//         let similarDoc = await getDocs({
//           message,
//           key: workspaceId,
//           similarityCount: 1,
//           filter: {
//             should: [
//               {
//                 key: "metadata.workspace_id",
//                 match: {
//                   value: workspaceId,
//                 },
//               },
//             ],
//           },
//         });

//         if (similarDoc?.[0]) {
//           const result = await chat.predict(
//             `Answer this: ${message} using this information: ${similarDoc?.[0].pageContent}`
//           );

//           return result;
//         }
//       }
//       let cleanTemplate = message;
//       if (tag?.ai_template) {
//         cleanTemplate = replaceInputWithValue(tag?.ai_template, message);
//       }

//       const result = await chat.predict(cleanTemplate);
//       return result;

//       // If no tag exists, use qdrant to find similar tags
//     }
//   } else {
//     let filter = {};
//     if (workspaceId) {
//       filter = {
//         key: "metadata.workspace_id",
//         match: {
//           value: workspaceId,
//         },
//       };
//     }
//     let similarTag = await getDocs({
//       message,
//       key: "tags",
//       similarityCount: 5,
//       filter: {
//         should: [
//           {
//             key: "metadata.type",
//             match: {
//               value: "system",
//             },
//           },
//           filter,
//         ],
//       },
//     });
//     // Need to check most similar tag > 60% match

//     console.log("🚀 ~ file: service.ts:214 ~ similarTag:", similarTag);

//     if (similarTag?.[0] && similarTag?.[1] > 0.8) {
//       const tag = await prisma.tags.findFirst({
//         where: {
//           id: similarTag[0].metadata.id,
//         },
//       });

//       // If no tag revert back to basic prompt
//       if (!tag) {
//         const result = await chat.predict(message);

//         return result;
//         // If no tag has ai template, use basic prompt
//       } else {
//         let cleanTemplate = message;
//         if (tag?.ai_template) {
//           cleanTemplate = replaceInputWithValue(tag?.ai_template, message);
//         }

//         const result = await chat.predict(cleanTemplate);
//         return result;
//       }
//       // Use basic prompt
//     } else {
//       const result = await chat.predict(message);

//       return result;
//     }
//   }
// };

// export const processBasicMessage = async ({
//   message,
//   userId,
// }: {
//   message: string;
//   userId: string;
// }) => {
//   if (!message) throw new Error("Message is empty");

//   // Check how messages sent based on userId
//   // If message >= 10, return message reached max limit for the day

//   try {
//     // const prompt = PromptTemplate.fromTemplate(message);

//     // const chain = new LLMChain({
//     //   llm: new OpenAI({
//     //     // temperature: 0.1,
//     //   }),
//     //   prompt,
//     // });

//     const response = await multiPromptChain().call({
//       input: message,
//     });
//     console.log(
//       "🚀 ~ file: service.ts:128 ~ runMultiPromptChain ~ response",
//       response
//     );

//     console.log(response);

//     if (!response) {
//       return {
//         result: "Sorry, nothing I can find here",
//       };
//     }

//     return {
//       // @ts-ignore
//       result: response.text,
//     };
//   } catch (error) {
//     console.log(error);
//   }
// };
