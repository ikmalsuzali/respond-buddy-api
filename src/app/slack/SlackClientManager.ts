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

  async init(clientsConfig: ClientConfig[]) {
    console.log("Initializing Slack clients...");

    try {
      const config = clientsConfig[0];

      console.log(
        "🚀 ~ file: SlackClientManager.ts:34 ~ SlackClientManager ~ init ~ config:",
        config
      );

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
          console.log(
            "🚀 ~ !!!file: SlackClientManager.ts:44 ~ SlackClientManager ~ message:",
            message
          );

          this.sendMessage({
            workspace_integration_id: config.workspace_integration_id,
            channel: message.channel,
            message: "Hello world!",
            thread_ts: message.thread_ts,
            ts: message.ts,
          });

          console.log(
            "🚀 ~ file: SlackClientManager.ts:93 ~ SlackClientManager ~ reply:",
            reply
          );
        }
      );

      await this.clients[config.workspace_integration_id]?.app.start();
    } catch (error) {
      console.log(error);
    }
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
