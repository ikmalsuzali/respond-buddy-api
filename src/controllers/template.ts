// @ts-nocheck
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../prisma";
import { runFunction } from "../app/message/service";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { AIMessage, HumanMessage } from "langchain/schema";
import { ChatOpenAI } from "langchain/chat_models/openai";

export function templateRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/api/v1/template/:id",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const templateId = request?.params?.id;

      const template = await prisma.task_templates.findUnique({
        where: { id: templateId },
      });

      if (!template) {
        reply.status(404).send({ error: "Template not found" });
        return;
      }

      reply.send(template);
    }
  );

  fastify.get(
    "/templates",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { search, sort } = request.query as {
        search?: string;
        sort?: string;
      };

      let whereClause = {};
      let orderByClause = {};

      // If search query parameter is provided, filter templates by name
      if (search) {
        whereClause.name = {
          contains: search,
          mode: "insensitive", // This makes the search case-insensitive
        };
      }

      // If sort query parameter is provided, order templates accordingly
      if (sort) {
        const sortParams = sort.split(","); // Assume format is "field,direction", e.g. "name,desc"
        const [field, direction] = sortParams;

        // For this example, we assume that the user can only sort by name
        if (field === "name" && (direction === "asc" || direction === "desc")) {
          orderByClause.name = direction;
        } else {
          reply.status(400).send({ error: "Invalid sort parameter" });
          return;
        }
      }

      const templates = await prisma.task_templates.findMany({
        where: whereClause,
        orderBy: orderByClause,
      });

      reply.send(templates);
    }
  );

  fastify.post(
    "/api/v1/run-template/:id",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const memory = new BufferMemory();

      const templateId = request.params.id;
      const message = request.body.message;
      const chatId = request.body.chatId;
      const metadata = request.body.metadata;

      const sequenceOfFunctions = request.params.sequence_of_functions;

      // The 'start' query parameter determines where in the sequence to begin. Default to 0 if not provided.
      const start = parseInt(request.body.start, 10) || 0;

      // The 'count' query parameter determines how many functions to execute after 'start'.
      // If not provided, execute all functions from the starting point.

      const template = await prisma.task_templates.findUnique({
        where: {
          id: templateId,
        },
      });

      const runSequenceOfFunction =
        sequenceOfFunctions || template?.sequence_of_functions;

      const count =
        request.body.count !== undefined
          ? parseInt(request.body.count, 10)
          : runSequenceOfFunction?.length - start;

      if (!template) {
        reply.status(404).send({ error: "Template not found" });
        return;
      }

      let previousResult;
      let chat;

      if (chatId) {
        chat = await prisma.chats.findUnique({
          where: { id: chatId },
        });
      }
      if (!chat) {
        chat = await prisma.chats.create({
          data: {
            workspace:
              request?.token_metadata?.custom_metadata?.workspace_id || null,
          },
        });
      }

      // The loop should not go beyond the specified 'count'
      const endIndex = Math.min(start + count, runSequenceOfFunction?.length);
      const results = []; // to store results of each iteration

      // Start the loop from the 'start' index and only run 'count' number of functions
      for (let i = start; i < endIndex; i++) {
        const functionName = runSequenceOfFunction[i];

        const messageHistory = results.map((r) => r.chainMessage);
        const memory = new BufferMemory({
          chatHistory: new ChatMessageHistory(messageHistory || []),
        });

        const model = new ChatOpenAI({
          modelName: "gpt-3.5-turbo",
        });
        const chain = new ConversationChain({
          llmKwargs: 1,
          llm: model,
          memory: memory,
        });

        const { tag, message } = await executeFunction({
          functionName,
          previousResult,
          metadata,
          chain,
        });

        let resultAtIndexI;
        let resultAtIndexIPlus1;

        if (i === 0) {
          resultAtIndexI = {
            iteration: i,
            chainMessage: new AIMessage(
              tag?.base_message?.[0] || tag.ai_template
            ),
            output: tag?.base_message?.[0] || tag.ai_template,
          };

          resultAtIndexIPlus1 = {
            iteration: i + 1,
            chainMessage: new HumanMessage(message),
            output: message,
          };
        } else {
          resultAtIndexI = {
            iteration: i + 1,
            chainMessage: new AIMessage(
              tag?.base_message?.[0] || tag.ai_template
            ),
            output: tag?.base_message?.[0] || tag.ai_template,
          };

          resultAtIndexIPlus1 = {
            iteration: i + 2,
            chainMessage: new HumanMessage(message),
            output: message,
          };
        }

        // Push the results at the correct indices
        results.push(resultAtIndexI);
        results.push(resultAtIndexIPlus1);

        previousResult = message; // Update the previousResult variable for the next iteration

        prisma.messages.create({
          data: {
            index: i,
            tag: tag.id,
            content: tag.base_message[0],
            chat: chat.id,
            gpt_message: JSON.stringify(previousResult),
          },
        });

        // Create a new message associated with the chat
        prisma.messages.create({
          data: {
            index: i + 1,
            content: message,
            chat: chat.id,
            gpt_message: JSON.stringify(previousResult),
          },
        });
      }

      reply.send({
        status: "success",
        data: {
          message: previousResult,
          results: results, // returning the results of each iteration
        },
      });
    }
  );

  const executeFunction = async ({
    functionName,
    previousResult,
    metadata,
    chain,
  }) => {
    // split the functionName and get  prompt.extract-website
    const tagFn = functionName.split(".")[1];

    if (!tagFn) return "Sorry, I cannot run this now.";

    const tag = await prisma.tags.findFirst({
      where: {
        key: tagFn,
      },
    });
    let functionMessage = "";

    if (tag?.function) {
      functionMessage = await runFunction({
        tagFunction: tag?.function,
        message: "",
        metadata,
        tag,
      });
    } else {
      functionMessage = await chain.call({
        input: tag?.ai_template,
      });
    }

    return {
      tag: tag,
      message: functionMessage,
    };
  };
}
