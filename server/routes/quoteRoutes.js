const express = require("express");
const router = express.Router();
const Quote = require("../models/Quote");
const Lender = require("../models/Lender");
const verifyToken = require("../middleware/verifyToken");

// ✅ Submit a quote request
router.post("/", verifyToken, async (req, res) => {
  try {
    const { lenderId, propertyAddress, ficoScore, experience, purchasePrice, rehabNeeded, arv, liquidity } = req.body;

    if (!lenderId || !propertyAddress || !ficoScore || !experience || !purchasePrice || !rehabNeeded || !arv || !liquidity) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // Save the quote request in the database
    const newQuote = new Quote({
      userId: req.user._id,
      lenderId,
      propertyAddress,
      ficoScore,
      experience,
      purchasePrice,
      rehabNeeded,
      arv,
      liquidity,
    });
    await newQuote.save();

    // Fetch lender details
    const lender = await Lender.findById(lenderId);
    if (!lender) {
      return res.status(404).json({ success: false, message: "Lender not found." });
    }

    // Send email notification to the lender (placeholder logic)
    console.log(`📧 Sending email to ${lender.email} for quote request...`);

    res.status(201).json({ success: true, message: "Quote request submitted successfully." });
  } catch (error) {
    console.error("❌ Error submitting quote request:", error);
    res.status(500).json({ success: false, message: "Server error while submitting quote request." });
  }
});

module.exports = router;
