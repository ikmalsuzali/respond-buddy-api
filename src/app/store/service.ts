// @ts-nocheck
import axios from "axios";
import * as cheerio from "cheerio";
import premiumWebsiteUrl from "../../json/websiteUrl.js";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { getOrCreateTag } from "../tags/service.ts";
import { storeDocsToRedis } from "../redis/service.ts";
import { storeS3File } from "../s3/service.ts";
import { prisma } from "../../prisma";
import { textLoader } from "../loader/service.ts";
import sparkMD5 from "spark-md5";
import os from "os";
import fs from "fs/promises";

// What is a store
// A store is a collection of vectors that are related to each other.
// For example, a store can be a collection of vectors that are related to a specific user.
// A store can also be a collection of vectors that are related to a specific workspace and tags.

// Saving store
// Types of stores to consider:
// [raw, url_link, google_docs_link, pdf, file_docs, rest_api]
// 1. Convert the store to a text file
// 2. If successful, upload the original file and converted text to S3
// 3. Store with filename workspaceId, storeId, timestamp - ${original/text}
// 4. Save the store to the database
// 5. Save the store to weaviate
// 5. original_file_name, converted_file_name, workspaceId, s3_file_path_original, s3_file_path_text
// 3. Save all the tags related to the store

export const saveStore = async (attrs: any) => {
  const {
    workspaceId,
    type,
    tags,
    url,
    docs,
    hash,
    outputText,
    metadata,
    s3Id,
    storeTypeId,
    createdBy,
  } = attrs;

  if (hash) {
    const existingStore = await prisma.store.findFirst({
      where: {
        workspace: workspaceId,
        hash,
      },
    });

    if (existingStore) throw new Error("Memory already exists");
  }

  const store = await prisma.store.create({
    data: {
      type,
      output_text: outputText,
      workspace: workspaceId,
      metadata,
      hash,
      raw_s3_url: url,
      s3: s3Id,
      store_type: storeTypeId,
      created_by: createdBy,
    },
  });

  let redisKey = `${workspaceId}:${store.id}`;

  console.log("🚀 ~ file: service.ts:67 ~ saveStore ~ redisKey:", redisKey);

  console.log("🚀 ~ file: service.ts:69 ~ saveStore ~ docs", docs);

  await storeDocsToRedis({
    docs,
    workspaceId: workspaceId,
    storeId: store.id,
    tags,
    redisKey,
  });

  const storeTags = [];

  if (!tags) return { store, storeTags: [] };
  for (const tag of tags) {
    const { createdTag, error } = await getOrCreateTag({
      name: tag.name,
      workspaceId: workspaceId,
      description: tag.description,
      ai_default_response: tag.ai_default_response,
    });

    if (error) throw error;

    const storeTag = await prisma.storeTag.create({
      data: {
        store: store.id,
        tag: tag.id,
      },
    });

    storeTags.push(storeTag);
  }

  return { store, storeTags };
};

export const getTextByRaw = async (text: string) => {
  if (!text) throw new Error("Text is required");
  return text;
};

export const getTextByWebsiteURL = async (url: string) => {
  if (premiumWebsiteUrl.includes(url))
    throw new Error("Premium websites are not available for now");

  console.log("🚀 ~ file: service.ts:89 ~ getTextByWebsiteURL ~ url:", url);

  try {
    // Fetch the HTML content of the website
    const response = await axios.get(url);
    console.log(
      "🚀 ~ file: service.ts:96 ~ getTextByWebsiteURL ~ response:",
      response
    );
    const html = response.data;

    // Load the HTML into Cheerio
    const $ = cheerio.load(html);

    // Extract all the text from the HTML
    //   const title = $("title").text();
    //   const metaDescription = $('meta[name="description"]').attr("content");
    //   const headings = $("h1, h2, h3")
    //     .map((index, element) => $(element).html())
    //     .get();
    //   const links = $("a")
    //     .filter((index, element) => $(element).children("img").length === 0) // Exclude <a> tags with <img> children
    //     .map((index, element) => $(element).html())
    //     .get();

    //   const remappedHTML = `
    //   <html>
    //     <head>
    //       <title>${title}</title>
    //       <meta name="description" content="${metaDescription}">
    //     </head>
    //     <body>
    //       <h1>Headings:</h1>
    //       <ul>
    //         ${headings.map((heading) => `<li>${heading}</li>`).join("")}
    //       </ul>
    //       <h1>Links:</h1>
    //       <ul>
    //         ${links.map((link) => `<li>${link}</li>`).join("")}
    //       </ul>
    //     </body>
    //   </html>
    // `;

    const remappedHTML = $("body").text();

    // Print the extracted text
    console.log("remappedHTMl", remappedHTML);
    return remappedHTML;
  } catch (error) {
    console.log(
      "🚀 ~ file: service.ts:109 ~ getTextByWebsiteURL ~ error:",
      error
    );
    throw error;
  }
};

export const getStoreByWorkspaceId = async ({
  workspaceId,
}: {
  workspaceId: string | null;
}) => {
  const stores = await prisma.store.findMany({
    where: {
      workspace: workspaceId,
    },
  });

  return stores;
};

export const getUploadedDocs = async (url: string) => {
  try {
    // Fetch the DOC file content from the URL
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const fileData = response.data;

    // Extract text from the DOC file using mammoth.js
    const { value } = await mammoth.extractRawText({ buffer: fileData });

    // Print the extracted text
    console.log(value);
  } catch (error) {
    console.error("Error:", error.message);
  }
};

export const getTextByGoogleDocs = async (url: string) => {};

export const getTextFromUploadedPdf = async (url: string) => {
  const loader = new PDFLoader("src/document_loaders/example_data/example.pdf");
  const docs = await loader.load();

  return docs;
};

export const computeFileMD5 = async (downloadUrl) => {
  const chunkSize = 1024 * 1024; // 1MB chunks (you can adjust this value as needed)
  const spark = new sparkMD5.ArrayBuffer();
  let cursor = 0;

  const response = await axios.get(downloadUrl, {
    responseType: "arraybuffer",
    headers: { "Accept-Encoding": "identity" },
  });

  const fileBuffer = response.data;
  const fileSize = fileBuffer.byteLength;

  while (cursor < fileSize) {
    const chunkEnd = Math.min(cursor + chunkSize, fileSize);
    const chunk = fileBuffer.slice(cursor, chunkEnd);
    spark.append(chunk); // Append loaded chunk to the MD5 calculator
    cursor += chunkSize;
  }

  // Complete the calculation and return the hash
  const hash = spark.end();
  return hash;
};

export const convertRawFileToDocs = async ({
  text,
  workspaceId,
  filename,
}: {
  text: string;
  workspaceId: string;
  filename: string;
}) => {
  const tempFilePath = `${os.tmpdir()}/${filename || "temp_file"}.txt`;
  let uploadResult = {};

  await fs.writeFile(tempFilePath, text);

  // Read the local file content
  let data = await fs.readFile(tempFilePath);
  console.log(data);

  const fileSize = data.byteLength;
  // Store text file
  uploadResult = await storeS3File({
    // Hard code filename & toBuffer function below as these information need in store S3 file function
    file: {
      filename: tempFilePath,
      toBuffer: () => data,
    },
    workspaceId: workspaceId,
  });

  console.log("upload result", uploadResult);

  await prisma.s3.create({
    data: {
      workspace: workspaceId,
      original_name: filename,
      s3_name: uploadResult.newKey,
      s3_url: uploadResult.url,
      file_size: fileSize,
    },
  });

  return {
    docs: await textLoader(tempFilePath),
    s3Url: uploadResult.url,
  };
};

export const readExcel = async ({ excelTempFilePath, workspaceId }) => {
  fs.readFile(excelTempFilePath, async (err, data) => {
    if (err) throw new Error(err);

    const storeResponse = await storeS3File({
      file: {
        filename: excelTempFilePath,
        toBuffer: () => data,
      },
      workspaceId,
    });
    s3Url = storeResponse?.url;
  });

  return excelLoader(excelTempFilePath);
};

export const convertUrlToFilename = (url) => {
  // Remove query parameters and fragments from the URL
  const cleanUrl = url.split(/[?#]/)[0];

  // Extract the pathname from the URL
  const pathname = new URL(cleanUrl).pathname;

  // Remove leading slashes from the pathname
  const trimmedPathname = pathname.replace(/^\//, "");

  // Replace special characters with underscores
  const filename = trimmedPathname.replace(/[^\w-]/g, "_");

  return filename;
};

export const countFilteredStores = async (workspace, storeType) => {
  try {
    const count = await prisma.store.count({
      where: {
        workspace: workspace,
        store_type: storeType,
      },
    });

    console.log("Count:", count);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
};
