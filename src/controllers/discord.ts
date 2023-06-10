import { FastifyInstance } from "fastify";

export function discordRoutes(fastify: FastifyInstance) {
  fastify.post("/api/v1/discord/auth", async (request, reply) => {
    console.log(request.body);
  });
}
