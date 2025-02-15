const express = require('express');
const router = express.Router();
const runScraper = require('../scraper/puppeteerScraper');
const fs = require('fs');

router.post('/run', async (req, res) => {
  try {
    console.log("🔹 Scraper triggered from the dashboard...");
    const csvPath = await runScraper();  // Return the path of the CSV file
    res.download(csvPath, 'scrapedData.csv');  // Send CSV file for download
  } catch (error) {
    console.error("❌ Error running the scraper:", error);
    res.status(500).json({ message: 'Failed to start the scraper.' });
  }
});

module.exports = router;



