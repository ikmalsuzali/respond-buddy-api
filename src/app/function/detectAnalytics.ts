const axios = require("axios");
const cheerio = require("cheerio");

async function detectAnalytics(url: string) {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const analyticsServices = [];

  // Detect Google Analytics
  if (
    $('script[src*="google-analytics.com"]').length ||
    $('script:contains("ga(")').length ||
    $('script:contains("gtag(")').length
  ) {
    analyticsServices.push("Google Analytics");
  }

  // Detect Facebook Pixel
  if (
    $('script[src*="connect.facebook.net"]').length ||
    $('script:contains("fbq(")').length
  ) {
    analyticsServices.push("Facebook Pixel");
  }

  // Detect Hotjar
  if ($('script[src*="hotjar.com"]').length) {
    analyticsServices.push("Hotjar");
  }

  // Detect other popular analytics tools by extending with additional conditions

  return analyticsServices;
}

// Usage:
detectAnalytics("https://example.com").then((analytics) => {
  console.log("Detected Analytics:", analytics);
});
