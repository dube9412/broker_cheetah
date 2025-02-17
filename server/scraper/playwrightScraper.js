// Playwright Scraper - Pulls Lender Websites from Database
const { chromium } = require('playwright');
const fs = require('fs');
const mongoose = require('mongoose');

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
}));

(async () => {
    const browser = await chromium.launch({
        headless: true,
        executablePath: process.env.PLAYWRIGHT_BROWSERS_PATH 
            ? `${process.env.PLAYWRIGHT_BROWSERS_PATH}/chromium/chrome-linux/chrome`
            : undefined
    });
    
    const page = await browser.newPage();

    // Fetch lender websites from MongoDB
    const lenders = await Lender.find({});
    const lenderWebsites = lenders.map(lender => lender.website);

    let scrapedData = [];

    for (const site of lenderWebsites) {
        try {
            await page.goto(site, { waitUntil: 'domcontentloaded' });

            // Extract basic lender info
            const lenderName = await page.textContent('.lender-name-selector');
            const lenderWebsite = site;
            
            // Find subpage links
            const subPages = await page.$$eval('a', links => 
                links.map(link => link.href).filter(href => href.includes('loan-program'))
            );
            
            let loanPrograms = [];

            for (const subPage of subPages) {
                await page.goto(subPage, { waitUntil: 'domcontentloaded' });
                const programName = await page.textContent('.program-title-selector');
                const rate = await page.textContent('.rate-selector');
                
                loanPrograms.push({ programName, rate });
            }

            scrapedData.push({ lenderName, lenderWebsite, loanPrograms });
        } catch (error) {
            console.error(`❌ Error scraping ${site}:`, error);
        }
    }

    // Save to JSON file
    fs.writeFileSync('scraped_data.json', JSON.stringify(scrapedData, null, 2), 'utf8');
    console.log('✅ Data saved to scraped_data.json');

    await browser.close();
    mongoose.connection.close();
})();



