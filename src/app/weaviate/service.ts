// @ts-nocheck
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { WeaviateStore } from "langchain/vectorstores/weaviate";
import { weaviateClient } from "../../main";

export const storeFromText = async ({ text, workspaceId, storeId }) => {
  if (!text) throw new Error("Text is required");
  await WeaviateStore.fromTexts(
    [text],
    [{ workspace_id: workspaceId, store_id: storeId }],
    new OpenAIEmbeddings(),
    {
      weaviateClient,
      indexName: "Test",
      textKey: "text",
      metadataKeys: ["foo"],
    }
  );
};

export const storeFromDocs = async ({ docs, workspaceId, storeId }) => {
  if (!docs) throw new Error("Docs are required");
  await WeaviateStore.fromDocuments([...docs], new OpenAIEmbeddings(), {
    weaviateClient,
    indexName: "DocumentTest",
    textKey: "text",
    metadataKeys: ["deep.string", "deep.deepdeep.string"],
  });
};

export const find = async ({ text, workspaceId, storeIds }) => {
  const results = await store.similaritySearch(text, 1, {
    where: {
      operator: "And",
      operands: [
        {
          operator: "Equal",
          path: ["workspace_id"],
          valueString: workspaceId,
        },
        {
          operator: "OR",
          operands: storeIds?.map((storeId) => ({
            operator: "Equal",
            path: ["store_id"],
            valueString: storeId,
          })),
        },
      ],
    },
  });

  if (!result || results.length === 0) throw new Error("No results found");

  return results;
};
