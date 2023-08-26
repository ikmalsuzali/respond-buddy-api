// @ts-nocheck
import axios from "axios";
import * as cheerio from "cheerio";

const getElementPath = (element: any) => {
  let path = [];
  while (element.length) {
    let tagName = element[0].name;
    let siblingIndex = element.prevAll(tagName).length;
    path.unshift(`${tagName}${siblingIndex + 1}`);
    element = element.parent();
  }
  return path.join(" > ");
};

const getMainContentWithLocation = async (url: string) => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Remove elements that are likely part of the navbar, menu, or sidebar
    $(".navbar, .nav, .menu, .header, .sidebar, .aside").remove();

    let contentWithLocation = [];
    $("body")
      .find("*")
      .each((i, el) => {
        let $el = $(el);
        if ($el.text().trim()) {
          contentWithLocation.push({
            text: $el.text().trim(),
            location: getElementPath($el),
          });
        }
      });

    return contentWithLocation;
  } catch (error) {
    console.error("Error fetching the webpage:", error);
  }
};

// Usage:
getMainContentWithLocation("https://example.com").then((content: any) => {
  content.forEach((item) => {
    console.log("Location:", item.location);
    console.log("Text:", item.text);
    console.log("-----------------------------");
  });
});
