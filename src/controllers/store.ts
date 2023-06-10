// @ts-nocheck
import { FastifyInstance } from "fastify";
import { getTextByWebsiteURL, saveStore } from "../app/store/service";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { eventManager } from "../main";
import { storeS3File } from "../app/s3/service";
import fs from "fs";
import os from "os";
import { htmlLoader, loadS3File, textLoader } from "../app/loader/service";

export function storeRoutes(fastify: FastifyInstance) {
  fastify.post("/api/v1/store", async (request, reply) => {
    const { text, urls, type, tags, s3_url, metadata } = request.body || {};
    const tempFilePath = `${os.tmpdir()}/temp_file.txt`;
    let outputText = text;
    let docs = [];

    eventManager.emit("store-s3");

    if (type === "raw" && text) {
      fs.writeFile(tempFilePath, textContent, (err) => {
        if (err) throw new Error(err);
        // Store text file
        await storeS3File({
          file: tempFilePath,
          workspaceId: request?.token_metadata?.custom_metadata?.workspace_id,
        });

        docs = textLoader(tempFilePath);
      });
    } else if (type === "website_url" && urls) {
      let outputTexts = null;
      urls.forEach(async (url) => {
        outputTexts += await getTextByWebsiteURL(url);
      });

      // Save into s3
      fs.writeFile(tempFilePath, textContent, (err) => {
        if (err) throw new Error(err);
        // Store text file
        await storeS3File({
          file: tempFilePath,
          workspaceId: request?.token_metadata?.custom_metadata?.workspace_id,
        });

        docs = htmlLoader(tempFilePath);
      });
    } else {
      docs = loadS3File(s3_url);
    }

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
