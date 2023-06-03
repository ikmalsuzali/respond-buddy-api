// @ts-nocheck
import { App } from "@slack/bolt";
import { eventManager } from "../../main";

export interface ClientConfig {
  token: string;
  signing_secret: string;
  workspace_integration_id: string;
  team_id: string;
}

interface ClientsConfig {
  [client: string]: ClientConfig;
}

interface SlackClient {
  app: App;
  workspace_integration_id: string;
  team_id: string;
}

class SlackClientManager {
  private clients: { [key: string]: SlackClient };

  constructor() {
    this.clients = {};
  }

  async init(clientConfigs: ClientConfig[]) {
    console.log("Initializing Slack clients...");

    try {
      clientConfigs.forEach(async (config) => {
        this.clients[config.workspace_integration_id] = {
          app: new App({
            token: config.token,
            signingSecret: config.signing_secret,
            socketMode: true,
            appToken: config.app_token,
            developerMode: true,
          }),
          workspace_integration_id: config.workspace_integration_id,
          team_id: config.teamId,
        };

        this.clients[config.workspace_integration_id]?.app.message(
          async ({ message }) => {
            if (message.text && message.text.includes(`@RespondBuddy`)) {
              eventManager.emit("workflow", {
                type: "slack",
                workspace_integration_id: config.workspace_integration_id,
                message: message.text,
                metaData: message,
              });
            }
          }
        );

        await this.clients[config.workspace_integration_id]?.app.start();
      });
    } catch (error) {
      console.log(error);
    }
  }

  async addClient(clientConfig: ClientConfig) {
    if (this.clients[clientConfig.workspace_integration_id]) {
      return;
    }

    this.clients[config.workspace_integration_id] = {
      app: new App({
        token: config.token,
        signingSecret: config.signing_secret,
        socketMode: true,
        appToken: config.app_token,
        developerMode: true,
      }),
      workspace_integration_id: config.workspace_integration_id,
      team_id: config.teamId,
    };
  }

  async sendMessage({
    workspace_integration_id,
    channel,
    message,
    thread_ts,
    ts,
  }: {
    workspace_integration_id: string;
    channel: string;
    message: string;
    thread_ts?: string;
    ts?: string;
  }) {
    return await this.clients[
      workspace_integration_id
    ]?.app.client.chat.postMessage({
      channel: channel,
      thread_ts: thread_ts || ts, // Use thread_ts if available, else use ts as the parent message timestamp
      text: message,
    });
  }
}

export default SlackClientManager;
