// Write base controller for tags in Fastify
// Import tags service
// @ts-nocheck

import { tagsService } from "../app/tags/service";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../prisma";

export function tagsRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/api/v1/tags",
    async (request: FastifyRequest, reply: FastifyReply) => {
      // Get all system tags and filter tags by workspace
    }
  );
}

// Create tags
fastify.post(
  "/api/v1/tags",
  async (request: FastifyRequest, reply: FastifyReply) => {
    const {
      name,
      description,
      base_response: ai_default_response,
    } = request.body || {};
    if (!name) return new Error("Name is required");

    const transaction = await prisma.$transaction();

    try {
      const tag = await prisma.tags.create({
        data: {
          name,
          is_system_tag: false,
          description,
          ai_default_response,
          workspace: request?.token_metadata?.custom_metadata?.workspace_id,
        },
      });

      const tagAlias = await prisma.tag_aliases.create({
        data: {
          name,
          tag_id: tag?.id,
        },
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();

      if (!tag && !tagAlias) return new Error("Tag not created");
    }

    reply.send(tag);
  }
);

// Update tags and tag aliases

// Delete tags and tag aliases
fastify.delete(
  "/api/v1/tags",
  async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.body || {};

    const tag = await prisma.tags.delete({
      where: {
        id,
      },
    });

    if (!tag) return new Error("Tag not deleted");

    reply.send(tag);
  }
);

// Udpate tags and tag aliases
fastify.put(
  "/api/v1/tags",
  async (request: FastifyRequest, reply: FastifyReply) => {
    const {
      name,
      description,
      base_response: ai_default_response,
      id,
    } = request.body || {};
    if (!name) return new Error("Name is required");

    const transaction = await prisma.$transaction();

    try {
      const tag = await prisma.tags.update({
        where: {
          id: id,
        },
        data: {
          name,
          is_system_tag: false,
          description,
          ai_default_response,
          workspace: request?.token_metadata?.custom_metadata?.workspace_id,
        },
      });

      let tagAlias = null;

      if (tag.name !== name) {
        tagAlias = await prisma.tag_aliases.update({
          where: {
            tag_id: id,
          },
          data: {
            name,
          },
        });
      }

      await transaction.commit();
      reply.send({ tag, tag_alias: tagAlias });
    } catch (error) {
      await transaction.rollback();

      if (!tag && !tagAlias) return new Error("Tag failed to update");
      reply.send(error);
    }
  }
);

// Get all tag aliases that are is_system_tag and workspace == workspace_id
fastify.get(
  "/api/v1/my-tags/",
  async (request: FastifyRequest, reply: FastifyReply) => {
    const tags = await prisma.tag_aliases.findMany({
      where: {
        tags: {
          some: {
            OR: [
              { is_system_tag: true },
              {
                workspace:
                  request?.token_metadata?.custom_metadata?.workspace_id,
              },
            ],
          },
        },
      },
      include: {
        tags: true,
      },
    });

    reply.send(tags);
  }
);
