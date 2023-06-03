// @ts-nocheck
import { prisma } from "../../prisma";
import { tagSearch } from "../gpt/service";
import { getWorkspaceTags } from "../tags/service";
// import { eventManager } from "../../main";

// eventManager.on("workflow", async (attrs: any) => {
//   console.log("🚀 ~ file: service.ts:85 ~ eventManager.on ~ attrs", attrs);
//   triggerWorkflow(attrs);
// });

export const triggerWorkflow = async (attrs: any) => {
  // Get workspace_integration from prisma based on id
  let { workspaceIntegration, message, data } = attrs || {};

  const workspaceIntegration = await prisma.workspace_integrations.findUnique({
    where: {
      id: workspace_integration_id,
    },
    include: {
      integrations: true,
    },
  });

  const tags = await getWorkspaceTags(workspaceIntegration?.workspace);

  const matchedTags = await tagSearch(tags, message);
  console.log(matchedTags);
};
