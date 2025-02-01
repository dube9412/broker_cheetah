const express = require("express");
const router = express.Router();
const LoanProgram = require("../models/LoanProgram");
const Lender = require("../models/Lender");
const { FixAndFlipTier, DSCRTier, GroundUpTier, StabilizedBridgeTier } = require("../models/Tier"); // Import Tier Models

// ... (GET all loan programs for a lender - keep as it is)

// GET an individual loan program
router.get("/:lenderId/loanPrograms/:loanProgramId", async (req, res) => {
  try {
    const { loanProgramId } = req.params;

    const loanProgram = await LoanProgram.findById(loanProgramId);

    if (!loanProgram) {
      return res.status(404).json({ message: 'Loan program not found' });
    }

    let populatedTiers = [];
    switch (loanProgram.type) {
      case "Fix and Flip":
        populatedTiers = await FixAndFlipTier.find({ _id: { $in: loanProgram.tiers } });
        break;
      case "DSCR":
        populatedTiers = await DSCRTier.find({ _id: { $in: loanProgram.tiers } });
        break;
      case "Ground Up":
        populatedTiers = await GroundUpTier.find({ _id: { $in: loanProgram.tiers } });
        break;
      case "Stabilized Bridge":
        populatedTiers = await StabilizedBridgeTier.find({ _id: { $in: loanProgram.tiers } });
        break;
      default:
        populatedTiers = []; // Or handle the default case as needed
    }

    loanProgram.tiers = populatedTiers;

    res.json(loanProgram);
  } catch (error) {
    console.error("Error fetching loan program:", error);
    res.status(500).json({ message: 'Server error', error: error.message }); // Send error details
  }
});

// POST: Add a loan program
router.post("/:lenderId/loanPrograms", async (req, res) => {
  try {
    const { name, type, tiers } = req.body;
    const lender = await Lender.findById(req.params.lenderId);

    if (!lender) {
      return res.status(404).json({ message: "Lender not found" });
    }

    let newLoanProgram = new LoanProgram({ lenderId: lender._id, name, type });

    // Create and associate tiers based on type
    let createdTiers = [];
    switch (type) {
      case "Fix and Flip":
        createdTiers = await Promise.all(tiers.map(tier => new FixAndFlipTier(tier).save()));
        break;
      case "DSCR":
        createdTiers = await Promise.all(tiers.map(tier => new DSCRTier(tier).save()));
        break;
      case "Ground Up":
        createdTiers = await Promise.all(tiers.map(tier => new GroundUpTier(tier).save()));
        break;
      case "Stabilized Bridge":
        createdTiers = await Promise.all(tiers.map(tier => new StabilizedBridgeTier(tier).save()));
        break;
    }

    newLoanProgram.tiers = createdTiers.map(tier => tier._id); // Store IDs

    await newLoanProgram.save();
    lender.loanPrograms.push(newLoanProgram._id);
    await lender.save();

    res.json({ success: true, loanProgram: newLoanProgram });
  } catch (error) {
    console.error("Error adding loan program:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// PUT: Update an existing loan program
router.put("/:lenderId/loanPrograms/:programId", async (req, res) => {
  try {
    const { name, type, tiers } = req.body;
    const loanProgram = await LoanProgram.findById(req.params.programId);

    if (!loanProgram) {
      return res.status(404).json({ message: "Loan program not found" });
    }

    loanProgram.name = name;
    loanProgram.type = type;

    // Update tiers based on type (similar to POST)
    let updatedTiers = [];
    switch (type) {
      case "Fix and Flip":
        // Update or create tiers as needed (similar logic for other types)
        break;
    }

    loanProgram.tiers = updatedTiers.map(tier => tier._id);

    await loanProgram.save();

    res.json({ success: true, loanProgram });
  } catch (error) {
    console.error("Error updating loan program:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ... (DELETE route - keep as it is)

module.exports = router;