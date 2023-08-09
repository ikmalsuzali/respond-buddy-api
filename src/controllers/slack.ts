// @ts-nocheck
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { eventManager } from "../main";
import axios from "axios";
import { prisma } from "../prisma";
import { validateObject } from "../helpers";

import {
  doesMessageContainBotMention,
  sendEphemeralMessage,
} from "../app/slack/service";

// import { saveCustomer } from "../app/customer/service";

export function slackRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/api/v1/slack/events",
    async (request: FastifyRequest, reply: FastifyReply) => {
      // @ts-ignore
      console.dir(request.body, { depth: null });
      const {
        token,
        challenge,
        type,
        event,
        team_id,
      }: { token: string; challenge: string; type: string } =
        request.body || {};

      if (challenge) {
        return reply.send({ challenge });
      }

      const workspaceIntegration =
        await prisma.workspace_integrations.findFirst({
          where: {
            metadata: {
              path: ["team_id"],
              string_contains: team_id,
            },
          },
        });

      if (!workspaceIntegration) throw new Error("Workspace not found");

      if (event.type === "message") {
        const botMessage = doesMessageContainBotMention({
          workspace: workspaceIntegration,
          message: event.text,
          threadTs: event.thread_ts,
        });

        if (
          botMessage?.mentionedBot &&
          event.user !== workspaceIntegration.metadata.bot_user_id
        ) {


          eventManager.emit("workflow", {
            type: "slack",
            workspaceId: workspaceIntegration.workspace_id,
            message: botMessage.cleanedText,
            token: workspaceIntegration.metadata.token,
            metaData: event,
          });

          // sendEphemeralMessage({
          //   token: workspaceIntegration.metadata.token,
          //   channel: event.channel,
          //   user: event.user,
          //   text: `Hello <@${event.user}>! :tada: I'm a bot created by <@${workspaceIntegration.metadata.bot_user_id}> working for ${workspaceIntegration.metadata.team_name}`,
          // });
        }
      }

      // try {
      //   if (
      //     event.type === "message" &&
      //     event.user !== workspaceIntegration.metadata.bot_user_id
      //   ) {
      //     const { text, channel, user } = event;
      //     console.log("🚀 ~ file: slack.ts:22 ~ event:", event);

      //     await axios.post(
      //       "https://slack.com/api/chat.postMessage",
      //       {
      //         channel,
      //         text: `Hello <@${user}>! :tada: I'm a bot created by <@${workspaceIntegration.metadata.bot_user_id}> from <https://www.supabase.io|Supabase>.`,
      //       },
      //       {
      //         headers: {
      //           Authorization: `Bearer ${workspaceIntegration.metadata.token}`,
      //         },
      //       }
      //     );
      //   } else if (event.type === "pin_added") {
      //     const { text, channel, user } = event;
      //     console.log("🚀 ~ file: slack.ts:63 ~ event:", event);
      //   }
      // } catch (error) {
      //   console.log(error);
      // }

      // console.log("slack events", request.body);

      reply.send({ challenge });
    }
  );

  // Create slack oauth callback
  fastify.get(
    "/api/v1/slack/oauth/callback",
    async (request: FastifyRequest, reply: FastifyReply) => {
      // @ts-ignore
      const {
        code,
        workspace_id,
        user_id,
        integration_id,
      }: {
        code: string;
        workspace_id: string;
        user_id: string;
        integration_id: string;
      } = request.query || {};

      const params = new URLSearchParams();

      let formData = {
        client_id: fastify?.config.SLACK_APP_CLIENT_ID,
        client_secret: fastify?.config.SLACK_APP_SECRET,
        code: code,
        redirect_uri: `${fastify?.config.SLACK_APP_REDIRECT_URI}?workspace_id=${workspace_id}&user_id=${user_id}&integration_id=${integration_id}`,
      };

      for (const key in formData) {
        params.append(key, formData[key]);
      }

      try {
        let response = await axios.post(
          "https://slack.com/api/oauth.v2.access",
          params.toString(),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        const accessToken = response.data.access_token;
        const teamId = response.data.team.id;
        const teamName = response.data.team.name;
        const userId = response.data.authed_user.id;
        const botUserId = response.data.bot_user_id;

        if (!integration_id || !teamName || !userId || !botUserId) {
          throw new Error("Error integrating");
        }

        const integration = await prisma.integrations.findUnique({
          where: {
            id: integration_id,
          },
        });

        const foundWorkspaceIntegrationByTeamId =
          await prisma.workspace_integrations.findFirst({
            where: {
              workspace: workspace_id,
              metadata: {
                path: ["team_id"],
                string_contains: teamId,
              },
            },
          });

        if (foundWorkspaceIntegrationByTeamId) {
          throw new Error("Integration already exists");
        }

        if (!integration) return new Error("Integration not found");

        let metadata = {
          team_id: teamId,
          team_name: teamName,
          user_id: userId,
          bot_user_id: botUserId,
          token: accessToken,
        };

        const errors = validateObject(metadata, integration?.meta_template);
        // split errors into array
        if (errors?.length > 0)
          return new Error(errors.map((e) => Object.values(e)).join(", "));

        const workspaceIntegration = await prisma.workspace_integrations.create(
          {
            data: {
              integration: integration_id,
              workspace: workspace_id,
              metadata: metadata,
            },
          }
        );

        reply.send("Successfully integrated, close window to get started");
      } catch (error) {
        console.log(error);
        reply.send("Error integrating, try again later");
      }
    }
  );
}

export function slackEvents(fastify: FastifyInstance) {
  // @ts-ignore
  eventManager.on("save-customer", async (data) => {
    // saveCustomer(data.email, data.workspace_integration_id);
  });
}

// const saveSlackCustomer = async (data) => {};
