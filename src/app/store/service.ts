// @ts-nocheck
import axios from "axios";
import * as cheerio from "cheerio";
import premiumWebsiteUrl from "../../json/websiteUrl.js";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { getOrCreateTag } from "../tags/service.ts";
import { storeDocsToRedis } from "../redis/service.ts";
import { prisma } from "../../prisma";

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
  const { workspaceId, type, tags, url, docs } = attrs;

  const store = await prisma.store.create({
    data: {
      type,
      workspace: workspaceId,
    },
  });

  storeDocsToRedis({
    docs,
    workspaceId: workspaceId,
    storeId: store.id,
    tags,
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
    const title = $("title").text();
    const metaDescription = $('meta[name="description"]').attr("content");
    const headings = $("h1, h2, h3")
      .map((index, element) => $(element).html())
      .get();
    const links = $("a")
      .filter((index, element) => $(element).children("img").length === 0) // Exclude <a> tags with <img> children
      .map((index, element) => $(element).html())
      .get();

    const remappedHTML = `
    <html>
      <head>
        <title>${title}</title>
        <meta name="description" content="${metaDescription}">
      </head>
      <body>
        <h1>Headings:</h1>
        <ul>
          ${headings.map((heading) => `<li>${heading}</li>`).join("")}
        </ul>
        <h1>Links:</h1>
        <ul>
          ${links.map((link) => `<li>${link}</li>`).join("")}
        </ul>
      </body>
    </html>
  `;

    // Print the extracted text
    console.log(remappedHTML);
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
