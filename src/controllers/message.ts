// @ts-nocheck
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { eventManager } from "../main";
import { prisma } from "../prisma";
import {
  processBasicMessageV2,
  processMessage,
  runFunction,
  saveMessage,
  structuredOutput,
} from "../app/message/service";
import { getCustomer, saveCustomer } from "../app/customer/service";
import { Readable } from "stream";
import { OpenAI } from "langchain/llms/openai";

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

  eventManager.on("send-message", async (data: any) => {
    const { message, botResponse, store_id, user_identity, request } = data;

    let customer = null;
    const userIdentity =
      user_identity ||
      request?.token_metadata?.custom_metadata?.user_id ||
      null;

    const workspaceId =
      request?.token_metadata?.custom_metadata?.workspace_id || null;

    // Get/Save customer information
    customer = await getCustomer({
      workspaceId,
      userIdentity,
    });

    if (!customer) {
      // Save customer
      const randomUserId = userIdentity;
      const userId = request?.token_metadata?.custom_metadata?.user_id || null;

      customer = await saveCustomer({
        workspaceId,
        randomUserId,
        userId,
      });
    }

    // Send user message
    const userMessage = await saveMessage({
      message,
      customerId: customer?.id,
      storeId: store_id,
    });

    // Send bot message
    await saveMessage({
      message: botResponse,
      storeId: store_id,
      originalMessageId: userMessage.id,
    });
  });

  eventManager.on("deduct-credit", async (data: any) => {
    let { workspaceId } = data || {};

    if (!workspaceId) return;

    const workspace = await prisma.workspaces.findFirst({
      where: {
        id: workspaceId,
      },
    });

    if (!workspace) return;

    // Deduct the credit_addon_count by 1 if credit_addon_count is less than and equal to 0 than deduct credit_count
    if (workspace.credit_addon_count > 0) {
      await prisma.workspaces.update({
        where: {
          id: workspaceId,
        },
        data: {
          credit_addon_count: {
            decrement: 1,
          },
        },
      });
    } else {
      await prisma.workspaces.update({
        where: {
          id: workspaceId,
        },
        data: {
          credit_count: {
            decrement: 1,
          },
        },
      });
    }
  });
}

export function messageRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/api/v1/message",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { message, store_id, user_identity, metadata } = request.body || {};
      console.log(request.body);

      const botResponse = await processBasicMessageV2({
        message: message,
        workspaceId: request?.token_metadata?.custom_metadata?.workspace_id,
        storeId: store_id,
        tagKey: metadata?.tag_key,
        metadata: metadata,
        reply,
      });

      eventManager.emit("send-message", {
        message: message,
        response: botResponse,
        store_id: store_id,
        user_identity: user_identity,
        request: request,
      });

      eventManager.emit("deduct-credit", {
        workspaceId: request?.token_metadata?.custom_metadata?.workspace_id,
      });
    }
  );

  // fastify.get("/api/v1/message/free", async (request, reply) => {
  //   const { message, user_id } = request.query || {};

  //   try {
  //     let customer = null;
  //     let randomUserIdentity = user_id;
  //     // Get/Save customer information
  //     if (randomUserIdentity) {
  //       customer = await getCustomer({
  //         randomUserIdentity,
  //       });
  //       if (!customer) {
  //         // Save customer
  //         customer = await saveCustomer({
  //           randomUserId: randomUserIdentity,
  //         });
  //       }
  //     }

  //     const userMessage = await saveMessage({
  //       message: message,
  //       customerId: customer?.id,
  //     });

  //     console.log("userMessage", userMessage);

  //     const response = await processBasicMessageV3({
  //       message: message,
  //       userId: customer?.id,
  //       res: reply,
  //     });
  //     console.log(
  //       "🚀 ~ file: message.ts:194 ~ fastify.post ~ response:",
  //       response?.result
  //     );

  //     // await saveMessage({
  //     //   message: response?.text || response.result,
  //     //   originalMessageId: userMessage.id,
  //     // });

  //     reply.send({
  //       success: true,
  //       data: {
  //         message: response?.result.content,
  //         customer: customer?.id,
  //       },
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });

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

  fastify.get("/api/v1/message", async (request, reply) => {
    const { free_user_id } = request.query || {};
    console.log(
      "🚀 ~ file: message.ts:239 ~ fastify.get ~ free_user_id:",
      free_user_id
    );

    if (!request?.token_metadata?.custom_metadata?.user_id && !free_user_id)
      reply.send({ success: false, messages: [] });

    let where = {};

    if (request?.token_metadata?.custom_metadata?.user_id) {
      where = {
        customers: {
          user: request?.token_metadata?.custom_metadata?.user_id,
        },
      };
    }

    if (free_user_id && !request?.token_metadata?.custom_metadata?.user_id) {
      where = {
        customers: {
          random_user_id: free_user_id,
        },
      };
    }

    try {
      const messages = await prisma.messages.findMany({
        where,
        orderBy: {
          created_at: "desc",
        },
        take: 30,
      });

      reply.send({ success: true, messages: messages || [] });
    } catch (error) {
      console.log(error);
    }
  });

  // Write function to stream langchain output to the user
  fastify.post("/api/v1/message/stream", async (request, reply) => {
    const model = new OpenAI({
      streaming: true,
    });

    const readableStream = new Readable();
    readableStream._read = () => {};

    reply.header("Content-Type", "application/json; charset=utf-8");
    reply.send(readableStream);

    // Simulate asynchronous processing of the request
    // setTimeout(() => {
    //   // Push the desired data down the stream
    //   readableStream.push(JSON.stringify({ message: Date() }));
    // }, 1000);

    // Loop
    // setInterval(() => {
    //   // Push the desired data down the stream
    //   readableStream.push(JSON.stringify({ message: Date() }));
    // }, 1000);

    const response = await model.call(
      "Write a 500 paragraph of random stuff.",
      {
        callbacks: [
          {
            handleLLMNewToken(token: string) {
              console.log({ token }.token);
              let tokenString = JSON.stringify({ token }.token);
              readableStream.push(tokenString);
              console.log({ token });
            },
          },
        ],
      }
    );

    readableStream.push(null);
  });

  fastify.post("/api/v1/function/test", async (request, reply) => {
    const { tag_function, message, metadata } = request.body || {};

    if (!tag_function || !message) {
      reply.send({ success: false, message: "Missing parameters" });
    }

    // Call prisma to get tag by function name
    const tag = await prisma.tags.findFirst({
      where: {
        function: tag_function,
      },
    });

    let data = await structuredOutput({ message, tag });
    data.workspaceId = request?.token_metadata?.custom_metadata?.workspace_id;

    if (data.error) {
      reply.send({ success: false, message: data.error.join("\n") });
    }

    const response = await runFunction({
      tag,
      message,
      metadata: data,
    });

    reply.send({ success: true, message: response });
  });
}
