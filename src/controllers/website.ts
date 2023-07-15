// @ts-nocheck
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import axios from "axios";
import * as cheerio from "cheerio";

export function websiteRoutes(fastify: FastifyInstance) {
  // Check is valid website
  fastify.get("/api/v1/website/valid", async (request, reply) => {
    const { url } = request.query || {};

    try {
      const response = await axios.get(url);

      if (response.status !== 200) {
        throw new Error("Website is not valid.");
      }

      reply.send({
        success: true,
        message: "Website is valid.",
        data: {
          url: url,
          bytesize: response.data.toString("utf08").length,
        },
      });
    } catch (error) {
      reply.badRequest(error);
    }
  });

  // Get all
  fastify.get("/api/v1/website/pages", async (request, reply) => {
    try {
      const { url } = request.query;
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      const baseUrl = new URL(url).origin;
      const pages = [];
      const links = $("a"); // Select all anchor tags

      for (const element of links) {
        const href = $(element).attr("href");
        if (href && !href.startsWith("#")) {
          // Filter out internal page anchors
          const absoluteUrl = new URL(href, url).href;
          if (absoluteUrl.startsWith(baseUrl)) {
            const cleanedUrl = removeTrailingSlash(absoluteUrl);
            pages.push({
              url: cleanedUrl,
            });
          }
        }
      }

      const results = await Promise.all(
        pages.map((page) => getPageByteSize(page.url))
      );

      results.forEach((result, index) => {
        pages[index].bytesize = result;
      });

      reply.send({ pages: pages });
    } catch (error) {
      console.log(error);
      reply.status(500).send({
        error: {
          message: "An error occurred while fetching the website pages.",
        },
      });
    }
  });
}

const removeTrailingSlash = (url) => {
  if (url.endsWith("/")) {
    return url.slice(0, -1);
  }
  return url;
};

const getPageByteSize = async (url) => {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    return response.data.length;
  } catch (error) {
    console.error("An error occurred while fetching the webpage:", error);
    return 0;
  }
};
