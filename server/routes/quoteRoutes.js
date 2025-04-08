const express = require("express");
const router = express.Router();
const Quote = require("../models/Quote");
const Lender = require("../models/Lender");
const Pipeline = require("../models/Pipeline");
const sendEmail = require("../utils/email");
const User = require("../models/user"); // Corrected to match the actual file name

// ✅ Submit a quote request
router.post("/", async (req, res) => {
  try {
    console.log("Incoming Request Body:", req.body); // Debugging

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

    console.log("Parsed Request Data:", {
      lenderId,
      propertyAddress,
      ficoScore,
      experience,
      purchasePrice,
      rehabNeeded,
      arv,
      liquidity,
      loanType,
    });

    if (!lenderId || !propertyAddress || !ficoScore || !loanType) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ success: false, message: "Required fields are missing." });
    }

    // Fetch user's email
    const user = await User.findById(req.user._id);
    if (!user || !user.email) {
      console.log("❌ User not found or email missing");
      return res.status(400).json({ success: false, message: "User email not found." });
    }

    console.log("✅ User found:", user.email);

    // Determine borrower's tier
    let tier = "Tier 3";
    if (ficoScore >= 720 && experience >= 5) {
      tier = "Tier 1";
    } else if (ficoScore >= 680 && experience >= 2) {
      tier = "Tier 2";
    }

    // Calculate anticipated loan amounts
    const purchaseLoanAmount = Math.min(purchasePrice * 0.75, arv * 0.7); // 75% of purchase price or 70% of ARV
    const rehabLoanAmount = Math.min(rehabNeeded * 0.8, arv * 0.7 - purchaseLoanAmount); // 80% of rehab or remaining ARV limit
    const totalLoanAmount = purchaseLoanAmount + rehabLoanAmount;

    // Calculate loan limitations
    const arvLimit = arv * 0.7; // 70% of ARV
    const tltcLimit = (purchasePrice + rehabNeeded) * 0.85; // 85% of total project cost

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
      rentRate,
      taxes,
      insurance,
      hoa,
      loanType,
    });
    await newQuote.save();
    console.log("✅ Quote saved to database");

    // Fetch lender details
    const lender = await Lender.findById(lenderId);
    if (!lender) {
      console.log("❌ Lender not found");
      return res.status(404).json({ success: false, message: "Lender not found." });
    }

    console.log("✅ Lender found:", lender.email);

    // Construct email content
    let emailBody = `
      A new quote request has been submitted:

      Loan Type: ${loanType}
      Tier: ${tier}

      Property Address: ${propertyAddress}
      FICO Score: ${ficoScore}
      Liquidity: $${liquidity}
    `;

    if (loanType === "fixAndFlip") {
      emailBody += `
        Borrower Details:
        - Experience: ${experience} flips completed
        - Purchase Price: $${purchasePrice}
        - Rehab Needed: $${rehabNeeded}
        - ARV: $${arv}

        Anticipated Loan Amounts:
        - Purchase Loan Amount: $${purchaseLoanAmount.toFixed(2)}
        - Rehab Loan Amount: $${rehabLoanAmount.toFixed(2)}
        - Total Loan Amount: $${totalLoanAmount.toFixed(2)}

        Loan Limitations:
        - ARV Limit (70% of ARV): $${arvLimit.toFixed(2)}
        - TLTC Limit (85% of Total Cost): $${tltcLimit.toFixed(2)}
      `;
    } else if (loanType === "dscr") {
      emailBody += `
        Loan Details:
        - Rent Rate: $${rentRate || "N/A"}/month
        - Taxes: $${taxes || "N/A"}/year
        - Insurance: $${insurance || "N/A"}/year
        - HOA Fees: $${hoa || "N/A"}/month
      `;
    }

    // Send email notification to the lender
    await sendEmail(lender.email, `New Quote Request for ${propertyAddress} (${tier})`, emailBody, user.email);
    console.log("✅ Email sent to lender");

    // Add the quote request to the user's pipeline
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

    res.status(201).json({ success: true, message: "Quote request submitted successfully." });
  } catch (error) {
    console.error("❌ Error submitting quote request:", error);
    res.status(500).json({ success: false, message: "Server error while submitting quote request." });
  }
});

module.exports = router;
