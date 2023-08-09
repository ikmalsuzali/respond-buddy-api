// @ts-nocheck
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { eventManager } from "../main";
import { prisma } from "../prisma";
import {
  processBasicMessage,
  processMessage,
  saveMessage,
} from "../app/message/service";
import { getCustomer, saveCustomer } from "../app/customer/service";

export function messageEvents(fastify: FastifyInstance) {
  eventManager.on("workflow", async (data: any) => {
    const chain = processMessage({
      message: data.message,
      workspaceId: data.workspaceId,
    });

    if (data.type === "slack") {
      // console.log("🚀 ~ file: message.ts:96 ~ eventManager.on ~ res", res);
      // console.log("🚀 ~ file: message.ts:96 ~ eventManager.on ~ data", data);
      await sendMessage({
        token: data.token,
        channel: data.metaData.channel,
        text: chain.text || chain.result || "Sorry, I couldn't find anything",
        tsThread: data.metaData.ts,
      });
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

  eventManager.on(
    "save-message",
    async ({
      workspaceId,
      userIdentity,
      storeId,
    }): {
      workspaceId: string;
      userIdentity: string;
      type: string;
      storeId?: string | null;
    } => {
      let customer = null;
      // Get/Save customer information
      if (userIdentity) {
        customer = await getCustomer({
          workspaceId: workspaceId,
          userIdentity: userIdentity,
        });
        if (!customer) {
          // Save customer
          customer = await saveCustomer({
            workspaceId: workspaceId,
          });
        }
      }

      saveMessage({
        message: message,
        customerId: customer?.id || null,
        storeId: storeId,
        originalMessageId: originalMessageId,
      });
    }
  );

  eventManager.on("save-customer", async (data: any) => {});
}

export function messageRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/api/v1/message",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { message, store_id, user_identity } = request.body || {};

      let customer = null;
      let userIdentity =
        user_identity || request?.token_metadata?.custom_metadata?.user_id;
      // Get/Save customer information
      if (userIdentity) {
        customer = await getCustomer({
          workspaceId: request?.token_metadata?.custom_metadata?.workspace_id,
          userIdentity,
        });
        if (!customer) {
          // Save customer
          customer = await saveCustomer({
            workspaceId: request?.token_metadata?.custom_metadata?.workspace_id,
          });
        }
      }

      const userMessage = await saveMessage({
        message: message,
        customerId: customer?.id,
        storeId: store_id,
      });

      const response = await processMessage({
        message: message,
        workspaceId: request?.token_metadata?.custom_metadata?.workspace_id,
        storeId: store_id,
      });

      console.log("🚀 ~ file: message.ts:139 ~ response:", response);

      await saveMessage({
        message: response.text || response.result,
        storeId: store_id,
        originalMessageId: userMessage.id,
      });

      reply.send({
        success: true,
        data: {
          message: response.text || response.result,
          customer: customer?.id,
        },
      });
    }
  );

  fastify.post("/api/v1/message/free", async (request, reply) => {
    const { message, user_id } = request.body || {};

    try {
      let customer = null;
      let randomUserIdentity = user_id;
      // Get/Save customer information
      if (randomUserIdentity) {
        customer = await getCustomer({
          randomUserIdentity,
        });
        if (!customer) {
          // Save customer
          customer = await saveCustomer({
            randomUserId: randomUserIdentity,
          });
        }
      }

      const userMessage = await saveMessage({
        message: message,
        customerId: customer?.id,
      });

      console.log("userMessage", userMessage);

      const response = await processBasicMessage({
        message: message,
        userId: customer?.id,
      });

      await saveMessage({
        message: response?.text || response.result,
        originalMessageId: userMessage.id,
      });

      reply.send({
        success: true,
        data: {
          message: response.text || response.result,
          customer: customer?.id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  });

  fastify.get("/api/v1/message/:store_id", async (request, reply) => {
    const { store_id } = request.params || {};

    try {
      const messages = await prisma.messages.findMany({
        where: { store: store_id },
        orderBy: [
          { created_at: "asc" }, // Sort by created_at in ascending order
        ],
      });
      reply.send({ success: true, messages });
    } catch (err) {
      console.log(err);
      reply
        .status(500)
        .send({ success: false, message: "Failed to retrieve messages." });
    }
  });
}
