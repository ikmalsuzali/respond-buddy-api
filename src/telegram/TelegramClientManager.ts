const TelegramBot = require("node-telegram-bot-api");

export interface ClientConfig {
  token: string;
  signing_secret: string;
  workspace_integration_id: string;
  team_id: string;
  webhookUrl: string;
}

interface ClientsConfig {
  [client: string]: ClientConfig;
}

interface TelegramClient {
  app: any;
  workspace_integration_id: string;
  token: string;
  webhookUrl: string;
}

class TelegramClientManager {
  private clients: { [key: string]: TelegramClient };

  constructor() {
    this.clients = {};
  }

  async init(clientConfigs: ClientConfig[]) {
    try {
      clientConfigs.forEach(async (config) => {
        this.clients[config.workspace_integration_id] = {
          app: new TelegramBot(config.token, {polling: true});
          workspace_integration_id: config.workspace_integration_id,
          token: config.token,
          webhookUrl: config.webhookUrl,
        };

        const bot = this.clients[config.workspace_integration_id].app;
        bot.onText(/\/echo (.+)/, (msg: any, match: any) => {
            // 'msg' is the received Message from Telegram
            // 'match' is the result of executing the regexp above on the text content
            // of the message
          
            const chatId = msg.chat.id;
            const resp = match[1]; // the captured "whatever"
          
            // send back the matched "whatever" to the chat
            
          });
      });
    } catch (error) {}
  }

  async stop(workspaceIntegrationId: string) {
    await this.clients[workspaceIntegrationId].app.deleteWebHook();
    // await this.server.close();
    // console.log("Server stopped");
  }

  sendMessage({workspaceIntegrationId, chatId, text}: {
    workspaceIntegrationId: string;
    chatId: string;
    text: string;
  }) {
    const bot = this.clients[workspaceIntegrationId].app
    bot
      .sendMessage(chatId, text)
      .then(() => console.log(`Sent message to chat ${chatId}: ${text}`))
      .catch((error: any) =>
        console.error(
          `Error sending message to chat ${chatId}: ${error.message}`
        )
      );
  }
}
