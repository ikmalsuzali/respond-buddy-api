import Discord, { Client, ClientOptions, TextChannel } from "discord.js";

export interface ClientConfig {
  token: string;
  workspace_integration_id: string;
}

interface DiscordClient {
  app: Client;
  workspace_integration_id: string;
}

class DiscordClientManager {
  private clients: { [key: string]: DiscordClient };

  constructor() {
    this.clients = {};
  }

  init(clientConfigs: ClientConfig[]) {
    clientConfigs.forEach((config) => {
      let clientOptions: ClientOptions = {
        intents: ["Guilds", "GuildMessages"],
      };
      const client = new Discord.Client(clientOptions);

      client.once("ready", () => {
        console.log(`Logged in as ${client?.user?.tag}`);
      });

      client.on("message", (message) => {
        // Perform actions based on received messages
        // For example:
        if (message.content === "!ping") {
          message.reply("Pong!");
        }
      });

      client.login(config.token);

      this.clients[config.workspace_integration_id] = {
        app: client,
        workspace_integration_id: config.workspace_integration_id,
      };
    });
  }

  sendMessage({
    workspaceId,
    channelId,
    message,
  }: {
    workspaceId: string;
    channelId: string;
    message: string;
  }) {
    const client = this.clients[workspaceId].app;
    const channel = client.channels.cache.get(channelId);
    if (channel && channel.type === "text") {
      (channel as TextChannel)
        .send(message)
        .then(() => console.log(`Message sent by ${client.user!.tag}`))
        .catch(console.error);
    }
  }
}

export default DiscordClientManager;
