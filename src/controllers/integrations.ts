// @ts-nocheck
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../prisma";
import { encrypt, validateObject } from "../helpers";
import { validateEmailConnection } from "../app/mail/service";
import { Prisma } from "@prisma/client";

export function integrationRoutes(fastify: FastifyInstance) {
  // Get all integrations
  fastify.get(
    "/api/v1/integration",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const integrations = await prisma.integrations.findMany();

      if (integrations?.length === 0)
        return new Error("Integrations not found");
      reply.send(integrations);
    }
  );
  // Save user workspace integrations
  fastify.post(
    "/api/v1/integration",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { integration_id = "", metadata = {} } = request.body || {};

      try {
        if (!integration_id) return new Error("Integration is required");
        const integration = await prisma.integrations.findUnique({
          where: {
            id: integration_id || "",
          },
        });

        if (!integration) return new Error("Integration not found");

        const errors = validateObject(metadata, integration?.meta_template);
        // split errors into array
        if (errors?.length > 0)
          return new Error(errors.map((e) => Object.values(e)).join(", "));

        if (integration && integration?.name == "email") {
          // Check prisma if workspace integration already exists based on metadata email
          const foundWorkspaceIntegration =
            await prisma.workspace_integrations.findMany({
              where: {
                metadata: {
                  path: ["email"],
                  string_contains: metadata.email,
                },
              },
            });

          if (foundWorkspaceIntegration?.length > 0)
            throw new Error("Connection already exists");

          const emailConnection = await validateEmailConnection({
            host: metadata.host,
            port: metadata.imap_port,
            tls: metadata.tls,
            user: metadata.email,
            password: metadata.password,
          });

          if (!emailConnection) return new Error("Invalid email connection");
          fastify.mailListenerManager.addClient(clientConfig);
          const encryptPassword = encrypt(metadata.password);
          metadata.password = encryptPassword;
        }

        const workspaceIntegration = await prisma.workspace_integrations.create(
          {
            data: {
              workspace: request?.token_metadata?.custom_metadata?.workspace_id,
              integration: integration_id,
              metadata: metadata as Prisma.JsonArray,
            },
          }
        );

        reply.send(workspaceIntegration);
      } catch (error) {
        reply.send(error);
      }
    }
  );
  

  // Update the workspace integration
  fastify.put(
    "/api/v1/integration/:id",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params;
      const {
        metadata = {
          email: "",
          password: "",
          host: "",
          imap_port: 993,
          smtp_port: 465,
          tls: false,
          markSeen: true,
        },
      } = request.body || {};

      try {
        if (!id) return new Error("Workspace integration not found");

        const myWorkspaceIntegration =
          await prisma.workspace_integrations.findUnique({
            where: {
              id: id,
            },
            include: {
              integrations: true,
            },
          });

        if (!myWorkspaceIntegration)
          return new Error("Workspace integration not found");

        const errors = validateObject(
          metadata,
          myWorkspaceIntegration?.integrations?.meta_template
        );
        // split errors into array
        if (errors?.length > 0)
          return new Error(errors.map((e) => Object.values(e)).join(", "));

        if (
          myWorkspaceIntegration &&
          myWorkspaceIntegration?.integrations?.name == "email"
        ) {
          // Check prisma if workspace integration already exists based on metadata email

          const baseConfig = {
            host: metadata.host,
            port: metadata.imap_port,
            tls: metadata.tls || false,
            user: metadata.email,
            password: metadata.password,
          };

          const emailConnection = await validateEmailConnection(baseConfig);

          fastify.mailListenerManager.removeClient(
            myWorkspaceIntegration.integrations?.meta_template?.email
          );
          fastify.mailListenerManager.addClient(baseConfig);

          if (!emailConnection) return new Error("Invalid email connection");
          const encryptPassword = encrypt(metadata.password);
          metadata.password = encryptPassword;
        }

        const updatedWorkspaceIntegration =
          await prisma.workspace_integrations.update({
            where: {
              id: myWorkspaceIntegration?.id,
            },
            data: {
              metadata: metadata as Prisma.JsonArray,
            },
          });

        reply.send(updatedWorkspaceIntegration);
      } catch (error) {
        reply.send(error);
      }
    }
  );

  // Delete the workspace integration
  fastify.delete(
    "/api/v1/integration/:id",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params;
      if (!id) return new Error("Workspace integration not found");

      const myWorkspaceIntegration = await prisma.workspace_integrations.delete(
        {
          where: {
            id: id,
          },
        }
      );

      if (!myWorkspaceIntegration)
        return new Error("Workspace integration not found");

      if (myWorkspaceIntegration.integration.name == "email") {
        fastify.mailListenerManager.removeClient(
          myWorkspaceIntegration?.metadata?.email
        );
      }

      reply.send(myWorkspaceIntegration);
    }
  );

  fastify.get(
    "/api/v1/whatsapp/verify",
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

  const sendWhatsAppTestMessage = async (
    apiUrl,
    authToken,
    phoneNumber,
    messageText
  ) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      };

      const body = {
        recipient_type: "individual",
        to: phoneNumber,
        type: "text",
        text: {
          body: messageText,
        },
      };

      const response = await axios.post(`${apiUrl}/v1/messages`, body, {
        headers: headers,
      });

      console.log("Message sent successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error sending message:",
        error.response ? error.response.data : error
      );
      throw error;
    }
  };
}
