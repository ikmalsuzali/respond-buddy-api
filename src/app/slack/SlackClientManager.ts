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
    console.log("Initializing Slack clients...", clientConfigs);

    try {
      clientConfigs.forEach(async (config) => {
        console.log(config);
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
            console.log("mesasge");
            // if (message?.text?.includes(`<@U05AMCB0SE4>`)) {
            const regex = /<@.*?>/g;
            const cleanedMessage = message.text.replace(regex, "");
            // const userInfo = await this.clients[
            //   config.workspace_integration_id
            // ].users.info({
            //   token: config.token,
            //   user: message.user,
            // });

            // eventManager.emit("save-customer", {
            //   type: "slack",
            //   email: userInfo?.user?.profile?.email,
            //   workspace_integration_id: config.workspace_integration_id,
            //   metadata: {
            //     user: userInfo?.user,
            //   },
            // });
            eventManager.emit("workflow", {
              type: "slack",
              workspace_integration_id: config.workspace_integration_id,
              message: cleanedMessage,
              metaData: message,
            });
          }
          // }
        );

        this.clients[config.workspace_integration_id]?.app.event(
          "channel_pinned_item",
          async ({ event }) => {
            // Access the pinned message
            const pinnedMessage = event.item.message;

            // Process the pinned message
            console.log(`New message pinned: ${pinnedMessage.text}`);

            // Save image
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

// const checkContainsThreadMessage = (message: any) => {
//   const threadLinkRegex = /https:\/\/.*\.slack\.com\/archives\/(\w+)\/p(\d+)/;
//   const threadLinkMatches = message.text.match(threadLinkRegex);

//   if (threadLinkMatches && threadLinkMatches.length === 3) {
//     const channel = threadLinkMatches[1];
//     const timestamp = threadLinkMatches[2];

//     try {
//       // Fetch the replies in the thread
//       const result = await app.client.conversations.replies({
//         token: app.token,
//         channel,
//         ts: timestamp,
//       });

//       // Process the replies
//       const replies = result.messages;
//       for (const reply of replies) {
//         // Perform actions with each reply
//         console.log(reply.text);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }
// };

export default SlackClientManager;
