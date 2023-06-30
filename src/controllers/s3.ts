// @ts-nocheck
import { FastifyInstance } from "fastify";
import { deleteS3File, storeS3File } from "../app/s3/service";
import { upload, eventManager } from "../main";

export function s3Routes(fastify: FastifyInstance) {
  fastify.post("/api/v1/file/upload", async (request, reply) => {
    try {
      const file = await request.body.file;

      console.log("🚀 ~ file: s3.ts:49 ~ fastify.post ~ file:", file);

      const uploadResult = await storeS3File({
        file: file,
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
          original_name: uploadResult?.data.originalName,
          s3_name: uploadResult?.data.newKey,
          s3_url: fileUrl,
        },
      });

      reply.code(200).send({
        url:
          "https://respondbuddy.sfo3.cdn.digitaloceanspaces.com/" +
          uploadResult?.newKey,
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
