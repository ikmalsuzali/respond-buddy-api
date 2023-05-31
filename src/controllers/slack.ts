import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export function slackRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/api/v1/slack/events",
    async (request: FastifyRequest, reply: FastifyReply) => {
      // @ts-ignore
      const {
        token,
        challenge,
        type,
      }: { token: string; challenge: string; type: string } =
        request.body || {};

      console.log("slack events", request.body);

      reply.send({ challenge });
    }
  );
}

export function slackEvents(fastify: FastifyInstance) {}
