// @ts-nocheck
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { getValidEmails, decryptJwt } from "../helpers/index";

export function whatsappRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/api/v1/whatsapp/verify",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const VERIFY_TOKEN = "your_verify_token"; // Replace with your webhook Verify Token

      const mode = req.query["hub.mode"];
      const token = req.query["hub.verify_token"];
      const challenge = req.query["hub.challenge"];

      if (mode && token) {
        if (mode === "subscribe" && token === VERIFY_TOKEN) {
          res.status(200).send(challenge);
        } else {
          res.sendStatus(403);
        }
      }
    }
  );

  fastify.post(
    "/api/v1/hook/facebook-messenger",
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

  const handleMessage = async (senderId, message) => {
    const messageText = message.text;

    if (messageText) {
      sendTextMessage(senderId, `You said: "${messageText}"`);
    }
  };

  const sendTextMessage = async (recipientId, messageText) => {
    const messageData = {
      recipient: {
        id: recipientId,
      },
      message: {
        text: messageText,
      },
    };

    request(
      {
        uri: "https://graph.facebook.com/v13.0/me/messages",
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: "POST",
        json: messageData,
      },
      (error, response, body) => {
        if (!error && response.statusCode === 200) {
          console.log("Message sent successfully!");
        } else {
          console.error("Error sending message:", error);
        }
      }
    );
  };
}
