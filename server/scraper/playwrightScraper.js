// Playwright Scraper - Pulls Lender Websites from Database
const { chromium } = require('playwright');
const fs = require('fs');
/*const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/brokerCheetahDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Define lender schema
const Lender = mongoose.model("Lender", new mongoose.Schema({
    name: String,
    website: String
}));*/

const lenderWebsites = [
    "https://www.civicfs.com",
    "https://www.limaone.com"
];

(async () => {
    console.log("🚀 Scraper started...");
    const browser = await chromium.launch({ headless: true });

    const page = await browser.newPage();

    // Fetch lender websites from MongoDB
    /*const lenders = await Lender.find({});
    const lenderWebsites = lenders.map(lender => lender.website);
*/
let scrapedData = [];

for (const site of lenderWebsites) {
    try {
        await page.goto(site, { waitUntil: "domcontentloaded", timeout: 60000 });

        await page.waitForSelector(".lender-name-selector", { timeout: 10000 });
        const lenderName = await page.textContent(".lender-name-selector") || "N/A";

        const lenderWebsite = site;

        const subPages = await page.$$eval("a", links =>
            links.map(link => link.href).filter(href => href.includes("loan-program"))
        ) || [];

        let loanPrograms = [];

        for (const subPage of subPages) {
            await page.goto(subPage, { waitUntil: "domcontentloaded", timeout: 30000 });

            await page.waitForSelector(".program-title-selector", { timeout: 10000 });
            await page.waitForSelector(".rate-selector", { timeout: 10000 });

            const programName = await page.textContent(".program-title-selector") || "Unknown Program";
            const rate = await page.textContent(".rate-selector") || "No Rate Data";

            loanPrograms.push({ programName, rate });
        }

        scrapedData.push({ lenderName, lenderWebsite, loanPrograms });

    } catch (error) {
        console.error(`❌ Error scraping ${site}:`, error.message);
    }
}
 // ✅ Save results to JSON file for manual review
 fs.writeFileSync("scraped_data.json", JSON.stringify(scrapedData, null, 2), "utf8");
 console.log("✅ Data saved to scraped_data.json");

 await browser.close();
})();