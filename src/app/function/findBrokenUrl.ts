import axios from "axios";
import * as cheerio from "cheerio";

const getBrokenLinks = async (url: string) => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const allLinks = $("a");
    const linkPromises = [];

    for (let i = 0; i < allLinks.length; i++) {
      const link = $(allLinks[i]);
      const href = link.attr("href");

      if (href && !href.startsWith("#")) {
        linkPromises.push(
          axios
            .head(href)
            .then((response) => ({
              href: href,
              status: response.status,
            }))
            .catch((error) => ({
              href: href,
              status: "Error",
            }))
        );
      }
    }

    return Promise.all(linkPromises);
  } catch (error) {
    console.error("Error fetching the webpage:", error);
  }
};

// Usage:
getBrokenLinks("https://example.com").then((brokenLinks) => {
  console.log("Broken Links:", brokenLinks);
});
