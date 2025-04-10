const express = require("express");
const router = express.Router();
const Quote = require("../models/Quote");
const Lender = require("../models/Lender");
const Pipeline = require("../models/Pipeline");
const sendEmail = require("../utils/email");
const User = require("../models/user"); // Corrected to match the actual file name
const verifyToken = require("../middleware/verifyToken");

// ✅ Submit a quote request
router.post("/", verifyToken, async (req, res) => {
  try {
    const {
      lenderId,
      propertyAddress,
      ficoScore,
      experience,
      purchasePrice,
      rehabNeeded,
      arv,
      liquidity,
      rentRate = null,
      taxes = null,
      insurance = null,
      hoa = null,
      loanType,
    } = req.body;

    if (!lenderId || !propertyAddress || !ficoScore || !loanType) {
      return res.status(400).json({ success: false, message: "Required fields are missing." });
    }

    const user = await User.findById(req.user._id);
    if (!user || !user.email) {
      return res.status(400).json({ success: false, message: "User email not found." });
    }

    const lender = await Lender.findById(lenderId);
    if (!lender) {
      return res.status(404).json({ success: false, message: "Lender not found." });
    }

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
      rentRate,
      taxes,
      insurance,
      hoa,
      loanType,
    });
    await newQuote.save();

    const pipelineEntry = new Pipeline({
      userId: req.user._id,
      address: propertyAddress,
      fico: ficoScore,
      experience,
      purchasePrice,
      asisValue: purchasePrice,
      rehabNeeded,
      arv,
      liquidity,
      milestones: [{ name: "Quote Requested", status: "completed" }],
    });
    await pipelineEntry.save();

    const emailBody = `
      New Quote Request:
      Loan Type: ${loanType}
      Property Address: ${propertyAddress}
      FICO Score: ${ficoScore}
      Experience: ${experience}
      Purchase Price: $${purchasePrice}
      Rehab Needed: $${rehabNeeded}
      ARV: $${arv}
      Liquidity: $${liquidity}
    `;
    await sendEmail(lender.email, `Quote Request for ${propertyAddress}`, emailBody, user.email);

    res.status(201).json({ success: true, message: "Quote request submitted successfully." });
  } catch (error) {
    console.error("❌ Error submitting quote request:", error);
    res.status(500).json({ success: false, message: "Server error while submitting quote request." });
  }
});

module.exports = router;
