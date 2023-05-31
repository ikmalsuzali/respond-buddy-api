import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { stripeRoutes } from "./controllers/stripe";
import { hookRoutes } from "./controllers/hooks";
import { workspaceRoutes } from "./controllers/workspaces";
import { authRoutes } from "./controllers/auth";
import { integrationRoutes } from "./controllers/integrations";
import { slackRoutes } from "./controllers/slack";

export function registerRoutes(fastify: FastifyInstance) {
  stripeRoutes(fastify);
  hookRoutes(fastify);
  workspaceRoutes(fastify);
  authRoutes(fastify);
  integrationRoutes(fastify);
  slackRoutes(fastify);
}
