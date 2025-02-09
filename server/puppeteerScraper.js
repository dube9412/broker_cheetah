const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const csvWriter = require('csv-writer').createObjectCsvWriter;

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const targetUrl = 'https://example.com/lenders';  // Replace with actual lender URL
  await page.goto(targetUrl, { waitUntil: 'networkidle2' });

  console.log("🔹 Navigating to:", targetUrl);

  const lenders = await page.evaluate(() => {
    const rows = document.querySelectorAll('.lender-row'); // Adjust selector
    return Array.from(rows).map(row => ({
      lenderName: row.querySelector('.lender-name')?.innerText || '',
      minFICO: row.querySelector('.min-fico')?.innerText || '',
      maxLTV: row.querySelector('.max-ltv')?.innerText || '',
      states: row.querySelector('.states-covered')?.innerText || '',
    }));
  });

  console.log("✅ Data Scraped:", lenders);

  const outputFile = path.join(__dirname, 'lenderData.csv');
  const csv = csvWriter({
    path: outputFile,
    header: [
      { id: 'lenderName', title: 'Lender Name' },
      { id: 'minFICO', title: 'Min FICO' },
      { id: 'maxLTV', title: 'Max LTV' },
      { id: 'states', title: 'States Covered' },
    ],
  });

  await csv.writeRecords(lenders);
  console.log(`✅ Data saved to ${outputFile}`);

  await browser.close();
})();
