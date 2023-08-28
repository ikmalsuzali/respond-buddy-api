// @ts-nocheck
const axios = require("axios");
import * as cheerio from "cheerio";

const websiteArticleClass = {
  "cnn.com": {
    class: "article__main",
  },
  "google.com": {
    id: "center_col",
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

    const $ = cheerio.load(data);

    // Remove elements that are likely part of the navbar, menu, or sidebar
    $(
      '[class*="navbar"], [class*="nav"], [class*="menu"], [class*="header"], [class*="sidebar"], [class*="aside"]'
    ).remove();

    // Extract main content
    const allText = [];

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

    return allText;
  } catch (error) {
    console.error("Error fetching the webpage:", error);
  }
};

const extractFirstURL = (message) => {
  const urlPattern =
    /http[s]?:\/\/(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+(?:\/[^\s]*)?/;
  const match = message.match(urlPattern);
  if (match) {
    return match[0];
  }
  return null;
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
