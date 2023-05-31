// @ts-nocheck
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export function telegramRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/api/v1/verify/telegram",
    async (request: FastifyRequest, reply: FastifyReply) => {
    
    }
  );

  fastify.post(
    "/api/v1/hook/telegram",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const body = req.body;

      if (body.object === "page") {
        body.entry.forEach((entry) => {
          const webhookEvent = entry.messaging[0];
          const senderId = webhookEvent.sender.id;
          const message = webhookEvent.message;

          if (message) {
            handleMessage(senderId, message);
          }
        });

        res.status(200).send("EVENT_RECEIVED");
      } else {
        res.sendStatus(404);
      }
    }
  );

  const createTelegramBot = async (token) => {
    const bot = new TelegramBot(token, { polling: true });
  
    bot.on('message', (msg) => {
      const chatId = msg.chat.id;
      const messageText = msg.text;
  
      if (messageText) {
        handleMessage(bot, chatId, messageText);
      }
    });
  
    return bot;
  }
  
  const handleMessage = async (bot, chatId, messageText) => {
    const replyText = `You said: "${messageText}"`;
    bot.sendMessage(chatId, replyText);
  }
  
  // Replace with your actual Telegram Bot tokens
  const botTokens = ['your_telegram_bot_token_1', 'your_telegram_bot_token_2'];
  
  const bots = botTokens.map((token) => createTelegramBot(token));
}
