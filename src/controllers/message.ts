import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { eventManager, slackClientManager } from "../main";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { triggerWorkflow } from "../app/workflow/service";
import { getCustomer, saveCustomer } from "../app/customer/service";
import { getWorkspaceTags } from "../app/tags/service";
import { getWorkspaceIntegration } from "../app/workspaceIntegration/service";
import { tagSearch } from "../app/gpt/service";
import { OpenAI } from "langchain/llms/openai";
import { RetrievalQAChain } from "langchain/chains";
import { getStoreByWorkspaceId } from "../app/store/service";
import { getDocsFromRedis } from "../app/redis/service";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Document } from "langchain/document";

export function messageEvents(fastify: FastifyInstance) {
  eventManager.on("workflow", async (data: any) => {
    // Get/Save customer information
    // const customer = await getCustomer({
    //   workspaceIntegrationId: data.workspace_integration_id,
    //   userIdentity: data.user_identity,
    // });
    // if (!customer) {
    //   // Save customer
    //   await saveCustomer(data.data, data.workspace_integration_id);
    // }
    // Save customer message

    // thoughts
    // 1. Store the docs (store)
    // 2. Convert into a vector
    // 3. Attach a tag to the stored vector

    // Upon message received:
    // 1. Get the tags related
    const workspaceIntegration = await getWorkspaceIntegration(
      data.workspace_integration_id
    );

    const allWorkspaceAndSystemTags = await getWorkspaceTags(
      // @ts-ignore
      workspaceIntegration?.workspace
    );

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

    let foundDocs: Document<Record<string, any>>[] = [];

    for (const store of stores) {
      const similarDocs = await getDocsFromRedis({
        workspaceId: workspaceIntegration!.workspace,
        storeId: store.id,
        message: data.message,
      });

      foundDocs = [...foundDocs, ...similarDocs];
    }

    console.log(
      "🚀 ~ file: message.ts:70 ~ eventManager.on ~ foundDocs:",
      foundDocs
    );

    const vectorStore = await MemoryVectorStore.fromDocuments(
      foundDocs,
      new OpenAIEmbeddings()
    );

    const model = new OpenAI({});
    const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());

    const res = await chain.call({
      query: data.message,
    });

    if (data.type === "slack") {
      slackClientManager.sendMessage({
        workspace_integration_id: data.workspace_integration_id,
        channel: data?.metaData.channel,
        message: res.text,
        thread_ts: data?.metaData.thread_ts,
        ts: data?.metaData.ts,
      });
    }

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
}

export function messageRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/api/v1/message",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const body = request.body;
    }
  );
}
