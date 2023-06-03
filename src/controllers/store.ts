// @ts-nocheck
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { getTextByWebsiteURL, saveStore } from "../app/store/service";
import { getWorkspaceTags } from "../app/tags/service";

export function storeRoutes(fastify: FastifyInstance) {
  fastify.post("/api/v1/store", async (request, reply) => {
    const { text, url, type, tags } = request.body || {};

    let outputText = text;

    if (type === "raw" && text) {
      outputText = text;
    }

    // if (type === "website_url" && url) {
    //   outputText = await getTextByWebsiteURL(url);
    // }

    // Get S3 Buffer file
    // store in outputText

    const storeData = await saveStore({
      output_text: outputText,
      workspace_id: request?.token_metadata?.custom_metadata?.workspace_id,
      type: type,
      url,
      tags
    });

    reply.send({
      success: true,
      message: "Store saved successfully.",
      data: storeData,
    });
  });
}
