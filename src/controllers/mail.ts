import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export function integrationRoutes(fastify: FastifyInstance) {
  // Add a new client
  fastify.post("/hook/add-client", async (request, reply) => {
    const clientConfig = request.body;
    try {
      fastify.mailListenerManager.addClient(clientConfig);
      reply.send({ success: true, message: "Client added successfully." });
    } catch (error) {
      reply.send({ success: false, message: error.message });
    }
  });

  // Remove a client
  fastify.post("/hook/remove-client", async (request, reply) => {
    const { email } = request.body;
    try {
      fastify.mailListenerManager.removeClient(email);
      reply.send({ success: true, message: "Client removed successfully." });
    } catch (error) {
      reply.send({ success: false, message: error.message });
    }
  });
}
