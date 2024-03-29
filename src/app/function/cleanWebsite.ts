// @ts-nocheck
import * as cheerio from "cheerio";
import axios from "axios";
import { OpenAI } from "langchain/llms/openai";
import { loadSummarizationChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { replaceInputWithValue } from "../../helpers";
import { loadQAStuffChain } from "langchain/chains";
import { gotScraping } from "got-scraping";

export const websiteScrapeConfig = [
  {
    url: "https://www.google.com/search",
    selectors: {
      results: ".tF2Cxc",
      title: {
        selector: "h3",
        action: "text",
      },
      link: {
        selector: "a",
        action: "attr",
        attribute: "href",
      },
      snippet: {
        selector: ".IsZvec",
        action: "text",
      },
    },
  },
  {
    url: "https://medium.com/some-blog/some-article-id",
    selectors: {
      title: {
        selector: "h1",
        action: "text",
      },
      claps: {
        selector: ".js-multirecommendCountButton",
        action: "text",
      },
      content: {
        selector: "article",
        action: "html",
      },
      author: {
        selector:
          ".ds-link.ds-link--styleSubtle.link.link--darken.link--accent.u-accentColor--textNormal.u-accentColor--textDarken",
        action: "text",
      },
    },
  },
];

// export const configurableScrape = async (config) => {
//   try {
//     const response = await got(config.url);
//     const $ = cheerio.load(response.body);

//     let results = [];
//     $(config.selectors.results).each((index, element) => {
//       let item = {};

//       for (let [key, value] of Object.entries(config.selectors)) {
//         if (key !== "results") {
//           switch (value.action) {
//             case "text":
//               item[key] = $(element).find(value.selector).text().trim();
//               break;
//             case "attr":
//               item[key] = $(element).find(value.selector).attr(value.attribute);
//               break;
//             // Add more cases if you have other actions in the config
//           }
//         }
//       }

//       results.push(item);
//     });

//     console.log(results);
//   } catch (error) {
//     console.error(`Error fetching the page: ${error.message}`);
//   }
// };

export const fetchHTML = async ({ metadata }) => {
  let response = await gotScraping.get({
    url: metadata.url,
    proxyUrl: "https://sp5bvv5sca:b0p77Jnlemf5jbFNmX@us.smartproxy.com:10000",
  });

  console.log(response.body);

  return response.body;
};

export const getHtmlBody = async ({ metadata }) => {
  const body = await fetchHTML({ metadata });
  const removalFunction = [
    removeExtraElements,
    removeCss,
    removeScripts,
    removeForm,
  ];

  let $ = cheerio.load(body);

  if (removalFunction?.length !== 0) {
    for (let i = 0; i < removalFunction?.length; i++) {
      $ = removalFunction[i]($);
    }
  }
  const response = extractAllTextFromData($);
  return response;
};

const extractFromHtml = async ({
  message = "",
  metadata = {
    url_body_content: "",
  },
  removalFunction = [],
}) => {
  const messageUrl = extractFirstURL(message);
  let url = messageUrl || metadata.current_website_url;
  let data = metadata.url_body_content;

  if (!url && !data) return { status: "error", message: "No url found" };

  if (!metadata.url_body_content) {
    let axiosData = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
      },
    });
    data = axiosData.data;
  }

  let $ = cheerio.load(data);

  if (removalFunction?.length !== 0) {
    for (let i = 0; i < removalFunction?.length; i++) {
      $ = removalFunction[i]($);
    }
  }

  return $;
};

export const extractAllTextFromData = async ($) => {
  const allText = $.text();

  return allText;
};

export const summarizeText = async (text) => {
  const model = new OpenAI({ temperature: 0 });
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 2000,
  });
  const docs = await textSplitter.createDocuments([text]);
  const chain = loadSummarizationChain(model, { type: "map_reduce" });
  const res = await chain.call({
    input_documents: docs,
  });
  return res.text;
};

export const extractHtmlBody = ($) => {
  const bodyInnerHTML = $("body").html();

  return bodyInnerHTML;
};

export const extractLinks = ($) => {
  const links = [];

  // Find all anchor tags (links)
  $("a").each((index, element) => {
    const link = $(element).attr("href");
    if (link) {
      links.push(link);
    }
  });

  return links;
};

export const extractImages = ($) => {
  const images = [];

  // Load the HTML using Cheerio

  // Find all img tags
  $("img").each((_, element) => {
    const src = $(element).attr("src");
    if (src && (src.startsWith("http://") || src.startsWith("https://"))) {
      images.push(src);
    }
  });
  return images;
};

export const countWords = (paragraph) => {
  // Split the paragraph into words using a regular expression
  const words = paragraph.split(/\s+/); // Split by one or more spaces

  // Count the number of words
  const wordCount = words.length;

  return wordCount;
};

export const findAudience = async ({
  message = "",
  metadata = {
    url_body_content: "",
  },
  tag = {},
}) => {
  const chat = new OpenAI({});

  const cheerio = await extractFromHtml({
    message,
    metadata,
    removalFunction: [
      removeExtraElements,
      removeCss,
      removeScripts,
      removeForm,
    ],
  });

  const allText = await extractAllTextFromData(cheerio);

  if (tag?.ai_template) {
    const cleanTemplate = replaceInputWithValue(tag?.ai_template, allText);

    const result = await chat.predict(cleanTemplate);
    return result;
  }
  return "Sorry I couldnt find and audience, please try again.";
};

export const createList = async ({
  message = "",
  metadata = {
    url_body_content: "",
  },
  tag = {},
}) => {
  const chat = new OpenAI({
    modelName: "gpt-4",
    maxRetries: 3,
  });

  const cheerio = await extractFromHtml({
    message,
    metadata,
    removalFunction: [removeCss, removeScripts],
  });

  const allText = await extractAllTextFromData(cheerio);

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 5000,
    separators: ["\n"],
  });

  const output = await textSplitter.createDocuments([allText]);

  if (tag?.ai_template) {
    const chain = loadQAStuffChain(chat);
    const result = await chain.call({
      input_documents: output,
      question: tag?.ai_template,
    });

    console.log(result);

    return result.text;
  }
  return "Sorry I couldnt find and audience, please try again.";
};

const removeExtraElements = (cheerio: cheerio.CheerioAPI) => {
  cheerio(
    '[class*="navbar" i], [class*="nav" i], [class*="menu" i], [class*="header" i], [class*="sidebar" i], [class*="aside" i], [class*="footer" i]'
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

const removeForm = (cheerio: cheerio.CheerioAPI) => {
  cheerio('[class*="form" i]').remove();
  return cheerio;
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
