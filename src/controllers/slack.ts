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
      const { code }: { code: string } = request.query || {};

      console.log("slack oauth callback", request.query);

      try {
        axios.post("https://slack.com/api/oauth.v2.access", {
          client_id: fastify?.config.SLACK_CLIENT_ID,
          client_secret: fastify?.config.SLACK_CLIENT_SECRET,
          code: code,
          redirect_uri:
            "https://api.respondbuddy.com/api/v1/slack/oauth/callback",
        });

        reply.send("Successfully integrated, close window to get started");
      } catch (error) {
        reply.send("Error integrating, close window to get started");
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
