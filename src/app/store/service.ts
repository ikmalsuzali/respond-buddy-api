// @ts-nocheck
import axios from "axios";
import * as cheerio from "cheerio";
import premiumWebsiteUrl from "../../json/websiteUrl.js";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { DocxLoader } from "langchain/document_loaders/fs/docx";
import { prisma } from "../../prisma.js";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { storeFromDocs, storeFromText } from "../weaviate/service.js";
import { getOrCreateTag } from "../tags/service.js";

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

export const saveStore = async (fastify: any, attrs: any) => {
  const { output_text, workspace_id, type, tags } = attrs;

  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
  const docs = await textSplitter.createDocuments([output_text]);

  //   await storeFromText()

  storeFromDocs(docs);

  const { store, error } = await prisma.store.create({
    data: {
      output_text,
      type,
      workspace: workspace_id,
    },
  });

  if (error) {
    throw error;
  }

  const storeTags = [];

  for (const tag of tags) {
    const { createdTag, error } = await getOrCreateTag({
      name: tag.name,
      workspaceId: workspace_id,
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
  try {
    // Fetch the HTML content of the website
    const response = await axios.get(url);
    const html = response.data;

    // Load the HTML into Cheerio
    const $ = cheerio.load(html);

    // Extract all the text from the HTML
    const extractedText = $("body").text();

    // Print the extracted text
    console.log(extractedText);
    return extractedText;
  } catch (error) {
    throw error;
  }
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
