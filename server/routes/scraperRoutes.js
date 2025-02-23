const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// ✅ List all available scrapers
router.get("/", async (req, res) => {
  try {
    const scraperDir = path.join(__dirname, "../scraper");
    const files = fs.readdirSync(scraperDir);

    // Filter only JavaScript scraper files
    const scrapers = files
      .filter(file => file.endsWith(".js"))
      .map(file => ({
        name: file.replace(".js", ""),
        description: `Scraper for ${file.replace(".js", "")}`,
      }));

    res.status(200).json({ scrapers });
  } catch (error) {
    console.error("❌ Error fetching scrapers:", error);
    res.status(500).json({ message: "Failed to fetch scrapers." });
  }
});

// ✅ Run a specific scraper
router.post("/:scraperName/run", async (req, res) => {
  try {
    const { scraperName } = req.params;
    const scraperPath = path.join(__dirname, `../scraper/${scraperName}.js`);

    if (!fs.existsSync(scraperPath)) {
      return res.status(404).json({ message: "Scraper not found" });
    }

    const scraper = require(scraperPath); // Dynamically load the scraper
    await scraper(); // Run the scraper function

    res.status(200).json({ success: true, message: `${scraperName} scraper started successfully.` });
  } catch (error) {
    console.error(`❌ Error running ${req.params.scraperName} scraper:`, error);
    res.status(500).json({ message: `Failed to run ${req.params.scraperName} scraper.` });
  }
});

module.exports = router;







