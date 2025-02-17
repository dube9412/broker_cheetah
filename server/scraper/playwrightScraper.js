const { chromium } = require("playwright");
const mongoose = require("mongoose");
const Lender = require("../models/Lender");

async function runScraper() {
  console.log("🔹 Starting Playwright Scraper...");

  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is not set. Check your environment variables.");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("✅ MongoDB Connected");

  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROME_BIN || "/usr/bin/chromium",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  console.log("✅ Playwright Launched");

  try {
    const lenders = await Lender.find({ website: { $exists: true, $ne: "" } });
    console.log(`🔹 Found ${lenders.length} lenders with websites`);

    for (const lender of lenders) {
      const page = await browser.newPage();
      const website = lender.website.startsWith("http") ? lender.website : `https://${lender.website}`;
      console.log(`🔹 Visiting ${website} for ${lender.name}`);

      try {
        await page.goto(website, { waitUntil: "domcontentloaded", timeout: 30000 });

        const loanType = await page.$eval(".loan-type-selector", el => el.innerText).catch(() => "N/A");
        const stateAvailability = await page.$eval(".state-selector", el => el.innerText).catch(() => "N/A");

        console.log(`✅ Scraped ${lender.name}: Loan Type - ${loanType}, States - ${stateAvailability}`);
      } catch (err) {
        console.error(`❌ Error scraping ${website}:`, err.message);
      } finally {
        await page.close();
      }
    }
  } catch (err) {
    console.error("❌ Scraper Error:", err.message);
    throw err;
  } finally {
    await browser.close();
    mongoose.connection.close();
    console.log("🔹 Scraper finished, MongoDB connection closed.");
  }
}

module.exports = runScraper;

