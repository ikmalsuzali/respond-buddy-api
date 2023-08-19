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

export const processMessage = async ({
  message,
  workspaceId,
  storeId,
}: {
  message: string;
  workspaceId: string;
  storeId?: string;
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

export const processBasicMessage = async ({
  message,
  userId,
}: {
  message: string;
  userId: string;
}) => {
  if (!message) throw new Error("Message is empty");

  // Check how messages sent based on userId
  // If message >= 10, return message reached max limit for the day

  try {
    // const prompt = PromptTemplate.fromTemplate(message);

    // const chain = new LLMChain({
    //   llm: new OpenAI({
    //     // temperature: 0.1,
    //   }),
    //   prompt,
    // });

    const response = await multiPromptChain().call({
      input: message,
    });
    console.log(
      "🚀 ~ file: service.ts:128 ~ runMultiPromptChain ~ response",
      response
    );

    console.log(response);

    if (!response) {
      return {
        result: "Sorry, nothing I can find here",
      };
    }

    return {
      // @ts-ignore
      result: response.text,
    };
  } catch (error) {
    console.log(error);
  }
};

export const processBasicMessageV2 = async ({
  message,
  userId,
}: {
  message: string;
  userId: string;
}) => {
  if (!message) throw new Error("Message is empty");

  // Use embeddings to find closest match
  // If match is found, return match key and id
  // Find key in database
  // Find custom function to run
  // If match is not found, use GPT to generate response

  // const response = await MultiRouteChain.call({
  //   defaultChain: "default",
  // });

  // Check how messages sent based on userId
  // If message >= 10, return message reached max limit for the day

  try {
    // const prompt = PromptTemplate.fromTemplate(message);

    // const chain = new LLMChain({
    //   llm: new OpenAI({
    //     // temperature: 0.1,
    //   }),
    //   prompt,
    // });

    const response = await multiPromptChain().call({
      input: message,
    });
    console.log(
      "🚀 ~ file: service.ts:128 ~ runMultiPromptChain ~ response",
      response
    );

    console.log(response);

    if (!response) {
      return {
        result: "Sorry, nothing I can find here",
      };
    }

    return {
      // @ts-ignore
      result: response.text,
    };
  } catch (error) {
    console.log(error);
  }
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
  if (!message) throw new Error("Message is empty");

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
