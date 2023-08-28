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
const { fastifySchedulePlugin } = require("@fastify/schedule");
import MailListenerManager from "./app/mail/mailManager";
import EventManager from "./app/event/eventManager";
import { decryptJwt } from "./helpers";
import { getAllUserWorkspaces } from "./app/userWorkspaces/service";
import { createClient } from "redis";
import { registerEvents } from "./events";
// import SlackClientManager from "./app/slack/SlackClientManager";
import { S3 } from "@aws-sdk/client-s3";
import { QdrantClient } from "@qdrant/js-client-rest";

let slack = null;
let logger = null;
let redisClient: any = null;
let qdrantClient: any = null;
const mailListenerManager = new MailListenerManager();
const eventManager = new EventManager();
// const slackClientManager = new SlackClientManager();
let s3: any = null;
const main = async () => {
  const schema = {
    type: "object",
    required: [
      "ENVIRONMENT",
      "STRIPE_SECRET_DEMO",
      "STRIPE_WEBHOOK_DEMO",
      "STRIPE_SECRET_LIVE",
      "STRIPE_WEBHOOK_LIVE",
      "SLACK_WEBHOOK_URL",
      "SLACK_APP_CLIENT_ID",
      "SLACK_APP_SECRET",
      "SLACK_APP_REDIRECT_URI",
      "BASE_URL",
      "SUPABASE_KEY",
      "SUPABASE_URL",
      "OPENAI_API_KEY",
      "QDRANT_ENDPOINT",
      "QDRANT_KEY",
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
      SLACK_APP_CLIENT_ID: {
        type: "string",
      },
      SLACK_APP_SECRET: {
        type: "string",
      },
      SLACK_APP_SIGNING_SECRET: {
        type: "string",
      },
      SLACK_APP_REDIRECT_URI: {
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
      S3_ACCESS_KEY: {
        type: "string",
        default: "",
      },
      S3_SECRET_KEY: {
        type: "string",
        default: "",
      },
      S3_ENDPOINT: {
        type: "string",
        default: "",
      },
      TELEGRAM_TOKEN: {
        type: "string",
        default: "",
      },
      DISCORD_TOKEN: {
        type: "string",
        default: "",
      },
      REDIS_URL: {
        type: "string",
        default: "",
      },
      QDRANT_ENDPOINT: {
        type: "string",
        default: "",
      },
      QDRANT_KEY: {
        type: "string",
        default: "",
      },
    },
  };

  qdrantClient = new QdrantClient({
    url: process.env.QDRANT_ENDPOINT,
    apiKey: process.env.QDRANT_KEY,
  });

  // @ts-ignore
  s3 = new S3({
    forcePathStyle: false,
    endpoint: process.env.S3_ENDPOINT,
    region: "us-east-1",
    credentials: {
      // @ts-ignore
      accessKeyId: process.env.S3_ACCESS_KEY,
      // @ts-ignore
      secretAccessKey: process.env.S3_SECRET_KEY,
    },
  });

  redisClient = createClient({
    url: process.env.REDIS_URL,
  });

  await redisClient.connect();

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
  server.register(require("fastify-sse-v2"));
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
  server.register(require("@fastify/multipart"), {
    limits: {
      fileSize: 1048576 * 10,
    },
  });

  // server.register(import("fastify-raw-body"), {
  //   field: "rawBody", // change the default request.rawBody property name
  //   global: true, // add the rawBody to every request. **Default true**
  //   encoding: false, // set it to false to set rawBody as a Buffer **Default utf8**
  //   runFirst: true, // get the body before any preParsing hook change/uncompress it. **Default false**
  //   // routes: [], // array of routes, **`global`** will be ignored, wildcard routes not supported
  // });

  await server.after();

  server.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  });
  server.register(require("@fastify/formbody"));
  server.register(axiosClient, {
    name: "axios",
  });
  server.register(require("fastify-qs"), {});
  // server.decorate("mailListenerManager", mailListenerManager);
  server.decorateRequest("token_metadata", null);
  server.addHook("preHandler", async (request) => {
    // @ts-ignore
    request.token_metadata = decryptJwt(request?.headers?.authorization);
  });

  // server.addHook("onRequest", (request, reply, done) => {
  //   done(new Error("Some error"));
  // });

  // server.addHook("onRequest", (req, reply, done) => {
  //   console.log("🚀 ~ file: main.ts:224 ~ server.addHook ~ req:", req);
  //   // @ts-ignore
  //   console.log(req.body);
  //   req.log.info({ url: req.raw.url, id: req.id }, "received request");
  //   done();
  // });

  // connect to database
  await prisma.$connect();
  server.log.info("Connected to Prisma");

  // register all routes
  registerRoutes(server);
  registerEvents(server);

  try {
    // @ts-ignore
    await server.listen({ port: process.env.PORT || 8080, host: "0.0.0.0" });
  } catch (err) {
    console.log(err);
    await prisma.$disconnect();
    process.exit(1);
  }

  try {
    // const workspaceEmailIntegrations = await getAllUserWorkspaces(server, {
    //   integration_name: "email",
    // });
    // const workspaceSlackIntegrations = await getAllUserWorkspaces(server, {
    //   integration_name: "Slack",
    // });
    // console.log(workspaceSlackIntegrations);
    // mailListenerManager.init(workspaceEmailIntegrations);
    // @ts-ignore
    // const mappedWorkspaceSlackIntegrations: ClientConfig[] =
    //   workspaceSlackIntegrations.map((workspaceSlackIntegration) => {
    //     return {
    //       workspace_integration_id: workspaceSlackIntegration.id,
    //       // @ts-ignore
    //       token: workspaceSlackIntegration?.metadata?.token,
    //       // @ts-ignore
    //       signing_secret: process.env.SLACK_APP_SECRET,
    //       // @ts-ignore
    //       team_id: workspaceSlackIntegration?.metadata?.team_id,
    //     };
    //   });
    // await slackClientManager.init(mappedWorkspaceSlackIntegrations);
  } catch (error) {
    console.log(error);
  }

  logger = server.log;
};
main();

export {
  logger,
  slack,
  mailListenerManager,
  eventManager,
  redisClient,
  // slackClientManager,
  s3,
  qdrantClient,
};
