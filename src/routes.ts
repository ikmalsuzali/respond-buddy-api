import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { stripeRoutes } from "./controllers/stripe";
import { hookRoutes } from "./controllers/hooks";
import { workspaceRoutes } from "./controllers/workspaces";
import { authRoutes } from "./controllers/auth";
import { integrationRoutes } from "./controllers/integrations";
import { slackRoutes } from "./controllers/slack";
import { storeRoutes } from "./controllers/store";
import { s3Routes } from "./controllers/s3";
import { discordRoutes } from "./controllers/discord";
import { websiteRoutes } from "./controllers/website";

export function registerRoutes(fastify: FastifyInstance) {
  stripeRoutes(fastify);
  hookRoutes(fastify);
  workspaceRoutes(fastify);
  authRoutes(fastify);
  integrationRoutes(fastify);
  slackRoutes(fastify);
  storeRoutes(fastify);
  s3Routes(fastify);
  discordRoutes(fastify);
  websiteRoutes(fastify);
}
