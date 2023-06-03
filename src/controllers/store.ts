// @ts-nocheck
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { getTextByWebsiteURL, saveStore } from "../app/store/service";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export function storeRoutes(fastify: FastifyInstance) {
  fastify.post("/api/v1/store", async (request, reply) => {
    const { text, url, type, tags, metadata } = request.body || {};

    let outputText = text;
    let docs = [];

    if (type === "raw" && text) {
      outputText = text;
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 200,
        chunkOverlap: 10,
      });
      docs = await textSplitter.createDocuments([outputText]);
      console.log("🚀 ~ file: service.ts:36 ~ saveStore ~ docs:", docs);
    }

    if (type === "website_url" && url) {
      console.log("🚀 ~ file: store.ts:100 ~ fastify.post ~ url", url);
      outputText = await getTextByWebsiteURL(url);

      const splitter = RecursiveCharacterTextSplitter.fromLanguage("html", {
        chunkSize: 1000,
        chunkOverlap: 200,
      });

      docs = await splitter.createDocuments([outputText]);
    }

    // Get S3 Buffer file
    // store in outputText

    const storeData = await saveStore({
      output_text: outputText,
      workspaceId: request?.token_metadata?.custom_metadata?.workspace_id,
      type,
      docs,
      url,
      tags,
    });

    reply.send({
      success: true,
      message: "Store saved successfully.",
      data: storeData,
    });
  });
}
