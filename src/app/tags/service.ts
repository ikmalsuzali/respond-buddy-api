// @ts-nocheck
import { prisma } from "../../prisma";

export const getWorkspaceTags = async (workspaceId: any) => {
  const tags = await prisma.tags.findMany({
    where: {
      OR: [
        {
          workspace: workspaceId,
        },
        {
          is_system_tag: true,
        },
      ],
    },
  });

  // Call prisma to get all unique tags by name where is_system_tag == true and workspace == workspace_id but prefer workspace_id
  let workspaceTags = await prisma.tags.findMany({
    where: {
      workspace: workspaceId,
    },
  });

  let workspaceTagNames = workspaceTags.map((tag: any) => tag.name);

  let systemTags = await prisma.tags.findMany({
    where: {
      name: {
        notIn: workspaceTagNames,
      },
      is_system_tag: true,
    },
  });

  let allTags = [...tags, ...systemTags];

  return allTags || [];
};

export const getOrCreateTag = async ({
  name,
  workspaceId,
  description,
  aiDefaultResponse,
}) => {
  let finalTag = null;
  finalTag = await prisma.tags.findFirst({
    where: {
      name,
      workspace: workspaceId,
      is_system_tag: false,
    },
  });

  if (!finalTag) {
    // create tag by duplicate based on is_system
    let systemTag = await prisma.tags.findFirst({
      where: {
        name,
        is_system_tag: true,
      },
    });

    finalTag = await prisma.tags.create({
      data: {
        name: systemTag.name,
        description: description || systemTag.description,
        is_system_tag: false,
        workspace: workspaceId,
        ai_default_response: aiDefaultResponse || systemTag.ai_default_response,
      },
    });
  }

  return finalTag;
};

export const getVectorStoresByTags = async (tags: any) => {
  let stores = await prisma.vector_stores.findMany({
    where: {
      tags: {
        some: {
          name: {
            in: tags,
          },
        },
      },
    },
  });

  return stores;
};
