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

      // console.log(
      //   "🚀 ~ file: SlackClientManager.ts:41 ~ SlackClientManager ~ init ~  this.clients[config.workspace_integration_id]:",
      //   this.clients[config.workspace_integration_id].app.client.team.info({
      //     token: config.token,
      //   })
      // );

      // if (!config.teamId) {
      //   this.clients[config.workspace_integration_id]?.app?.client?.team
      //     ?.info()
      //     .then((result: any) => {
      //       console.log(
      //         "🚀 ~ file: SlackClientManager.ts:51 ~ SlackClientManager ~ .then ~ result:",
      //         result
      //       );

      //       eventManager.emit("updateWorkspaceIntegration", {
      //         workspace_integration_id: config.workspace_integration_id,
      //         metadata: {
      //           ...config,
      //           team_id: result?.team?.id,
      //         },
      //       });

      //       this.clients[config.workspace_integration_id].team_id =
      //         result.team.id;
      //     });
      // }

      this.clients[config.workspace_integration_id]?.app.message(
        async ({ message }) => {
          console.log(
            "🚀 ~ !!!file: SlackClientManager.ts:44 ~ SlackClientManager ~ message:",
            message
          );

          const reply = await this.clients[
            config.workspace_integration_id
          ]?.app.client.chat.postMessage({
            channel: message.channel,
            thread_ts: message.thread_ts || message.ts, // Use thread_ts if available, else use ts as the parent message timestamp
            text: "This is a reply in the thread!",
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

  //   listenToEvents() {
  //     for (const clientName in this.clients) {
  //       const { events } = this.clients[clientName];

  //       events.on("message", (event) => {
  //         console.log(
  //           `Received a message event from client "${clientName}" from user ${event.user} in channel ${event.channel}: ${event.text}`
  //         );
  //         eventManager.emit("workflow", {
  //           workspace_integration_id:
  //             this.clients[clientName]?.workspace_integration_id,
  //           message: event.text,
  //           data: event,
  //         });
  //       });
  //     }
  //   }

  //   public async postMessage(client: string, channel: string, message: string) {
  //     if (!this.clients[client]) {
  //       throw new Error("Invalid client");
  //     }

  //     return await this.clients[client].web.chat.postMessage({
  //       channel: channel,
  //       text: message,
  //     });
  //   }
}

export default SlackClientManager;
