// @ts-nocheck
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { getValidEmails, decryptJwt } from "../helpers/index";
import { prisma } from "../prisma";

export function userRoutes(fastify: FastifyInstance) {
  // Get users and roles in this workspace
  fastify.get(
    "/api/v1/user-workspace",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userWorkspace = await prisma.user_workspaces.findMany({
        where: {
          user: decryptJwt(request?.headers?.authorization)?.custom_metadata
            ?.user_id,
        },
        include: {
          workspaces: true,
        },
      });
      reply.send(userWorkspace);
    }
  );

  fastify.get(
    "/api/v1/user",
    async (request: FastifyRequest, reply: FastifyReply) => {
      console.log(
        "request?.token_metadata",
        request?.token_metadata?.custom_metadata
      );
      const user = await prisma.users.findUnique({
        where: {
          id: request?.token_metadata?.custom_metadata?.user_id,
        },
        // include: {
        //   user_workspaces: {
        //     include: {
        //       workspaces: true,
        //     },
        //   },
        // },
      });

      if (!user) {
        throw new Error("User not found");
      }

      reply.send(user);
    }
  );

  // Update user roles in the workspace with admin, owner, member, viewer
  // fastify.put(
  //   "/api/v1/workspace",
  //   async (request: FastifyRequest, reply: FastifyReply) => {
  //     const { name, email, description } = request.body;

  //     const { workspace, error } = await fastify.prisma.workspace.update({
  //       where: {
  //         id: decryptJwt(request?.headers?.authorization)?.custom_metadata
  //           ?.workspace_id,
  //       },
  //       data: {
  //         name,
  //         email,
  //         description,
  //       },
  //     });

  //     if (error) throw new Error(error);

  //     reply.send(workspace);
  //   }
  // );

  // Remove user from the workspace
  // fastify.delete(
  //   "/api/v1/workspace",
  //   async (request: FastifyRequest, reply: FastifyReply) => {
  //     const workspace = await fastify.prisma.workspaces.delete({
  //       where: {
  //         id: decryptJwt(request?.headers?.authorization)?.custom_metadata
  //           ?.workspace_id,
  //       },
  //     });
  //     reply.send(workspace);
  //   }
  // );

  // Update my own user details
  fastify.put(
    "/api/v1/user",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { name, username, first_name, last_name } = request.body;

      const foundUser = await prisma.users.findUnique({
        where: {
          id: request?.token_metadata?.custom_metadata?.user_id,
        },
      });

      const checkUniqueEmail = await prisma.users.findFirst({
        where: {
          username: username,
        },
      });

      if (checkUniqueEmail && foundUser?.username !== username)
        return new Error("Username already exists");

      const user = await prisma.users.update({
        where: {
          id: request?.token_metadata?.custom_metadata?.user_id,
        },
        data: {
          name,
          username,
          first_name,
          last_name,
        },
      });
      reply.send(user);
    }
  );

  // Select users in user_workspace and mark as is_deleted
  // fastify.delete(
  //   "/api/v1/user",
  //   async (request: FastifyRequest, reply: FastifyReply) => {
  //     const { ids, is_deleted } = request.body;
  //     const user = await fastify.prisma.user_workspace.updateMany({
  //       where: {
  //         user: {
  //           in: ids,
  //         },
  //       },
  //       data: {
  //         is_deleted,
  //       },
  //     });
  //     reply.send(user);
  //   }
  // );
}
