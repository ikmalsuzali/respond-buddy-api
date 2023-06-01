import "dotenv/config";
import Fastify, { fastify } from "fastify";
import cors from "@fastify/cors";
import { randomBytes } from "crypto";
import { registerRoutes } from "./routes";
import { prisma } from "./prisma";
import fastifyEnv from "@fastify/env";
import fastifySensible from "@fastify/sensible";
// @ts-ignore
import axiosClient from "fastify-axios";
import SlackNotify from "slack-notify";
const { fastifySchedulePlugin } = require("@fastify/schedule");
import MailListenerManager from "./app/mail/mailManager";
import EventManager from "./app/event/eventManager";
import { decryptJwt } from "./helpers";
import { getAllUserWorkspaces } from "./app/userWorkspaces/service";
import { triggerWorkflow } from "./app/workflow/service";
import { registerEvents } from "./events";
import Redis from "ioredis";
import SlackClientManager, {
  ClientConfig,
} from "./app/slack/SlackClientManager";
const { App } = require("@slack/bolt");

let slack = null;
let logger = null;
let redisClient = null;
const mailListenerManager = new MailListenerManager();
const eventManager = new EventManager();
const slackClientManager = new SlackClientManager();
const main = async () => {
  const schema = {
    type: "object",
    required: [
      "ENVIRONMENT",
      "STRIPE_SECRET_DEMO",
      "STRIPE_WEBHOOK_DEMO",
      "STRIPE_SECRET_LIVE",
      "STRIPE_WEBHOOK_LIVE",
      "BASE_URL",
      "SUPABASE_KEY",
      "SUPABASE_URL",
      "OPENAI_API_KEY",
    ],
    properties: {
      ENVIRONMENT: {
        type: "string",
      },
      STRIPE_SECRET_DEMO: {
        type: "string",
      },
      STRIPE_WEBHOOK_DEMO: {
        type: "string",
      },
      STRIPE_SECRET_LIVE: {
        type: "string",
      },
      STRIPE_WEBHOOK_LIVE: {
        type: "string",
      },
      BASE_URL: {
        type: "string",
      },
      SLACK_WEBHOOK_URL: {
        type: "string",
      },
      SUPABASE_KEY: {
        type: "string",
      },
      SUPABASE_URL: {
        type: "string",
      },
      JWT_SECRET: {
        type: "string",
      },
      OPENAI_API_KEY: {
        type: "string",
      },
    },
  };

  if (process.env.Env == "production") {
    // @ts-ignore
    slack = SlackNotify(process.env.SLACK_WEBHOOK_URL);
  }

  redisClient = new Redis({
    host: "178.128.30.115", // Replace with your Redis host
    port: 6379, // Replace with your Redis port
  });

  if (redisClient.status === "connecting" || redisClient.status === "ready") {
    console.log("Redis is already connecting/connected");
  } else {
    await redisClient.connect();
  }

  redisClient.on("connect", () => {
    console.log("Connected to Redis");
  });

  redisClient.on("error", (error) => {
    console.error("Redis error:", error);
  });

  const envToLogger = {
    transport: {
      target: "pino-pretty",
      options: {
        ignore: "pid,hostname",
      },
    },
    destination: {
      dest: "./log_output", // omit for stdout
      minLength: 4096, // Buffer before writing
      sync: false, // Asynchronous logging
    },
  };

  const server = Fastify({
    genReqId: () => randomBytes(8).toString("hex"),
    logger: envToLogger,
  });

  server.register(fastifySchedulePlugin);
  server.register(fastifySensible);
  // ts-ignore
  server.register(require("fastify-supabase"), {
    supabaseKey: process.env.SUPABASE_KEY,
    supabaseUrl: process.env.SUPABASE_URL,
  });

  server.register(fastifyEnv, {
    dotenv: true, // will read .env in root folder
    confKey: "config",
    data: process.env,
    schema,
  });

  server.register(import("fastify-raw-body"), {
    field: "rawBody", // change the default request.rawBody property name
    global: true, // add the rawBody to every request. **Default true**
    encoding: false, // set it to false to set rawBody as a Buffer **Default utf8**
    runFirst: true, // get the body before any preParsing hook change/uncompress it. **Default false**
    // routes: [], // array of routes, **`global`** will be ignored, wildcard routes not supported
  });

  await server.after();

  server.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  });
  server.register(require("@fastify/multipart"));
  server.register(require("@fastify/formbody"));
  server.register(axiosClient, {
    name: "axios",
  });
  server.register(require("fastify-qs"), {});
  server.decorate("mailListenerManager", mailListenerManager);
  server.decorateRequest("token_metadata", null);
  server.addHook("preHandler", async (request) => {
    // @ts-ignore
    request.token_metadata = decryptJwt(request?.headers?.authorization);
  });

  // connect to database
  await prisma.$connect();
  server.log.info("Connected to Prisma");

  // register all routes
  registerRoutes(server);
  registerEvents(server);

  try {
    // @ts-ignore
    await server.listen({ port: process.env.PORT || 8080, host: "0.0.0.0" });
    const workspaceEmailIntegrations = await getAllUserWorkspaces(server, {
      integration_name: "email",
    });
    const workspaceSlackIntegrations = await getAllUserWorkspaces(server, {
      integration_name: "slack",
    });
    mailListenerManager.init(workspaceEmailIntegrations);
    const mappedWorkspaceSlackIntegrations: ClientConfig[] =
      workspaceSlackIntegrations.map((workspaceSlackIntegration) => {
        return {
          workspace_integration_id: workspaceSlackIntegration.id,
          // @ts-ignore
          token: workspaceSlackIntegration?.metadata?.token,
          // @ts-ignore
          signing_secret: workspaceSlackIntegration?.metadata?.signing_secret,
          // @ts-ignore
          team_id: workspaceSlackIntegration?.metadata?.team_id,
          // @ts-ignore
          app_token: workspaceSlackIntegration?.metadata?.app_token,
        };
      });

    console.log(
      "🚀 ~ file: main.ts:212 ~ main ~ mappedWorkspaceSlackIntegrations:",
      mappedWorkspaceSlackIntegrations
    );

    await slackClientManager.init(mappedWorkspaceSlackIntegrations);
  } catch (err) {
    await prisma.$disconnect();
    process.exit(1);
  }

  logger = server.log;
};
main();

export { logger, slack, mailListenerManager, eventManager, redisClient };
