// @ts-nocheck
import { FastifyInstance } from "fastify";
import { deleteS3File, storeS3File } from "../app/s3/service";
import { upload, eventManager } from "../main";
import { prisma } from "../prisma";
import fs from "fs";

export function s3Routes(fastify: FastifyInstance) {
  fastify.post("/api/v1/file/upload", async (request, reply) => {
    try {
      // console.log("file", await request.files());
      // for await (const part of request.parts()) {
      //   if (part.file) {
      //     const buff = await part.toBuffer();
      //     console.log(part);
      //   }
      // }
      const part = await request.file();
      // console.log("🚀 ~ file: s3.ts:12 ~ fastify.post ~ parts:", part);

      // const filePath = `uploads/${part.filename}`;

      // await pump(part.file, fs.createWriteStream(filePath));
      // fs.writeFileSync(filePath, await parts.toBuffer());

      const fileSize = part?.file?.bytesRead || part?.byteLength || part.size;

      console.log("🚀 ~ file: s3.ts:49 ~ fastify.post ~ file:", part);
      console.log("🚀 ~ file: s3.ts:13 ~ fastify.post ~ fileSize:", fileSize);

      const uploadResult = await storeS3File({
        file: part,
        workspaceId: request?.token_metadata?.custom_metadata?.workspace_id,
      });
      console.log(
        "🚀 ~ file: s3.ts:17 ~ fastify.post ~ uploadResult:",
        uploadResult
      );

      // Case 1:
      // Upload the file
      // Run the loaders based on file type
      // Save the doc from loaders to s3 also based on filename.gpt
      // Save the file in redis

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
