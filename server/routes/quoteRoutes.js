const express = require("express");
const router = express.Router();
const Quote = require("../models/Quote");
const Lender = require("../models/Lender");
const Pipeline = require("../models/Pipeline");
const sendEmail = require("../utils/email");
const User = require("../models/user"); // Corrected to match the actual file name
const verifyToken = require("../middleware/verifyToken");

// Organize routes by loan program type

// Fix and Flip Quotes
router.post("/fix-and-flip", verifyToken, async (req, res) => {
  try {
    const {
      lenderIds,
      propertyAddress,
      ficoScore,
      experience,
      purchasePrice,
      rehabNeeded,
      arv,
      liquidity,
    } = req.body;

    if (!lenderIds || lenderIds.length === 0 || !propertyAddress || !ficoScore || !experience || !purchasePrice || !rehabNeeded || !arv || !liquidity) {
      return res.status(400).json({ success: false, message: "Required fields are missing." });
    }

    const user = await User.findById(req.user._id);
    if (!user || !user.email) {
      return res.status(400).json({ success: false, message: "User email not found." });
    }

    const quotes = [];

    for (const lenderId of lenderIds) {
      const lender = await Lender.findById(lenderId);
      if (!lender) {
        return res.status(404).json({ success: false, message: `Lender with ID ${lenderId} not found.` });
      }

      const newQuote = new Quote({
        userId: req.user._id,
        lenderId,
        loanType: "fixAndFlip",
        propertyAddress,
        ficoScore,
        experience,
        purchasePrice,
        rehabNeeded,
        arv,
        liquidity,
      });
      await newQuote.save();
      quotes.push(newQuote);
    }

    res.status(201).json({ success: true, message: "Quotes submitted successfully.", quotes });
  } catch (error) {
    console.error("❌ Error submitting Fix and Flip quotes:", error);
    res.status(500).json({ success: false, message: "Server error while submitting quotes." });
  }
});

// DSCR Quotes
router.post("/dscr", verifyToken, async (req, res) => {
  try {
    const {
      lenderIds,
      propertyAddress,
      ficoScore,
      rentRate,
      taxes,
      insurance,
      hoa,
      liquidity,
    } = req.body;

    if (!lenderIds || lenderIds.length === 0 || !propertyAddress || !ficoScore || !rentRate || !taxes || !insurance || !hoa || !liquidity) {
      return res.status(400).json({ success: false, message: "Required fields are missing." });
    }

    const user = await User.findById(req.user._id);
    if (!user || !user.email) {
      return res.status(400).json({ success: false, message: "User email not found." });
    }

    const quotes = [];

    for (const lenderId of lenderIds) {
      const lender = await Lender.findById(lenderId);
      if (!lender) {
        return res.status(404).json({ success: false, message: `Lender with ID ${lenderId} not found.` });
      }

      const newQuote = new Quote({
        userId: req.user._id,
        lenderId,
        loanType: "dscr",
        propertyAddress,
        ficoScore,
        rentRate,
        taxes,
        insurance,
        hoa,
        liquidity,
      });
      await newQuote.save();
      quotes.push(newQuote);
    }

    res.status(201).json({ success: true, message: "Quotes submitted successfully.", quotes });
  } catch (error) {
    console.error("❌ Error submitting DSCR quotes:", error);
    res.status(500).json({ success: false, message: "Server error while submitting quotes." });
  }
});

// Add similar routes for other loan types (e.g., stabilized bridge, ground up, portfolio)

module.exports = router;
