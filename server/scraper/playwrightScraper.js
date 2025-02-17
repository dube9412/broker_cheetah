const { chromium } = require("playwright");
const mongoose = require("mongoose");
const Lender = require("../models/Lender");

async function runScraper() {
  console.log("🔹 Starting Playwright scraper...");

  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is not set. Check your environment variables.");
    return;
  }

  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("✅ MongoDB connected");

  // Launch browser
  const browser = await chromium.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
    ],
  });
  console.log("✅ Playwright launched");

  try {
    const lenders = await Lender.find({ website: { $exists: true, $ne: "" } });
    console.log(`🔹 Found ${lenders.length} lenders with websites`);

    let scrapedData = [];

    for (const lender of lenders) {
      const context = await browser.newContext();
      const page = await context.newPage();
      const website = lender.website.startsWith("http") ? lender.website : `https://${lender.website}`;
      console.log(`🔹 Visiting ${website} for ${lender.name}`);

      try {
        await page.goto(website, { waitUntil: "domcontentloaded", timeout: 30000 });

        // Scrape basic data
        const loanType = await page.textContent(".loan-type-selector").catch(() => "N/A");
        const stateAvailability = await page.textContent(".state-selector").catch(() => "N/A");

        scrapedData.push({
          lenderName: lender.name,
          website: lender.website,
          loanType,
          stateAvailability,
          maxLTV: "N/A",  // Placeholder
          minFICO: "N/A",  // Placeholder
        });

        console.log(`✅ Scraped data for ${lender.name}`);
      } catch (err) {
        console.error(`❌ Error scraping ${website}:`, err.message);
      } finally {
        await page.close();
      }
    }

    console.log("✅ Scraper completed successfully.");
    return scrapedData;
  } catch (err) {
    console.error("❌ Error:", err.message);
    throw err;
  } finally {
    await browser.close();
    mongoose.connection.close();
    console.log("🔹 Scraper finished and MongoDB connection closed");
  }
}

module.exports = runScraper;
