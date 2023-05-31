import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { messageEvents } from "./controllers/message";
import { slackEvents } from "./controllers/slack";

export function registerEvents(fastify: FastifyInstance) {
  messageEvents(fastify);
  slackEvents(fastify);
}
