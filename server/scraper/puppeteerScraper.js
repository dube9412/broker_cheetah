const puppeteer = require("puppeteer");

async function runScraper() {
  console.log("🔹 Starting basic Puppeteer test...");

  try {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined, // Ensure it uses the Render-installed Chrome
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    const testUrl = "https://example.com";
    console.log(`🔹 Visiting ${testUrl}`);
    
    await page.goto(testUrl, { waitUntil: "domcontentloaded" });
    const title = await page.title();
    console.log(`✅ Page title: ${title}`);

    await browser.close();
    console.log("🔹 Test completed successfully.");
  } catch (error) {
    console.error("❌ Error running basic Puppeteer test:", error);
  }
}

module.exports = runScraper;




