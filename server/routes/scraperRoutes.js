const express = require('express');
const router = express.Router();
const runScraper = require('../scraper/puppeteerScraper');

router.post('/run', async (req, res) => {
  console.log("🔹 /api/scraper/run endpoint hit.");
  try {
    await runScraper();  // Scraper runs without CSV for now
    console.log("✅ Scraper completed successfully.");
    res.status(200).json({ message: 'Scraper completed.' });
  } catch (error) {
    console.error("❌ Error running the scraper:", error);
    res.status(500).json({ message: 'Failed to start the scraper.' });
  }
});

module.exports = router;





