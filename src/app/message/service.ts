// @ts-nocheck
import { z } from "zod";
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
import { StructuredOutputParser } from "langchain/output_parsers";
import {
  extractFirstURL,
  summarizeWebsite,
} from "../function/summarizeWebsite";
import { getWebsiteLinks } from "../function/findAllWebsiteLinks";
import {
  createList,
  extractFromHtml,
  fetchHTML,
  findAudience,
  getHtmlBody,
} from "../function/cleanWebsite";
import { FastifyReply } from "fastify";
import { Readable } from "stream";
import { downloadAndConvertImageFormat } from "../function/convertImage";
import { downloadAndCompressImage } from "../function/compressImage";
import { downloadAndResizeImage } from "../function/resizeImage";

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

  reply.header("Transfer-Encoding", "chunked");
  reply.header("Content-Type", "application/json; charset=utf-8");
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
      await chatGptStream({
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

export const runFunction = async ({ message, metadata, tag }) => {
  if (!tag?.function) return "Sorry, I cannot run this now.";
  switch (tag.function) {
    case "image-resize": {
      console.log(metadata);
      let structuredData = await structuredOutput({
        message,
        tag,
      });
      return await downloadAndResizeImage({
        url: structuredData.url,
        width: structuredData?.width || 300,
        height: structuredData?.height || null,
        workspaceId: metadata.workspaceId || "",
      });
    }
    case "image-convert": {
      let structuredData = await structuredOutput({
        message,
        tag,
      });
      return await downloadAndConvertImageFormat({
        url: structuredData.url,
        format: structuredData.format,
        workspaceId: metadata.workspaceId || "",
      });
    }
    case "image-compress": {
      let structuredData = await structuredOutput({
        message,
        tag,
      });
      console.log(
        "🚀 ~ file: service.ts:527 ~ runFunction ~ structuredData:",
        structuredData
      );
      return await downloadAndCompressImage({
        url: structuredData.url,
        quality: structuredData.quality
          ? 100 - Number(structuredData.quality)
          : 80,
        workspaceId: metadata.workspaceId || "",
      });
      break;
    }
    case "extract-html-body":
      return await getHtmlBody({ metadata });
    case "extract-html":
      return await fetchHTML({
        metadata,
      });
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

export const structuredOutput = async ({ message, tag }) => {
  // We can use zod to define a schema for the output using the `fromZodSchema` method of `StructuredOutputParser`.
  if (!tag?.structured_output) return "Sorry, I cannot run this now.";
  const zodTransfomer = transformToZodSchema(tag.structured_output);
  const parser = StructuredOutputParser.fromZodSchema(zodTransfomer);

  const formatInstructions = parser.getFormatInstructions();

  const prompt = new PromptTemplate({
    template:
      "Answer the users question as best as possible.\n{format_instructions}\n{question}",
    inputVariables: ["question"],
    partialVariables: { format_instructions: formatInstructions },
  });

  const model = new OpenAI({ temperature: 0 });

  const input = await prompt.format({
    question: message,
  });
  const response = await model.call(input);

  console.log(input);
  /*
Answer the users question as best as possible.
The output should be formatted as a JSON instance that conforms to the JSON schema below.

As an example, for the schema {{"properties": {{"foo": {{"title": "Foo", "description": "a list of strings", "type": "array", "items": {{"type": "string"}}}}}}, "required": ["foo"]}}}}
the object {{"foo": ["bar", "baz"]}} is a well-formatted instance of the schema. The object {{"properties": {{"foo": ["bar", "baz"]}}}} is not well-formatted.

Here is the output schema:
```
{"type":"object","properties":{"answer":{"type":"string","description":"answer to the user's question"},"sources":{"type":"array","items":{"type":"string"},"description":"sources used to answer the question, should be websites."}},"required":["answer","sources"],"additionalProperties":false,"$schema":"http://json-schema.org/draft-07/schema#"}
```

What is the capital of France?
*/

  console.log("response", response);
  /*
{"answer": "Paris", "sources": ["https://en.wikipedia.org/wiki/Paris"]}
*/

  console.log("parsedResponse", await parser.parse(response));
  let parsedResponse = await parser.parse(response);
  const errorMessage = validateInput(parsedResponse, tag.structured_output);
  if (errorMessage) {
    return {
      error: errorMessage,
    };
  }
  return await parser.parse(response);
};

export const validateInput = (input, structure) => {
  const errors = [];

  // Check each key in the structured output
  for (const key in structure) {
    // Check if the key is required and missing in the input
    if (structure[key].required && !(key in input)) {
      errors.push(structure[key].error);
    }

    // Check if the type of the input value matches the expected type
    else if (key in input && typeof input[key] !== structure[key].type) {
      errors.push(structure[key].error);
    }
  }

  // If no errors, return null
  return errors.length > 0 ? errors : null;
};

const transformToZodSchema = (config) => {
  let schema = {};
  for (let field in config) {
    let fieldConfig = config[field];
    let fieldSchema;

    // Check the type and create corresponding zod schema
    switch (fieldConfig.type) {
      case "string":
        fieldSchema = z.string();
        break;
      // Add other types here as needed
      // case 'number':
      //   fieldSchema = z.number();
      //   break;
      default:
        throw new Error(`Unsupported type: ${fieldConfig.type}`);
    }

    // Check if the field is required
    if (fieldConfig.required) {
      fieldSchema = fieldSchema.nonempty();
    } else {
      fieldSchema = fieldSchema.optional();
    }

    // Check if there is a default value
    if (fieldConfig.default !== undefined) {
      fieldSchema = fieldSchema.default(fieldConfig.default);
    }

    // Add description if it exists
    if (fieldConfig.description) {
      fieldSchema = fieldSchema.describe(fieldConfig.description);
    }

    schema[field] = fieldSchema;
  }
  return z.object(schema);
};
