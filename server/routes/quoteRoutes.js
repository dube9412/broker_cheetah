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
// Add detailed debug logs to the /fix-and-flip route
router.post("/fix-and-flip", verifyToken, async (req, res) => {
  try {
    console.log("🔍 Incoming Request Body:", req.body);
    console.log("🔍 User ID from Token:", req.user?.id); // Updated to use req.user.id instead of req.user._id
    console.log("🔍 Lender IDs:", req.body.lenderIds);
    console.log("🔍 Loan Type:", req.body.loanType);

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
      console.error("❌ Missing required fields:", req.body);
      return res.status(400).json({ success: false, message: "Required fields are missing." });
    }

    const user = await User.findById(req.user.id); // Updated to use req.user.id
    if (!user || !user.email) {
      console.error("❌ User not found or email missing:", req.user.id);
      return res.status(400).json({ success: false, message: "User email not found." });
    }

    const quotes = [];

    for (const lenderId of lenderIds) {
      const lender = await Lender.findById(lenderId);
      if (!lender) {
        console.error("❌ Lender not found:", lenderId);
        return res.status(404).json({ success: false, message: `Lender with ID ${lenderId} not found.` });
      }

      const newQuote = new Quote({
        userId: req.user.id, // Updated to use req.user.id
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
      console.log("📝 Saving new quote:", newQuote);
      await newQuote.save();
      quotes.push(newQuote);

      // Send email notification to the lender
      const emailSubject = `New Broker Cheetah FnF Quote Request for ${propertyAddress}`;
      const emailBody = `You have received a new Fix and Flip quote request from ${user.email} through Broker Cheetah.:

        ` + `Replying to this email will send a message to the user that requested it.

` +
        `Property Address: ${propertyAddress}
` +
        `FICO Score: ${ficoScore}
` +
        `Experience: ${experience} flips in the past 36 months
` +
        `Purchase Price: $${purchasePrice.toLocaleString()}
` +
        `Rehab Needed: $${rehabNeeded.toLocaleString()}
` +
        `ARV: $${arv.toLocaleString()}
` +
        `Liquidity: $${liquidity.toLocaleString()}
` +
        (req.body.propertyType ? `Property Type: ${req.body.propertyType}
` : "") +
        (req.body.loanOptions ? `Loan Options: ${JSON.stringify(req.body.loanOptions, null, 2)}
` : "") +
        (req.body.tierLevel ? `Tier Level: ${req.body.tierLevel} (Purchase: ${req.body.purchasePercent || "N/A"}%, Rehab: ${req.body.rehabPercent || "N/A"}%)
` : "") +
        (req.body.constrainedLoanAmount ? `Constrained Loan Amount: $${req.body.constrainedLoanAmount.toLocaleString()} ${req.body.loanConstraints ? `(${req.body.loanConstraints.join(", ")})` : ""}
` : "");

      try {
        await sendEmail(lender.email, emailSubject, emailBody, user.email);
        console.log(`📧 Email sent to lender: ${lender.email}`);
      } catch (error) {
        console.error("❌ Error sending email to lender:", error);
      }
    }

    console.log("✅ Quotes submitted successfully:", quotes);
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

    const user = await User.findById(req.user.id); // Updated to use req.user.id
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
        userId: req.user.id, // Updated to use req.user.id
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

// Change the second route to a unique path for logging quotes
router.post("/fix-and-flip/log", verifyToken, async (req, res) => {
  try {
    const { lenderIds, loanType, ...quoteData } = req.body;

    // Log the quote submission
    const quoteLogs = lenderIds.map((lenderId) => ({
      userId: req.user.id, // Updated to use req.user.id
      lenderId,
      loanType,
      ...quoteData,
    }));

    await Quote.insertMany(quoteLogs);

    res.status(201).json({ success: true, message: "Quote logged successfully." });
  } catch (error) {
    console.error("❌ Error logging quote submission:", error);
    res.status(500).json({ success: false, message: "Server error while logging quote." });
  }
});

// Analytics endpoint: Total submissions by loan type
router.get("/analytics/loan-type", verifyToken, async (req, res) => {
  try {
    const analytics = await Quote.aggregate([
      { $group: { _id: "$loanType", count: { $sum: 1 } } },
    ]);

    res.status(200).json({ success: true, analytics });
  } catch (error) {
    console.error("❌ Error fetching analytics:", error);
    res.status(500).json({ success: false, message: "Server error while fetching analytics." });
  }
});

// Analytics endpoint: User-specific counts
router.get("/analytics/user", verifyToken, async (req, res) => {
  try {
    const userAnalytics = await Quote.aggregate([
      { $match: { userId: req.user.id } }, // Updated to use req.user.id
      { $group: { _id: "$loanType", count: { $sum: 1 } } },
    ]);

    res.status(200).json({ success: true, userAnalytics });
  } catch (error) {
    console.error("❌ Error fetching user analytics:", error);
    res.status(500).json({ success: false, message: "Server error while fetching user analytics." });
  }
});

// Add similar routes for other loan types (e.g., stabilized bridge, ground up, portfolio)

module.exports = router;