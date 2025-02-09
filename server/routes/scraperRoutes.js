const express = require('express');
const router = express.Router();
const runScraper = require('../scraper/puppeteerScraper');

router.post('/run', async (req, res) => {
  try {
    console.log("🔹 Scraper triggered from the dashboard...");
    await runScraper();
    res.status(200).json({ message: 'Scraper started successfully.' });
  } catch (error) {
    console.error("❌ Error running the scraper:", error);
    res.status(500).json({ message: 'Failed to start the scraper.' });
  }
});

module.exports = router;


