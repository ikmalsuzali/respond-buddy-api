import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RedisVectorStore } from "langchain/vectorstores/redis";
// @ts-ignore
import { redisClient } from "../../main";

export const storeDocsToRedis = async ({
  docs,
  workspaceId,
  storeId,
  tags,
  redisKey,
}: {
  docs: Document[];
  workspaceId: string;
  storeId: string;
  tags: string[];
  redisKey: string;
}) => {
  const docsInit = docs.map(
    (doc) =>
      new Document({
        metadata: { workspace_id: workspaceId, tags: tags || ["all"] },
        pageContent: doc.pageContent,
      })
  );

  console.log(docsInit);

  if (!docsInit.length) throw new Error("Docs is empty");
  const vectorStore = await RedisVectorStore.fromDocuments(
    docsInit,
    new OpenAIEmbeddings(),
    {
      // @ts-ignore
      redisClient,
      indexName: redisKey,
    }
  );

  console.log(vectorStore);
};

export const getDocsFromRedis = async ({
  workspaceId,
  storeId,
  message,
  similarityCount = 1,
}: {
  workspaceId: string | null;
  storeId: string | null;
  message: string;
  similarityCount?: number;
}) => {
  try {
    const vectorStore = new RedisVectorStore(new OpenAIEmbeddings(), {
      redisClient: redisClient,
      indexName: `${workspaceId}:${storeId}`,
    });
    console.log(
      "🚀 ~ file: service.ts:57 ~ vectorStore ~ vectorStore:",
      vectorStore
    );

    console.log(message);

    const docs = await vectorStore.similaritySearch(message, similarityCount);
    console.log("🚀 ~ file: service.ts:65 ~ docs:", docs);

    return docs || [];
  } catch (error) {
    console.log(error);
    return [];
  }
};
