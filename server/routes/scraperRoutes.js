const express = require("express");
const router = express.Router();
const runScraper = require("../scraper/playwrightScraper");

router.get("/", async (req, res) => {
  try {
    const scrapers = await Scraper.find(); // ❌ Might be empty
    res.status(200).json({ scrapers });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch scrapers." });
  }
});

router.post("/run", async (req, res) => {
  console.log("🔹 /api/scraper/run endpoint hit.");
  try {
    console.log("🔹 Scraper triggered from the dashboard...");
    const scrapedData = await runScraper(); // Get scraped data
    console.log("✅ Scraper completed successfully.");
    res.status(200).json({ message: "Scraper started successfully.", data: scrapedData });
  } catch (error) {
    console.error("❌ Error running the scraper:", error);
    res.status(500).json({ message: "Failed to start the scraper." });
  }
});

module.exports = router;






