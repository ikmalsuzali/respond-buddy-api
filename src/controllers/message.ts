// @ts-nocheck
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { eventManager, slackClientManager } from "../main";
import { getWorkspaceTags } from "../app/tags/service";
import { getWorkspaceIntegration } from "../app/workspaceIntegration/service";
import { OpenAI } from "langchain/llms/openai";
import { SerpAPI, ChainTool } from "langchain/tools";
import { getStoreByWorkspaceId } from "../app/store/service";
import { getDocsFromRedis } from "../app/redis/service";
import { Document } from "langchain/document";
import { sendMessage } from "../app/slack/service";
import { MultiRetrievalQAChain } from "langchain/chains";
import { isObjectEmpty } from "../helpers";
import { Calculator } from "langchain/tools/calculator";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { prisma } from "../prisma";

export function messageEvents(fastify: FastifyInstance) {
  eventManager.on("workflow", async (data: any) => {
    // thoughts
    // 1. Store the docs (store)
    // 2. Convert into a vector
    // 3. Attach a tag to the stored vector

    // Upon message received:
    // 1. Get the tags related
    const workspaceIntegration = await getWorkspaceIntegration(
      data.workspace_integration_id
    );

    // const allWorkspaceAndSystemTags = await getWorkspaceTags(
    //   // @ts-ignore
    //   workspaceIntegration?.workspace
    // );

    // 2. Categorize the prompt

    // try {
    //   const matchedTags = await tagSearch(
    //     allWorkspaceAndSystemTags,
    //     data.message
    //   );
    // } catch {
    //   console.log("No tags found");
    // }

    const stores = await getStoreByWorkspaceId({
      workspaceId: workspaceIntegration!.workspace!,
    });

    try {
      const getDocsFromRedisInParallel: any = stores.map((store) => {
        return getDocsFromRedis({
          workspaceId: workspaceIntegration!.workspace,
          storeId: store.id,
          message: data.message,
          similarityCount: 1,
        });
      });

      const results = await Promise.all(getDocsFromRedisInParallel);

      const cleanResults = results.filter((obj) => !isObjectEmpty(obj));

      console.log("results", cleanResults);
      const retrieverNames = cleanResults.map((result, index) => `index`);
      const retrieverDescriptions = cleanResults.map(
        (result) => "Used for all questions"
      );
      // @ts-ignore
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
        input: data.message,
      });
      console.log(
        "🚀 ~ file: message.ts:104 ~ eventManager.on ~ response:",
        chain
      );

      // const knowledgeTool = new ChainTool({
      //   name: "Knowledge Chain",
      //   description: "Used for custom questions",
      //   // @ts-ignore
      //   chain: chain,
      //   returnDirect: true,
      // });

      // const tools = [new Calculator(), knowledgeTool];

      // const executor = await initializeAgentExecutorWithOptions(
      //   tools,
      //   new OpenAI(),
      //   {
      //     agentType: "zero-shot-react-description",
      //     verbose: true,
      //   }
      // );

      // console.log("executor", executor);

      // const result = await executor.call({
      //   input: data.message,
      // });

      // console.log(
      //   "🚀 ~ file: message.ts:128 ~ eventManager.on ~ result:",
      //   result
      // );

      if (data.type === "slack") {
        // console.log("🚀 ~ file: message.ts:96 ~ eventManager.on ~ res", res);
        // console.log("🚀 ~ file: message.ts:96 ~ eventManager.on ~ data", data);
        await sendMessage({
          token: data.token,
          channel: data.metaData.channel,
          text:
            chain.text || chain.result || "Sorry, I did not understand that.",
          tsThread: data.metaData.ts,
        });
      }

      // foundDocs = [...foundDocs, ...results?.[0]];
    } catch (error) {
      console.log(error);
    }

    // console.log(
    //   "🚀 ~ file: message.ts:70 ~ eventManager.on ~ foundDocs:",
    //   foundDocs
    // );

    // const vectorStore = await RedisVectorStore.fromDocuments(
    //   foundDocs,
    //   new OpenAIEmbeddings(),
    //   {
    //     // @ts-ignore
    //     redisClient,
    //     indexName: "docs",
    //   }
    // );

    // const model = new OpenAI({});

    // const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());

    // const res = await chain.call({
    //   query: data.message,
    // });

    // 3. Get the vector stores related
    // 4. Search for the similarities in the vector stores

    // 5. Get response template from tags
    // 6. If no response template, create a response
    // 7. If tag has response template, use that along with the vector store response

    // Message received
    // 1. Find the username, email, and other details related to the user
    // 2. If user is found, get the messages related to the user
    // 3. If user is not found, create a new user, and create the message

    // Save response message
    // Follow rules to send message
  });

  eventManager.on("save-message", async (data: any) => {
    let customer = null;
    // Get/Save customer information
    customer = await getCustomer({
      workspaceIntegrationId: data.workspace_integration_id,
      userIdentity: data.user_identity,
    });
    if (!customer) {
      // Save customer
      customer = await saveCustomer(data.data, data.workspace_integration_id);
    }
  });

  eventManager.on("save-customer", async (data: any) => {});
}

export function messageRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/api/v1/message",
    async (request: FastifyRequest, reply: FastifyReply) => {
      eventManager.emit("workflow", {
        type: "app",

        workspace_integration_id:
          request?.token_metadata?.custom_metadata?.workspace_id,
        user_id: request?.token_metadata?.custom_metadata?.user_id,
        message: botMessage.cleanedText,
        token: workspaceIntegration.metadata.token,
        metaData: event,
      });
    }
  );

  fastify.get("/api/v1/messages/:store_id", async (request, reply) => {
    const { store_id } = request.params || {};

    try {
      const messages = await prisma.messages.findMany({
        where: { store_id },
        orderBy: [
          { other_messages: "desc" }, // Sort by other_messages in descending order
          { created_at: "asc" }, // Sort by created_at in ascending order
        ],
      });
      reply.send({ success: true, messages });
    } catch (err) {
      reply
        .status(500)
        .send({ success: false, message: "Failed to retrieve messages." });
    }
  });
}
