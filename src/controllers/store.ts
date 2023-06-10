// @ts-nocheck
import { FastifyInstance } from "fastify";
import { getTextByWebsiteURL, saveStore } from "../app/store/service";
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
      for (let i = 0; i < urls.length; i++) {
        const url = urls[i];

        const text = await getTextByWebsiteURL(url);
        console.log(
          "🚀 ~ file: store.ts:35 ~ urls.forEach ~ outputTexts:",
          text
        );
        outputTexts += text;
      }

      console.log(
        "🚀 ~ file: store.ts:34 ~ urls.forEach ~ outputTexts:",
        outputTexts
      );

      const outputBuffer = Buffer.from(outputTexts, "utf-8");

      // Save into s3
      fs.writeFile(tempFilePath, outputBuffer, async (err) => {
        if (err) throw new Error(err);
        // Store text file
        await storeS3File({
          file: new Blob([outputText], { type: "text/plain" }),
          workspaceId: request?.token_metadata?.custom_metadata?.workspace_id,
        });

        docs = await htmlLoader(tempFilePath);
      });
    } else if (s3_url) {
      console.log("🚀 ~ file: store.ts:48 ~ fastify.post ~ s3_url:", s3_url);

      docs = await loadS3File(s3_url);
    }

    const storeData = await saveStore({
      output_text: outputText,
      workspaceId: request?.token_metadata?.custom_metadata?.workspace_id,
      type,
      docs,
      urls,
      tags,
    });

    reply.send({
      success: true,
      message: "Store saved successfully.",
      data: storeData,
    });
  });
}
