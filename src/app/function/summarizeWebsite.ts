// @ts-nocheck
import * as cheerio from "cheerio";
import axios from "axios";
import { OpenAI } from "langchain/llms/openai";
import { loadSummarizationChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const websiteArticleClass = {
  "cnn.com": {
    class: "article__main",
  },
  "google.com": {
    id: "center_col",
  },
  "cnet.com": {
    class: "c-pageArticle",
  },
};
const targetClass = "article__main";
const targetId = "center_col";

export const summarizeWebsite = async ({
  message,
  metadata,
}: {
  message: string;
  metadata: any;
}) => {
  try {
    const messageUrl = extractFirstURL(message);
    let url = messageUrl || metadata.current_url;

    if (!url) return { status: "error", message: "No url found" };

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
      },
    });

    let $ = cheerio.load(data);

    // Remove elements that are likely part of the navbar, menu, or sidebar
    $ = removeExtraElements($);
    $ = removeCss($);
    $ = removeExtraElements($);
    $ = removeScripts($);

    console.log($.html());

    // Extract main content
    let allText = [];

    $(`.${targetClass}`).each((_, element) => {
      const text = extractTextFromElement($, element);
      allText.push(text);
    });

    // If no elements found with the class, then use the ID
    if (allText.length === 0) {
      $(`#${targetId}`).each((_, element) => {
        const text = extractTextFromElement($, element);
        allText.push(text);
      });
    }

    if (allText.length === 0) {
      allText.push($("body").text());
    }

    // Summarize
    const model = new OpenAI({ temperature: 0 });
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 2000,
    });
    const docs = await textSplitter.createDocuments([allText?.[0]]);
    const chain = loadSummarizationChain(model, { type: "map_reduce" });
    const res = await chain.call({
      input_documents: docs,
    });
    console.log("🚀 ~ file: summarizeWebsite.ts:72 ~ res:", res);

    return res.text;
  } catch (error) {
    console.error("Error fetching the webpage:", error);
  }
};

export const extractFirstURL = (message) => {
  const urlPattern =
    /http[s]?:\/\/(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+(?:\/[^\s]*)?/;
  const match = message.match(urlPattern);
  if (match) {
    return match[0];
  }
  return null;
};

const removeExtraElements = (cheerio: cheerio.CheerioAPI) => {
  cheerio(
    '[class*="navbar" i], [class*="nav" i], [class*="menu" i], [class*="header" i], [class*="sidebar" i], [class*="aside" i]'
  ).remove();
  return cheerio;
};

const removeCss = (cheerio: cheerio.CheerioAPI) => {
  cheerio('link[rel="stylesheet"]').remove();
  cheerio("style").remove();

  return cheerio;
};

const removeScripts = (cheerio: cheerio.CheerioAPI) => {
  cheerio("script").remove();
  return cheerio;
};

const extractTextFromElement = ($, element) => {
  let text = "";
  $(element)
    .contents()
    .each((_, el) => {
      if (el.type === "text") {
        text += $(el).text().trim();
      } else if (el.type === "tag") {
        text += extractTextFromElement($, el);
      }
    });
  return text;
};
