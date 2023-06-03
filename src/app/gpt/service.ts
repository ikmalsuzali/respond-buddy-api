// @ts-nocheck
import { PromptTemplate } from "langchain/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { OpenAI } from "langchain/llms/openai";

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

  return filteredTag
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




const categorizePrompt = async (tags: any, message: string) => {
  const parser = StructuredOutputParser.fromNamesAndDescriptions({
    tag_name:
      "find the closest tag that describes the user's message and return the tag_name with exact value",
  });

  const formatInstructions = parser.getFormatInstructions();

  const formattedTags = tags
    .map((tag: any) => {
      return {
        tag_name: tag.name,
        description: tag.description,
      };
    })
    .toString();

  const templateString = `
  Consider the following context tags and descriptions. You are provided with an array of objects representing the tags. Each object has a 'key' and 'description' property. Your task is to find the closest matching tag, based on the tag description, for the given message response: "{message}".

  Context tags:
  ${formattedTags}

  {format_instructions}
  `;

  const prompt = new PromptTemplate({
    template: templateString,
    inputVariables: ["message"],
    partialVariables: { format_instructions: formatInstructions },
  });

  const model = new OpenAI();

  const input = await prompt.format({
    message: message,
  });
  const response = await model.call(input);

  console.log(input);

  const parsedResponse = await parser.parse(response);

  console.log(parsedResponse);

  return parsedResponse;
};

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
