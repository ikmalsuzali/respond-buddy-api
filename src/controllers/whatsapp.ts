// @ts-nocheck
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { getValidEmails, decryptJwt } from "../helpers/index";

export function whatsappRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/api/v1/whatsapp/verify",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const workspaceIntegration =
        await fastify.prisma.workspace_integrations.findFirst({
          where: {
            workspace: decryptJwt(request?.headers?.authorization)
              ?.custom_metadata?.workspace_id,
            integration: "whatsapp",
          },
        });
      const { metadata } = workspaceIntegration;
      sendWhatsAppMessage(
        metadata?.auth?.apiUrl,
        metadata?.auth?.authToken,
        metadata?.auth?.phoneNumber,
        "Hello from Supabase"
      );
    }
  );

  fastify.post(
    "/api/v1/hook/whatsapp",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const incomingMessages = req.body.messages;

      if (incomingMessages) {
        incomingMessages.forEach((message) => {
          console.log("Received message:", message);
          handleMessage(message);
        });
      }
    }
  );

  const sendWhatsAppMessage = async (
    apiUrl,
    authToken,
    phoneNumber,
    messageText
  ) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      };

      const body = {
        recipient_type: "individual",
        to: phoneNumber,
        type: "text",
        text: {
          body: messageText,
        },
      };

      const response = await axios.post(`${apiUrl}/v1/messages`, body, {
        headers: headers,
      });

      console.log("Message sent successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error sending message:",
        error.response ? error.response.data : error
      );
      throw error;
    }
  };

  const handleMessage = async (message) => {
    // Process the incoming message and send a reply
    console.log("Processing message:", message.text.body);

    const replyText = `You said: "${message.text.body}"`;
    await sendWhatsAppMessage(apiUrl, authToken, message.from, replyText);
  };
}
