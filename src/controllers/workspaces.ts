// @ts-nocheck
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../prisma";
import {
  getNextRenewalDate,
  getTimeTillNextCreditRenewal,
} from "../app/userWorkspaces/service";

export function workspaceRoutes(fastify: FastifyInstance) {
  // Get workspace_integrations
  fastify.get(
    "/api/v1/workspace_integrations",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const {
        search,
        page,
        limit,
        store_types,
        sortField,
        sortOrder,
      }: {
        search: string;
        page: number;
        limit: number;
        store_types: string[];
        sortField: string;
        sortOrder: string;
      } = request.query || {};

      const pageLimit = parseInt(limit);
      const skip = (page - 1) * pageLimit;
      let where = {
        workspace: request?.token_metadata?.custom_metadata?.workspace_id,
      };

      let orderBy = {
        ["created_at"]: sortOrder || "desc",
      };

      const data = await prisma.workspace_integrations.findMany({
        take: pageLimit,
        skip,
        where,
        orderBy,
        include: {
          integrations: true,
        },
      });

      if (!data) {
        throw new Error("Workspace integrations not found.");
      }

      reply.send({
        success: true,
        message: "Workspace integrations retrieved successfully.",
        data: data,
      });
    }
  );

  // Create a workspace
  fastify.post(
    "/api/v1/workspace",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { name, description, active } = request.body;

      if (!name) throw new Error("Name is required");
      if (!description) throw new Error("Description is required");
      if (!active) throw new Error("Active is required");

      const workspace = await prisma.workspace.create({
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
      const workspace = await prisma.workspace.update({
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
      const workspace = await prisma.workspace.delete({
        where: {
          id: decryptJwt(request?.headers?.authorization),
        },
      });
      reply.send(workspace);
    }
  );

  // Get workspace by id
  fastify.get(
    "/api/v1/workspace/:id",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.body;
      const workspace = await prisma.workspace.findUnique({
        where: {
          id,
        },
      });
      reply.send(workspace);
    }
  );

  // Get all workspaces
  fastify.get(
    "/api/v1/integrations",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const data = await prisma.integrations.findMany();

      if (!data) {
        throw new Error("Connection types not found.");
      }

      reply.send({
        success: true,
        message: "Connection types retrieved successfully.",
        data: data,
      });
    }
  );

  // Get workspace subscriptions
  fastify.get(
    "/api/v1/workspace/subscription",
    async (request: FastifyRequest, reply: FastifyReply) => {
      console.log(request?.token_metadata?.custom_metadata.workspace_id);
      const workspaceSubscription = await prisma.subscriptions.findFirst({
        where: {
          workspace: request?.token_metadata?.custom_metadata.workspace_id,
          is_deleted: false,
        },
        include: {
          stripe_products: true,
        },
      });
      console.log(
        "🚀 ~ file: workspaces.ts:163 ~ workspaceSubscription:",
        workspaceSubscription
      );

      if (!workspaceSubscription) return Error("No subscriptions found");

      workspaceSubscription.next_renewal_date = getNextRenewalDate(
        workspaceSubscription
      );

      workspaceSubscription.remaining_renewal_days =
        getTimeTillNextCreditRenewal(workspaceSubscription).days;

      reply.send(workspaceSubscription);
    }
  );

  fastify.get("/api/v1/credit", async (request, reply) => {
    const workspaceCredit = await prisma.workspaces.findFirst({
      where: {
        id: request?.token_metadata?.custom_metadata.workspace_id,
      },
      select: {
        credit_count: true,
      },
    });
    console.log(
      "🚀 ~ file: workspaces.ts:191 ~ fastify.get ~ workspaceCredit:",
      workspaceCredit,
      request?.token_metadata?.custom_metadata.workspace_id
    );

    reply.send({ credits: workspaceCredit.credit_count || 0 });
  });
}
