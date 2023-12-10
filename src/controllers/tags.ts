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
      const limit = Number(request.query.limit) || 20;
      const search = request.query.search || "";
      const sortBy = request.query.sort_by || "relevance";
      const category = request.query.category; // New filter
      const filterType = request.query.filter_type || "all"; // owned, liked, or all
      const userId = request?.token_metadata?.custom_metadata?.user_id; // Assuming the user's ID is stored here
      const workspaceId =
        request?.token_metadata?.custom_metadata?.workspace_id; // Assuming the user's ID is stored here

      let filter = {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          // {
          //   used_description: {
          //     contains: search,
          //     mode: "insensitive",
          //   },
          // },
        ],
        AND: [
          {
            OR: [
              {
                is_system_tag: true,
              },
            ],
          },
          {
            is_hidden: false,
          },
        ],
      };

      // if (category) {
      //   filter.category = category;
      // }

      switch (filterType) {
        case "owned":
          filter.workspace = workspaceId;
          break;
        case "liked":
          filter.liked_by_users = {
            some: {
              userId: userId,
            },
          };
          break;
        case "all":
        default:
          break;
      }

      let orderBy = {};

      switch (sortBy) {
        case "relevance":
          // You may need to introduce a mechanism to score relevance, for simplicity, we'll keep the default sorting
          break;
        case "top_usage":
          orderBy = { usage_count: "desc" };
          break;
        case "trending":
          orderBy = { usage_count: "desc", created_at: "desc" }; // Simplified for the example
          break;
        case "created_at":
          orderBy = { created_at: "desc" };
          break;
        default:
          break;
      }

      // Add workspace filter if workspace_id is available

      if (workspaceId) {
        filter.AND[0].OR.push({
          workspace: workspaceId,
        });
      }

      try {
        console.log("🚀 ~ file: tags.ts:113 ~ limit:", limit);
        const tags = await prisma.tags.findMany({
          where: {
            ...filter,
          },
          orderBy: orderBy,
          skip: (page - 1) * limit,
          take: limit,
          include: {
            user_liked_tags: true, // Fetch associated liked_by_users for each tag
          },
        });

        // Modify tags to check if current user has liked
        const tagsWithUserLiked = tags.map((tag) => ({
          ...tag,
          userHasLiked:
            tag.user_liked_tags.some((userLike) => userLike.userId === userId)
              ?.length > 0
              ? true
              : false, // Check if current user has liked
        }));

        const totalTags = await prisma.tags.count({
          where: {
            ...filter,
          },
        });

        console.log(tags);

        reply.send({
          data: tagsWithUserLiked,
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
        description,
        ai_template,
        category,
        privacy_type = "private",
        command_type = "command",
        structured_output = {},
      } = request.body || {};
      if (!name) return new Error("Name is required");
      if (!ai_template) return new Error("Prompt template is required");
      if (ai_template && !ai_template.includes("[input]"))
        return new Error("Prompt template must include [input]");
      if (!description) return new Error("Used description is required");
      if (!category) return new Error("Category is required");
      if (!privacy_type) return new Error("Privacy type is required");
      if (!structured_output.input && !structured_output?.input?.description)
        return new Error("Input is required");

      let outputs = structured_output;

      for (const key in outputs) {
        if (!outputs[key].description)
          return new Error("Description is required");
        outputs[key] = {
          type: "string",
          required: false,
          description: key.description,
        };
      }

      try {
        const tag = await prisma.tags.create({
          data: {
            name,
            workspace: request?.token_metadata?.custom_metadata?.workspace_id,
            is_system_tag: false,
            used_description: description,
            ai_template: ai_template,
            command_type: command_type || "command",
            category: category,
            privacy_type: privacy_type,
            structured_output: outputs,
            key: nameToKey(name),
          },
        });

        // const doc = new Document({
        //   pageContent: used_description,
        //   metadata: {
        //     id: tag.id,
        //     key: tag.key,
        //     type: "workspace",
        //     workspace_id:
        //       request?.token_metadata?.custom_metadata?.workspace_id,
        //   },
        // });

        // await storeDocs({
        //   docs: [doc],
        //   key: "tags",
        // });

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

  fastify.post(
    "/api/v1/tags/:tagId/like-toggle",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const tagId = request.params.tagId;
      const userId = request?.token_metadata?.user_id; // Assuming the user's ID is stored in the token metadata
      const isLiked = request.body.is_liked; // Getting the isLiked parameter from the request body

      if (!userId) {
        reply.status(401).send({ error: "User not authenticated" });
        return;
      }

      try {
        const existingLike = await prisma.userLikedTags.findFirst({
          where: {
            userId: userId,
            tagId: tagId,
          },
        });

        // If the user wants to like, but hasn't already
        if (isLiked && !existingLike) {
          prisma.userLikedTags.create({
            data: {
              userId: userId,
              tagId: tagId,
            },
          });
          reply.send({ status: "liked" });
        }
        // If the user wants to unlike and has previously liked
        else if (!isLiked && existingLike) {
          prisma.userLikedTags.delete({
            where: {
              userId_tagId: {
                userId: userId,
                tagId: tagId,
              },
            },
          });
          reply.send({ status: "unliked" });
        } else {
          // Neither liked nor unliked (no action performed)
          reply.send({ status: "no change" });
        }
      } catch (error) {
        console.error(error);
        reply.status(500).send({ error: "Something went wrong." });
      }
    }
  );

  fastify.get("/api/v1/tag/categories", async (request, reply) => {
    const { name } = request.query;
    let filter = {};

    if (name) {
      filter = {
        name: {
          contains: name,
          mode: "insensitive",
        },
      };
    }

    try {
      const results = await prisma.tag_categories.findMany({
        where: filter,
        orderBy: {
          name: "asc",
        },
      });

      reply.send({
        data: results,
      });
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({ error: "Failed to search for tag categories." });
    }
  });

  fastify.get("/api/v1/tag/writing-styles", async (request, reply) => {
    const { name } = request.query;
    let filter = {};

    if (name) {
      filter = {
        name: {
          contains: name,
          mode: "insensitive",
        },
      };
    }

    try {
      const results = await prisma.template_writing_styles.findMany({
        where: filter,
        orderBy: {
          name: "asc",
        },
      });

      reply.send({
        data: results || [],
      });
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({ error: "Failed to search for tag categories." });
    }
  });

  fastify.get("/api/v1/tag/tones", async (request, reply) => {
    const { name } = request.query;
    let filter = {};

    if (name) {
      filter = {
        name: {
          contains: name,
          mode: "insensitive",
        },
      };
    }

    try {
      const results = await prisma.template_tones.findMany({
        where: filter,
        orderBy: {
          name: "asc",
        },
      });

      reply.send({
        data: results || [],
      });
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({ error: "Failed to search for tag categories." });
    }
  });

  fastify.get("/api/v1/tag/languages", async (request, reply) => {
    const { name } = request.query;
    let filter = {};

    if (name) {
      filter = {
        name: {
          contains: name,
          mode: "insensitive",
        },
      };
    }

    try {
      const results = await prisma.template_languages.findMany({
        where: filter,
        orderBy: {
          name: "asc",
        },
      });

      reply.send({
        data: results || [],
      });
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({ error: "Failed to search for tag categories." });
    }
  });

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
