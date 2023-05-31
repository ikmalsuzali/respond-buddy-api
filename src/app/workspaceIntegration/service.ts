import { prisma } from "../../prisma";

export const getWorkspaceIntegration = async (
  workspaceIntegrationId: string
) => {
  const workspaceIntegration = await prisma.workspace_integrations.findUnique({
    where: {
      id: workspaceIntegrationId,
    },
    include: {
      integrations: true,
      workspaces: true,
    },
  });

  return workspaceIntegration;
};

export const getWorkspaceIntegrationByIntegrationId = async (
  integration_id: string
) => {
  if (!integration_id) return new Error("Integration is required");
  const integration = await prisma.integrations.findUnique({
    where: {
      id: integration_id || "",
    },
  });
  if (!integration) return new Error("Integration not found");
  return integration;
};

export const checkIfWorkspaceIntegrationExists = async (
  integration: any,
  workspace_id: string,
  metadataQuery: any
) => {
  if (!integration.id) return new Error("Integration is required");
  if (!workspace_id) return new Error("Workspace is required");

  const foundWorkspaceIntegration =
    await prisma.workspace_integrations.findFirst({
      where: {
        workspace: workspace_id,
        metadata: metadataQuery,
      },
    });

  if (!foundWorkspaceIntegration) throw new Error("Connection already exists");

  return foundWorkspaceIntegration;
};
