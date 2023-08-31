import axios from "axios";
import * as cheerio from "cheerio";
import { extractFirstURL } from "./summarizeWebsite";

const axiosInstance = axios.create({
  maxRedirects: 5, // Set the maximum number of redirects you want to allow
});

export const getWebsiteLinks = async ({
  message,
  metadata = {
    html: "",
    has_success_links: false,
    has_broken_links: false,
  },
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

    const allLinks = $("a");
    const linkPromises = [];

    for (let i = 0; i < allLinks.length; i++) {
      const link = $(allLinks[i]);
      const href = link.attr("href");

      if (href && !href.startsWith("#") && isValidURL(href)) {
        linkPromises.push(
          axiosInstance
            .get(href, {
              headers: {
                "User-Agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
              },
            })
            .then((response) => ({
              href: href,
              status: response.status,
            }))
            .catch((error) => ({
              href: href,
              status: "error",
              error: error,
            }))
        );
      }
    }

    let brokenLinks: any[] = [];
    let successLinks: any[] = [];

    if (metadata.has_success_links || metadata.has_broken_links) {
      let links = await Promise.all(linkPromises);
      brokenLinks = links?.filter((link) => link.status == "error");
      successLinks = links?.filter((link) => link.status == 200);
    }

    return {
      links: allLinks,
      successLinks: successLinks,
      brokenLinks: brokenLinks,
    };
  } catch (error) {
    console.error("Error fetching the webpage:", error);
  }
};

const isValidURL = (url: string) => {
  const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return urlPattern.test(url);
};
