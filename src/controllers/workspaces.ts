// @ts-nocheck
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export function workspaceRoutes(fastify: FastifyInstance) {
  // Create a workspace
  fastify.post(
    "/api/v1/workspace",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { name, description, active } = request.body;

      if (!name) throw new Error("Name is required");
      if (!description) throw new Error("Description is required");
      if (!active) throw new Error("Active is required");

      const workspace = await fastify.prisma.workspace.create({
        data: {
          name,
          email,
          description,
        },
      });

      reply.send(workspace);
    }
  );

  // Update workspace meta data

  // Update workspace meta data based on access token
  fastify.put(
    "/api/v1/workspace",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id, name, description, active } = request.body;
      const workspace = await fastify.prisma.workspace.update({
        where: {
          id: decryptJwt(request?.headers?.authorization),
        },
        data: {
          name,
          description,
          active,
        },
      });
      reply.send(workspace);
    }
  );

  // Delete workspace
  fastify.delete(
    "/api/v1/workspace",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.body;
      const workspace = await fastify.prisma.workspace.delete({
        where: {
          id: decryptJwt(request?.headers?.authorization),
        },
      });
      reply.send(workspace);
    }
  );

  // Get workspace by id
  fastify.get(
    "/api/v1/workspace/get",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.body;
      const workspace = await fastify.prisma.workspace.findUnique({
        where: {
          id,
        },
      });
      reply.send(workspace);
    }
  );

  // Get all workspaces
  fastify.get(
    "/api/v1/workspaces/get",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const workspaces = await fastify.prisma.workspace.findMany();
      reply.send(workspaces);
    }
  );
}
