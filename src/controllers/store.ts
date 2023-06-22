// @ts-nocheck
import { FastifyInstance } from "fastify";
import { getTextByWebsiteURL, saveStore } from "../app/store/service";
import { eventManager } from "../main";
import { storeS3File } from "../app/s3/service";
import fs from "fs";
import os from "os";
import { htmlLoader, loadS3File, textLoader } from "../app/loader/service";
import { prisma } from "../prisma";

export function storeRoutes(fastify: FastifyInstance) {
  fastify.get("/api/v1/store", async (request, reply) => {
    const { page, limit } = request.query || {};

    try {
      const data = await prisma.store_types.findMany({
        take: limit,
        skip: page,
      });

      if (!data) {
        throw new Error("Store types not found.");
      }

      reply.send({
        success: true,
        message: "Store types retrieved successfully.",
        data: data,
      });
    } catch (error) {
      reply.badRequest(error);
    }
  });

  fastify.post("/api/v1/store", async (request, reply) => {
    const { text, urls, type, tags, s3_url, metadata } = request.body || {};
    const tempFilePath = `${os.tmpdir()}/temp_file.txt`;
    let outputText = text;
    let docs = [];

    // Comment first before done working on store S3
    // eventManager.emit("store-s3");

    const convertRawFileToDocs = async (text) => {
      await fs.writeFile(tempFilePath, text, async (err) => {
        if (err) throw new Error(err);

        // Read the local file content
        await fs.readFile(tempFilePath, async (err, data) => {
          if (err) throw new Error(err);

          // Store text file
          await storeS3File({
            // Hard code filename & toBuffer function below as these information need in store S3 file function
            file: {
              filename: tempFilePath,
              toBuffer: () => data,
            },
            workspaceId: request?.token_metadata?.custom_metadata?.workspace_id,
          });
        });
      });

      return textLoader(tempFilePath);
    };

    if (type === "raw" && text) {
      docs = await convertRawFileToDocs();
    } else if (type === "website_url" && urls) {
      for (let i = 0; i < urls.length; i++) {
        const url = urls[i];

        const text = await getTextByWebsiteURL(url);

        outputText += text;
      }

      docs = await convertRawFileToDocs(outputText);
    } else if (s3_url) {
      console.log("🚀 ~ file: store.ts:48 ~ fastify.post ~ s3_url:", s3);

      docs = await loadS3File(s3_url);
    }

    const storeData = await saveStore({
      outputText,
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
