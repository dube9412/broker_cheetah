const puppeteer = require("puppeteer");
const mongoose = require("mongoose");
const { createObjectCsvWriter } = require("csv-writer");
const Lender = require("../models/Lender");

async function runScraper() {
  console.log("🔹 Connecting to MongoDB...");
  await mongoose.connect("mongodb://127.0.0.1:27017/brokerCheetahDB");
  console.log("✅ MongoDB connected");

  const browser = await puppeteer.launch({ headless: true });

  try {
    const lenders = await Lender.find({ website: { $exists: true, $ne: "" } });
    console.log(`🔹 Found ${lenders.length} lenders with websites`);

    const scrapedData = [];
    const csvWriter = createObjectCsvWriter({
      path: "detailedLenderData.csv",
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
        const loanType = await page.$eval(".loan-type-selector", (el) => el.innerText).catch(() => "N/A");
        const stateAvailability = await page.$eval(".state-selector", (el) => el.innerText).catch(() => "N/A");

        // Look for internal links to loan programs or state availability pages
        const subpageLinks = await page.$$eval('a[href*="loan"], a[href*="program"], a[href*="state"]', (links) =>
          links.map((link) => link.href)
        );

        console.log(`🔹 Found ${subpageLinks.length} subpages for ${lender.name}`);

        // Visit each subpage and scrape additional data
        for (const link of subpageLinks) {
          console.log(`🔹 Visiting subpage: ${link}`);
          try {
            await page.goto(link, { waitUntil: "domcontentloaded", timeout: 30000 });

            const maxLTV = await page.$eval(".ltv-selector", (el) => el.innerText).catch(() => "N/A");
            const minFICO = await page.$eval(".fico-selector", (el) => el.innerText).catch(() => "N/A");

            scrapedData.push({
              lenderName: lender.name,
              website: lender.website,
              loanType,
              stateAvailability,
              maxLTV,
              minFICO,
            });

            console.log(`✅ Scraped additional data for ${lender.name} from ${link}`);
          } catch (err) {
            console.error(`❌ Error scraping subpage ${link}:`, err.message);
          }
        }
      } catch (err) {
        console.error(`❌ Error scraping ${website}:`, err.message);
      } finally {
        await page.close();
      }
    }

    await csvWriter.writeRecords(scrapedData);
    console.log("✅ Data saved to detailedLenderData.csv");
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await browser.close();
    mongoose.connection.close();
    console.log("🔹 Scraper finished and MongoDB connection closed");
  }
}

module.exports = runScraper;


