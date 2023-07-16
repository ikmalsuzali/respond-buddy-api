// @ts-nocheck
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { eventManager } from "../main";
import axios from "axios";
// import { saveCustomer } from "../app/customer/service";

export function slackRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/api/v1/slack/events",
    async (request: FastifyRequest, reply: FastifyReply) => {
      // @ts-ignore
      const {
        token,
        challenge,
        type,
      }: { token: string; challenge: string; type: string } =
        request.body || {};

      console.log("slack events", request.body);

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

      console.log("slack oauth callback", request.query);

      try {
        let response = await axios.post(
          "https://slack.com/api/oauth.v2.access",
          {
            client_id: fastify?.config.SLACK_CLIENT_ID,
            client_secret: fastify?.config.SLACK_CLIENT_SECRET,
            code: code,
            redirect_uri: `https://api.respondbuddy.com/api/v1/slack/oauth/callback?${workspace_id}&${user_id}&${integration_id}}`,
          }
        );
        console.log("🚀 ~ file: slack.ts:54 ~ response:", response.data);

        const access_token = response.data.access_token;

        // Get team info
        const teamInfoResponse = await axios.post(
          "https://slack.com/api/team.info",
          {
            token: access_token,
          }
        );
        console.log(
          "🚀 ~ file: slack.ts:64 ~ teamInfoResponse:",
          teamInfoResponse.data
        );
        const teamName = teamInfoResponse.data.team?.name;
        const teamId = teamInfoResponse.data.team?.ic;

        // Get app info

        const appInfoResponse = await axios.post(
          "https://slack.com/api/auth.test",
          {
            token: access_token,
          }
        );
        console.log(
          "🚀 ~ file: slack.ts:76 ~ appInfoResponse:",
          appInfoResponse.data
        );
        const appId = appInfoResponse.data.app_id;

        if (!integration_id || !appId || !teamName || !user_id) {
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

        console.log("🚀 ~ file: slack.ts:88 ~ integration:", integration);

        if (!integration) return new Error("Integration not found");

        let metadata = {
          team_id: teamId,
          team_name: teamName,
          app_id: appId,
          token: access_token,
        };

        const errors = validateObject(metadata, integration?.meta_template);
        // split errors into array
        if (errors?.length > 0)
          return new Error(errors.map((e) => Object.values(e)).join(", "));

        const workspaceIntegration = await prisma.workspace_integrations.create(
          {
            data: {
              integration_id: integration_id,
              workspace_id: workspace_id,
              metadata: metadata,
            },
          }
        );

        reply.send("Successfully integrated, close window to get started");
      } catch (error) {
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
