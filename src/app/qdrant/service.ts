import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { QdrantVectorStore } from "langchain/vectorstores/qdrant";
// @ts-ignore
import { qdrantClient } from "../../main";
import { updateStoreStatus } from "../store/service";

export const storeDocs = async ({
  docs,
  key,
  metadata,
}: {
  docs: Document[];
  key: string;
  metadata?: any;
}) => {
  try {
    const vectorStore = await QdrantVectorStore.fromDocuments(
      docs,
      new OpenAIEmbeddings(),
      {
        client: qdrantClient,
        collectionName: key,
      }
    );
    console.log("🚀 ~ file: service.ts:23 ~ vectorStore:", vectorStore);

    if (metadata?.storeId) {
      await updateStoreStatus({ storeId: metadata.storeId });
    }

    return vectorStore;
  } catch (error) {
    console.log(error);
  }
};

export const searchCollection = async ({
  collectionKey,
  query,
}: {
  collectionKey: string;
  query?: any;
}) => {
  const response = await qdrantClient.scroll(collectionKey, {
    filter: {
      // should: [
      //   {
      //     key: "metadata.type",
      //     match: {
      //       value: "system",
      //     },
      //   },
      // ],
    },
  });
  console.debug("🚀 ~ file: service.ts:48 ~ response:", response.points);

  return response.points ? response.points : [];
};

export const deleteCollection = async ({ key }: { key: string }) => {
  try {
    await qdrantClient.deleteCollection(key);
  } catch (error) {
    console.log(error);
  }
};

export const deletePoints = async ({
  collectionKey,
  pointIds = [],
  filter = {},
}: {
  collectionKey: string;
  pointIds?: string[];
  filter?: any;
}) => {
  try {
    let response = await qdrantClient.delete(collectionKey, {
      filter: filter,
    });
    console.log("🚀 ~ file: service.ts:74 ~ response:", response);

    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getDocs = async ({
  message,
  key,
  similarityCount = 1,
  filter = {},
}: {
  message: string;
  key: string;
  similarityCount?: number;
  filter?: any;
}) => {
  try {
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      new OpenAIEmbeddings(),
      {
        client: qdrantClient,
        collectionName: key,
      }
    );

    const docs = await vectorStore.similaritySearchWithScore(
      message,
      similarityCount,
      filter
    );

    return (
      {
        vectorStore,
        docs,
      } || {}
    );
  } catch (error) {
    console.log(error);
    return {};
  }
};

// export const getSimilarMatches = async (
//   inputString: string,
//   workspaceId: string
// ) => {
//   console.log("hi");
//   const threshold = 0.9; // Similarity threshold
//   const matchingKeys: any = [];

//   const pattern = `doc:${workspaceId}:*`;
//   console.log("🚀 ~ file: service.ts:83 ~ pattern:", pattern);
//   const patternRedisKeys = await getKeys(pattern);
//   console.log("🚀 ~ file: service.ts:86 ~ patternRedisKeys:", patternRedisKeys);

//   // @ts-ignore
//   for (const patternRedisKey of patternRedisKeys) {
//     const keyData = await redisClient.HGETALL(patternRedisKey);
//     console.log("🚀 ~ file: service.ts:93 ~ keyData:", keyData);

//     // const distance = calculateLevenshteinDistance(inputString, keyData.content);

//     // console.log("🚀 ~ file: service.ts:94 ~ distance:", distance);

//     // const similarity =
//     //   1 - distance / Math.max(inputString.length, keyData.content.length);
//     // if (similarity >= threshold) {
//     //   matchingKeys.push({ patternRedisKey, value: keyData.content });
//     // }
//   }

//   return matchingKeys;
// };

// const calculateLevenshteinDistance = (str1: string, str2: string) => {
//   const m = str1.length;
//   const n = str2.length;

//   const dp = [];

//   for (let i = 0; i <= m; i++) {
//     dp[i] = [];
//     // @ts-ignore
//     dp[i][0] = i;
//   }

//   for (let j = 0; j <= n; j++) {
//     // @ts-ignore
//     dp[0][j] = j;
//   }

//   for (let i = 1; i <= m; i++) {
//     for (let j = 1; j <= n; j++) {
//       if (str1[i - 1] === str2[j - 1]) {
//         dp[i][j] = dp[i - 1][j - 1];
//       } else {
//         // @ts-ignore
//         dp[i][j] = Math.min(
//           dp[i - 1][j] + 1,
//           dp[i][j - 1] + 1,
//           dp[i - 1][j - 1] + 1
//         );
//       }
//     }
//   }

//   return dp[m][n];
// };

// const getKeys = async (pattern = "*", count = 1000) => {
//   const results = [];
//   const iteratorParams = {
//     MATCH: pattern,
//     COUNT: count,
//   };
//   for await (const key of redisClient.scanIterator(iteratorParams)) {
//     console.log("🚀 ~ file: service.ts:176 ~ key", key);
//     results.push(key);
//   }
//   return results;
// };

// const combineKeysAndValues = async (keys: string[]) => {
//   const keyValuesMap = {};

//   keys.forEach(async (key: string) => {
//     const keyData = await redisClient.HGETALL(key);

//     if (keyData.content){

//     }

//     multiGet.get(key, (err, value) => {
//       if (!err && value) {
//         const valueKey = key.slice(0, key.lastIndexOf(":"));
//         if (!keyValuesMap[valueKey]) {
//           keyValuesMap[valueKey] = { value };
//         } else {
//           keyValuesMap[valueKey].value += `, ${value}`;
//         }
//       }
//     });
//   });
// };
