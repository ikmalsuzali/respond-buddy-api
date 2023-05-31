// @ts-nocheck
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { getTextByWebsiteURL, saveStore } from "../app/store/service";

export function storeRoutes(fastify: FastifyInstance) {
  fastify.post("/api/v1/store", async (request, reply) => {
    const { text, url, type } = request.body;

    let outputText = text;

    if (type === "raw" && text) {
      outputText = text;
    }

    if (type === "url" && url) {
      outputText = await getTextByWebsiteURL(url);
    }

    // Get S3 Buffer file
    // store in outputText

    const storeData = await saveStore(fastify, {
      output_text: outputText,
      workspace_id: request?.token_metadata?.custom_metadata?.workspace_id,
      type: type,
      tags,
    });

    reply.send({
      success: true,
      message: "Store saved successfully.",
      data: storeData,
    });
  });
}
