const puppeteer = require("puppeteer");
const mongoose = require("mongoose");
const { createObjectCsvWriter } = require("csv-writer");
const Lender = require("../models/Lender");

async function runScraper() {
  console.log("🔹 Connecting to MongoDB...");
  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is not set. Please check your environment variables.");
    process.exit(1);
  }
  
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("✅ MongoDB connected");

  // Ensure Puppeteer launches correctly in Render environment
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
    ],
  });

  const csvPath = "detailedLenderData.csv";  // Save CSV locally
  try {
    const lenders = await Lender.find({ website: { $exists: true, $ne: "" } });
    console.log(`🔹 Found ${lenders.length} lenders with websites`);

    const scrapedData = [];
    const csvWriter = createObjectCsvWriter({
      path: csvPath,
      header: [
        { id: "lenderName", title: "Lender Name" },
        { id: "website", title: "Website" },
        { id: "loanType", title: "Loan Type" },
        { id: "stateAvailability", title: "State Availability" },
        { id: "maxLTV", title: "Max LTV" },
        { id: "minFICO", title: "Min FICO" },
      ],
    });

    for (const lender of lenders) {
      const page = await browser.newPage();
      const website = lender.website.startsWith("http") ? lender.website : `https://${lender.website}`;
      console.log(`🔹 Visiting ${website} for ${lender.name}`);

      try {
        await page.goto(website, { waitUntil: "domcontentloaded", timeout: 30000 });

        // Scrape basic info from the homepage
        const loanType = await page.$eval(".loan-type-selector", el => el.innerText).catch(() => "N/A");
        const stateAvailability = await page.$eval(".state-selector", el => el.innerText).catch(() => "N/A");

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

    await csvWriter.writeRecords(scrapedData);
    console.log("✅ Data saved to detailedLenderData.csv");
    return csvPath;
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



