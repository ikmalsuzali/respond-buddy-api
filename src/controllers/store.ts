// @ts-nocheck
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { getTextByWebsiteURL, saveStore } from "../app/store/service";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { UnstructuredLoader } from "langchain/document_loaders/fs/unstructured";
import { convertS3UrlToFile, convertS3UrlToTempFile } from "../app/s3/service";

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

    if (url && (type === "csv" || type === "pdf")) {
      // https://api.unstructured.io/general/v0/general

      let tmpFilePath = await convertS3UrlToTempFile(
        "https://respondbuddy.sfo3.cdn.digitaloceanspaces.com/26a0f8a7-2a39-42ad-9f85-cacf1354dc2b_1685890244084.xlsx"
      );

      console.log("tmpfilepath", tmpFilePath);
      const loader = new UnstructuredLoader(tmpFilePath, {
        apiUrl: "https://api.unstructured.io/general/v0/general",
      });

      console.log("loader", loader);

      const loadedDocs = await loader.load();
      console.log("🚀 ~ file: store.ts:52 ~ fastify.post ~ docs:", docs);

      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 2000,
        chunkOverlap: 200,
      });

      docs = await splitter.splitDocuments(loadedDocs);
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
