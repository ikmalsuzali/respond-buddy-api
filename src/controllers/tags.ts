// @ts-nocheck

import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../prisma";
import {
  deleteCollections,
  deletePoints,
  getDocs,
  searchCollection,
  storeDocs,
} from "../app/qdrant/service";
import { Document } from "langchain/document";
import { nameToKey } from "../helpers";

export function tagsRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/api/v1/tags",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const page = Number(request.query.page) || 1;
      const limit = Number(request.query.limit) || 12;
      const search = request.query.search || "";
      // Get all system tags and filter tags by workspace

      let filter = {};

      if (search) {
        filter = {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              used_description: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              ai_template: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
          AND: [
            {
              OR: [
                {
                  workspace:
                    request?.token_metadata?.custom_metadata.workspace_id,
                },
                {
                  is_system_tag: true,
                },
              ],
            },
          ],
        };
      }

      console.info("filter", filter);

      try {
        const tags = await prisma.tags.findMany({
          where: {
            ...filter,
          },
          orderBy: {
            is_system_tag: "desc",
          },
          skip: (page - 1) * limit,
          take: limit, // Limit the number of items taken
        });

        const totalTags = await prisma.tags.count({
          where: {
            ...filter,
          },
        });

        reply.send({
          data: tags,
          total: totalTags,
          page: page,
          limit: limit,
          totalPages: Math.ceil(totalTags / limit),
        });
      } catch (error) {
        console.log(error);
      }
    }
  );

  // Create tags
  fastify.post(
    "/api/v1/tag",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const {
        name,
        used_description,
        ai_template,
        command_type = "command",
      } = request.body || {};
      if (!name) return new Error("Name is required");
      if (!ai_template) return new Error("Prompt template is required");
      if (ai_template && !ai_template.includes("[input]"))
        return new Error("Prompt template must include [input]");
      if (!used_description) return new Error("Used description is required");

      try {
        const tag = await prisma.tags.create({
          data: {
            name,
            workspace: request?.token_metadata?.custom_metadata?.workspace_id,
            is_system_tag: false,
            used_description: used_description,
            ai_template: ai_template,
            command_type: command_type || "command",
            key: nameToKey(name),
          },
        });

        const doc = new Document({
          pageContent: used_description,
          metadata: {
            id: tag.id,
            key: tag.key,
            type: "workspace",
            workspace_id:
              request?.token_metadata?.custom_metadata?.workspace_id,
          },
        });

        await storeDocs({
          docs: [doc],
          key: "tags",
        });

        if (!tag) return new Error("Tag not created");

        reply.send(tag);
      } catch (error) {
        reply.send(error);
      }
    }
  );

  // Update tags and tag aliases

  // Delete tags and tag aliases
  fastify.delete(
    "/api/v1/tag/:id",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params;

      if (!id) return new Error("Tag id is required");

      const isValidTag = await prisma.tags.findFirst({
        where: {
          id,
          is_system_tag: false,
        },
      });

      if (!isValidTag) return new Error("Tag is not valid");

      const tag = await prisma.tags.delete({
        where: {
          id,
        },
      });

      if (!tag) return new Error("Failed to delete tag");

      reply.send(tag);
    }
  );

  // Udpate tags and tag aliases
  fastify.put(
    "/api/v1/tag/:id",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params;
      const {
        name,
        used_description,
        ai_template,
        command_type = "command",
      } = request.body || {};
      if (!name) return new Error("Name is required");
      if (!ai_template) return new Error("Prompt template is required");
      if (ai_template && !ai_template.includes("[input]"))
        return new Error("Prompt template must include [input]");
      if (!used_description) return new Error("Used description is required");
      if (!id) return new Error("Tag id is required");

      try {
        const tag = await prisma.tags.update({
          where: {
            id: id,
          },
          data: {
            name,
            is_system_tag: false,
            used_description,
            ai_template,
            command_type: command_type,
            workspace: request?.token_metadata?.custom_metadata?.workspace_id,
          },
        });

        // Reinstate the vector

        await deletePoints({
          collectionKey: "tags",
          filter: {
            should: [
              {
                key: "metadata.id",
                match: {
                  value: id,
                },
              },
            ],
          },
        });

        const doc = new Document({
          pageContent: used_description,
          metadata: {
            id: tag.id,
            key: tag.key,
            type: "workspace",
            workspace_id:
              request?.token_metadata?.custom_metadata?.workspace_id,
          },
        });

        await storeDocs({
          docs: [doc],
          key: "tags",
        });

        reply.send({ tag });
      } catch (error) {
        reply.send(error);
      }
    }
  );

  // Get all tag aliases that are is_system_tag and workspace == workspace_id
  // fastify.get(
  //   "/api/v1/my-tags/",
  //   async (request: FastifyRequest, reply: FastifyReply) => {
  //     const tags = await prisma.tag_aliases.findMany({
  //       where: {
  //         tags: {
  //           some: {
  //             OR: [
  //               { is_system_tag: true },
  //               {
  //                 workspace:
  //                   request?.token_metadata?.custom_metadata?.workspace_id,
  //               },
  //             ],
  //           },
  //         },
  //       },
  //       include: {
  //         tags: true,
  //       },
  //     });

  //     reply.send(tags);
  //   }
  // );

  // Get all tag aliases that is_system_tag == true
  // fastify.get(
  //   "/api/v1/tags/index",
  //   async (request: FastifyRequest, reply: FastifyReply) => {
  //     const { message } = request.query || {};
  //     console.log("🚀 ~ file: tags.ts:162 ~ message:", message);

  //     const tags = await prisma.tags.findMany({
  //       where: {
  //         is_system_tag: true,
  //       },
  //     });

  //     if (tags.length === 0) return new Error("No system tags found");

  //     // Loop through tags and get tag aliases
  //     const docs = tags.map((tag) => {
  //       return new Document({
  //         pageContent: tag.used_description,
  //         metadata: {
  //           id: tag.id,
  //           key: tag.key,
  //           type: tag.workspace ? "workspace" : "system",
  //           workspace_id: tag.workspace || null,
  //         },
  //       });
  //     });

  //     // await deletePoints({
  //     //   collectionKey: "tags",
  //     //   filter: {
  //     //     should: [
  //     //       key: "metadata.id",
  //     //       match: {
  //     //         value: ''
  //     //       }
  //     //     ]
  //     //   }
  //     // });

  //     const response = await searchCollection({
  //       collectionKey: "tags",
  //       query: message,
  //     });

  //     // await deleteCollection({ key: "tags" });

  //     // await storeDocs({
  //     //   docs,
  //     //   key: "tags",
  //     // });

  //     // if (!message) return reply.send(tags);

  //     // let response = await getDocs({
  //     //   message,
  //     //   key: "tags",
  //     //   similarityCount: 1,
  //     // });

  //     // console.log("🚀 ~ file: tags.ts:197 ~ response:", response.docs?.[0]);

  //     reply.send(response);
  //   }
  // );
}
