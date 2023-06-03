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
}: {
  docs: Document[];
  workspaceId: string;
  storeId: string;
  tags: string[];
}) => {
  const docsInit = docs.map(
    (doc) =>
      new Document({
        metadata: { workspace_id: workspaceId, tags: tags || ["all"] },
        pageContent: doc.pageContent,
      })
  );

  console.log(docsInit);

  const vectorStore = await RedisVectorStore.fromDocuments(
    docsInit,
    new OpenAIEmbeddings(),
    {
      // @ts-ignore
      redisClient,
      indexName: `${workspaceId}:${storeId}`,
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

    const simpleRes = await vectorStore.similaritySearch(
      message,
      similarityCount
    );

    return simpleRes || [];
  } catch (error) {
    console.log(error);
    return [];
  }
};
