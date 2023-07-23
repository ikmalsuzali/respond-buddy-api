import { WebClient } from "@slack/web-api";

export const sendEphemeralMessage = async ({
  token,
  channel,
  user,
  text,
  threadTs,
}: {
  token: string;
  channel: string;
  user: string;
  text: string;
  threadTs?: string | undefined;
}) => {
  try {
    const web = new WebClient(token);

    // Send the ephemeral message using chat.postEphemeral
    const response = await web.chat.postEphemeral({
      channel: channel,
      user: user,
      text: text,
      thread_ts: threadTs || "",
    });

    console.log("Ephemeral message sent:", response.ts);
  } catch (error) {
    console.error("Error sending ephemeral message:", error);
  }
};

export const sendMessage = async ({
  token,
  channel,
  text,
  tsThread,
}: {
  token: string;
  channel: string;
  text: string;
  tsThread?: string | undefined;
}) => {
  try {

    const web = new WebClient(token);

    const response = await web.chat.postMessage({
      channel: channel,
      text: text,
      thread_ts: tsThread || "",
    });

    console.log("Message sent:", response.ts);
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

export const pinAdded = async ({
  token,
  channel,
  event,
}: {
  token: string;
  channel: string;
  event: object;
}) => {
  const web = new WebClient(token);

  // Access the pinned message
  // @ts-ignore
  const pinnedMessage = event?.item.message;

  // Check if s3 file exists
  // If not, save the file into s3
  // If yes, load the csv file
  // Add row to csv file
  // Replace original file with new file
  // Store to redis

  // Get the pinned message

  // Process the pinned message

  //
};

export const doesMessageContainBotMention = ({
  workspace,
  message,
}: {
  workspace: object;
  message: string;
}) => {
  // Extract the bot ID and name from the app instance
  const botNames = [
    "RespondBuddy",
    "respondbuddy",
    "respond buddy",
    "Respond Buddy",
    "respondBuddy",
    "Respond Buddy",
    // @ts-ignore
    `<@${workspace?.metadata.bot_user_id}>`,
    `@RespondBuddy`,
  ];

  console.log(botNames);

  const mentionedBot = botNames.find((botName) =>
    message?.includes(`${botName}`)
  );

  if (mentionedBot) {
    // Remove the bot name mention from the message text
    const regex = new RegExp(`${mentionedBot}\\s*`, "g");
    const cleanedText = message.replace(regex, "");
    return { mentionedBot, cleanedText };
  }
  return null;
};
