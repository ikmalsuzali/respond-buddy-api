// @ts-nocheck
import { FastifyInstance } from "fastify";
import { deleteS3File, storeS3File } from "../app/s3/service";
import { upload, eventManager } from "../main";
import { prisma } from "../prisma";
import fs from "fs";

export function s3Routes(fastify: FastifyInstance) {
  fastify.post("/api/v1/file/upload", async (request, reply) => {
    try {
      const part = await request.file();
      const fileSize = part?.file?.bytesRead || part?.byteLength || part.size;

      const uploadResult = await storeS3File({
        file: part,
        workspaceId: request?.token_metadata?.custom_metadata?.workspace_id,
      });

      await prisma.s3.create({
        data: {
          workspace: request?.token_metadata?.custom_metadata?.workspace_id,
          original_name: part.filename,
          s3_name: uploadResult?.newKey,
          s3_url:
            "https://respondbuddy.sfo3.cdn.digitaloceanspaces.com/" +
            uploadResult?.newKey,
          file_size: fileSize,
        },
      });

      reply.code(200).send({
        url: uploadResult?.url,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      reply.code(500).send("Error uploading file");
    }
  });

  fastify.delete("/api/v1/file/:key", async (request, reply) => {
    try {
      await deleteS3File({ key: request.params.key });

      reply.code(200).send("File deleted successfully");
    } catch (error) {
      reply.code(500).send("Error deleting file");
    }
  });
}

export function s3Events() {
  eventManager.on("file-uploaded", async (data) => {
    console.log("🚀 ~ file: s3.ts:95 ~ eventManager.on ~ data", data);
  });
}
