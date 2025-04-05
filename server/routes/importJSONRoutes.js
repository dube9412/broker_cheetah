const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Import all loan program models
const FixAndFlipLoan = require("../models/FixAndFlipLoan");
const GroundUpLoan = require("../models/GroundUpLoan");
const DSCRLoan = require("../models/DSCRLoan");
const PortfolioLoan = require("../models/PortfolioLoan");
const StabilizedBridgeLoan = require("../models/StabilizedBridgeLoan");

// Map loan program types to their corresponding models
const loanProgramModels = {
  "fix-and-flip": FixAndFlipLoan,
  "ground-up": GroundUpLoan,
  "dscr": DSCRLoan,
  "portfolio": PortfolioLoan,
  "stabilized-bridge": StabilizedBridgeLoan,
};

router.post("/", async (req, res) => {
  try {
    const payload = req.body;

    if (!Array.isArray(payload)) {
      return res.status(400).json({ message: "Payload must be an array of loan programs" });
    }

    const inserted = [];

    for (const program of payload) {
      try {
        // Check required fields
        if (!program.name || !program.type || !program.lender) {
          console.warn("Skipping program due to missing required fields:", program);
          continue;
        }

        // Normalize the type field to title case
        const typeMapping = {
          "fix and flip": "Fix and Flip",
          "ground up": "Ground Up",
          "dscr": "DSCR",
          "portfolio": "Portfolio",
          "stabilized bridge": "Stabilized Bridge",
        };
        program.type = typeMapping[program.type.toLowerCase()] || program.type;

        // Get the corresponding model for the program type
        const LoanModel = loanProgramModels[program.type.toLowerCase()];
        if (!LoanModel) {
          console.warn(`Skipping program with unsupported type: ${program.type}`);
          continue;
        }

        // Convert lender to ObjectId
        if (!mongoose.Types.ObjectId.isValid(program.lender)) {
          console.error(`❌ Invalid lender ObjectId: ${program.lender}`);
          continue;
        }
        program.lender = new mongoose.Types.ObjectId(program.lender);

        // Save the program using the correct model
        const newProgram = new LoanModel(program);
        const savedProgram = await newProgram.save();
        console.log("✅ Program saved:", savedProgram);

        inserted.push(savedProgram);
      } catch (innerError) {
        console.error("❌ Error processing program:", program, innerError.message);
      }
    }

    res.status(200).json({ success: true, insertedCount: inserted.length, inserted });
  } catch (error) {
    console.error("❌ Error importing JSON:", error);
    res.status(500).json({ success: false, message: "Server error during import" });
  }
});

module.exports = router;
