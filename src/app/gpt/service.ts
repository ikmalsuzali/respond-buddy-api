// @ts-nocheck
import { OpenAIChat } from "langchain/llms/openai";
import { MultiPromptChain, loadSummarizationChain } from "langchain/chains";

export const tagSearch = async (tags: any, message: string) => {
  const foundTag = await categorizePrompt(tags, message);
  console.log("🚀 ~ file: service.ts:10 ~ tagSearch ~ foundTag:", foundTag);
  const filteredTag = tags.find((tag: any) => {
    console.log(tag);
    if (tag.name == foundTag.tag_name) {
      return tag.ai_default_response;
    }
  });
  console.log(
    "🚀 ~ file: service.ts:15 ~ filteredTag ~ filteredTag:",
    filteredTag
  );

  return filteredTag;
  // Get filteredTag
  // Get stores based on the filteredTag
  // Get
};

// thoughts
// 1. Store the docs (store)
// 2. Convert into a vector
// 3. Attach a tag to the stored vector

// Upon message received:
// 1. Categorize the prompt
// 2. Get the tags related
// 3. Get the vector stores related
// 4. Search for the similarities in the vector stores
// 5. Get response template from tags
// 6. If no response template, create a response
// 7. If tag has response template, use that along with the vector store response

// Message received
// 1. Find the username, email, and other details related to the user
// 2. If user is found, get the messages related to the user
// 3. If user is not found, create a new user, and create the message

const categorizePrompt = async ({
  message,
  type,
  workspaceId,
}: {
  message: string;
  type?: string;
  workspaceId?: string;
}) => {
  const llm = new OpenAIChat();
  if (type === "summarize" || message.includes("Summarize:")) {
    if (message.length <= 5000) {
      const summarizeTemplate = `Hey ChatGPT. Summarize the following text: {input}`;
      const chain = new LLMChain({ llm, summarizeTemplate });
      return chain;
    } else {
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
      });
      const docs = await textSplitter.createDocuments([text]);
      const chain = loadSummarizationChain(llm, { type: "map_reduce" });
      const res = await chain.call({
        input_documents: docs,
      });
      console.log("🚀 ~ file: service.ts:69 ~ res:", res);
      return res;
    }
  } else if (type === "simplify" || message.includes("Simplify:")) {
    const simplifyTemplate = `
    Hey ChatGPT. Explain in simple terms. Explain to me like I'm 12 years old: {input}.`;
    const chain = new LLMChain({ llm, simplifyTemplate });
    return chain;
  } else if (type === "expand" || message.includes("Expand: ")) {
    const expandTemplate = `You are a very smart professor. Expand the following text:
    {input}`;
    const chain = new LLMChain({ llm, expandTemplate });
    return chain;
  } else if (type == "translate" || message.includes("Translate ")) {
    const translateTemplate = `Translate the following text from {input_lang} to {output_lang}: {input}`;
    const chain = new LLMChain({ llm, translateTemplate });
    return chain;
  }
};

// const categorizePrompt = async (tags: any, message: string) => {

//   const parser = StructuredOutputParser.fromNamesAndDescriptions({
//     tag_name:
//       "find the closest tag that describes the user's message and return the tag_name with exact value",
//   });

//   const formatInstructions = parser.getFormatInstructions();

//   const formattedTags = tags
//     .map((tag: any) => {
//       return {
//         tag_name: tag.name,
//         description: tag.description,
//       };
//     })
//     .toString();

//   const templateString = `
//   Consider the following context tags and descriptions. You are provided with an array of objects representing the tags. Each object has a 'key' and 'description' property. Your task is to find the closest matching tag, based on the tag description, for the given message response: "{message}".

//   Context tags:
//   ${formattedTags}

//   {format_instructions}
//   `;

//   const prompt = new PromptTemplate({
//     template: templateString,
//     inputVariables: ["message"],
//     partialVariables: { format_instructions: formatInstructions },
//   });

//   const model = new OpenAI();

//   const input = await prompt.format({
//     message: message,
//   });
//   const response = await model.call(input);

//   console.log(input);

//   const parsedResponse = await parser.parse(response);

//   console.log(parsedResponse);

//   return parsedResponse;
// };

const regexArray = (string: string) => {
  const regex = /\[([\s\S]*?)\]/;
  const match = string.match(regex);
  console.log("🚀 ~ file: service.ts:73 ~ regexArray ~ match:", match);

  if (match && match[1]) {
    console.log("🚀 ~ file: service.ts:75 ~ regexArray ~ match[1]:", match[1]);
    try {
      const correctedString = match[0].replace(/'/g, '"');
      return JSON.parse(correctedString);
    } catch (error) {
      console.log(error);
      return [];
    }
  } else {
    return [];
  }
};

export const multiPromptChain = () => {

  const llm = new OpenAIChat({
    streaming: true,
  });
  const promptNames = ["summarize", "simplify", "expand", "translate", "other"];
  const promptDescriptions = [
    "Used when summarizing a text",
    "Used when simplifying a text",
    "Used when expanding a text",
    "Used when translating a text",
    "Used for any other text",
  ];
  const summarizeTemplate = `Summarize the following text,
Here is a text:
{input}
`;

  const simplifyTemplate = `
Hey ChatGPT. Explain {input} in simple terms. Explain to me like I'm 11 years old.
`;

  const translateTemplate = `You are a very good translator. Translate based on the the text as close as possible.
  Here is a text:
  {input}`;

  const expandTemplate = `You are a very smart professor. Expand the following text:
{input}`;

  const otherTemplate = `{input}`;

  const promptTemplates = [
    summarizeTemplate,
    simplifyTemplate,
    expandTemplate,
    translateTemplate,
    otherTemplate,
  ];

  const multiPromptChain = MultiPromptChain.fromLLMAndPrompts(llm, {
    promptNames,
    promptDescriptions,
    promptTemplates,
  });

  return multiPromptChain;
};

export const runMultiPromptChain = async (message: string) => {
  const multiPromptChain = multiPromptChain();
  const response = await multiPromptChain.call(message);
  console.log(
    "🚀 ~ file: service.ts:128 ~ runMultiPromptChain ~ response",
    response
  );
  return response;
};
