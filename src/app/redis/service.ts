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
  console.log("🚀 ~ file: service.ts:20 ~ docs:", docs);

  const docsInit = docs.map(
    (doc) =>
      new Document({
        metadata: {
          workspace_id: workspaceId,
          store_id: storeId,
          created_at: new Date(),
        },
        pageContent: doc.pageContent,
      })
  );

  if (!docsInit.length) throw new Error("Docs is empty");

  try {
    const vectorStore = await RedisVectorStore.fromDocuments(
      docsInit,
      new OpenAIEmbeddings(),
      {
        // @ts-ignore
        redisClient,
        indexName: redisKey,
      }
    );
    console.log("🚀 ~ file: service.ts:44 ~ vectorStore:", vectorStore);
  } catch (error) {
    console.log(error);
  }
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
