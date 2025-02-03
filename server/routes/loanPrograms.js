const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Lender = require("../models/Lender");
const LoanProgram = require("../models/LoanProgram");
const { FixAndFlipSchema, DSCRSchema, GroundUpSchema, StabilizedBridgeSchema } = require("../../client/src/components/Tier");

// Create Models within the route file if not already declared
const FixAndFlipTier = mongoose.models.FixAndFlipTier || mongoose.model("FixAndFlipTier", FixAndFlipSchema);
const DSCRTier = mongoose.models.DSCRTier || mongoose.model("DSCRTier", DSCRSchema);
const GroundUpTier = mongoose.models.GroundUpTier || mongoose.model("GroundUpTier", GroundUpSchema);
const StabilizedBridgeTier = mongoose.models.StabilizedBridgeTier || mongoose.model("StabilizedBridgeTier", StabilizedBridgeSchema);

// GET all loan programs for a lender
router.get("/:lenderId/loanPrograms", async (req, res) => {
    try {
        const lender = await Lender.findById(req.params.lenderId).populate("loanPrograms"); // Populate loanPrograms
        if (!lender) {
            return res.status(404).json({ message: "Lender not found" });
        }
        res.json({ loanPrograms: lender.loanPrograms || [] });
    } catch (error) {
        console.error("Error fetching loan programs:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// GET a single loan program (for editing)
router.get("/:lenderId/loanPrograms/:programId", async (req, res) => {
    try {
        const loanProgram = await LoanProgram.findById(req.params.programId).populate("tiers");
        if (!loanProgram) {
            return res.status(404).json({ message: "Loan program not found" });
        }
        res.json({ loanProgram });
    } catch (error) {
        console.error("Error fetching loan program:", error);
        res.status(500).json({ message: "Server error" });
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

      const newLoanProgram = new LoanProgram({ lender: lender._id, name, type }); // Use lender._id

      let createdTiers = [];
      switch (type) { // Use switch statement for cleaner code.
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
          default:
              return res.status(400).json({ message: "Invalid loan program type" });
      }

      newLoanProgram.tiers = createdTiers.map(tier => tier._id);
      await newLoanProgram.save();

      lender.loanPrograms.push(newLoanProgram._id);
      await lender.save();

      res.json({ success: true, loanProgram: newLoanProgram });
  } catch (error) {
      console.error("Error adding loan program:", error);
      res.status(500).json({ message: "Server error" });
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

    // Delete existing tiers
    await FixAndFlipTier.deleteMany({ loanProgramId: loanProgram._id });
    await DSCRTier.deleteMany({ loanProgramId: loanProgram._id });
    await GroundUpTier.deleteMany({ loanProgramId: loanProgram._id });
    await StabilizedBridgeTier.deleteMany({ loanProgramId: loanProgram._id });

    // Create new tiers
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
      default:
        return res.status(400).json({ message: "Invalid loan program type" });
    }

    loanProgram.tiers = createdTiers.map(tier => tier._id);
    await loanProgram.save();

    res.json({ success: true, loanProgram });
  } catch (error) {
    console.error("Error updating loan program:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE: Remove a loan program from a lender
router.delete("/:lenderId/loanPrograms/:programId", async (req, res) => {
  try {
    const lender = await Lender.findById(req.params.lenderId);
    if (!lender) {
      return res.status(404).json({ message: "Lender not found" });
    }

    const loanProgram = await LoanProgram.findByIdAndDelete(req.params.programId);

    if (!loanProgram) {
      return res.status(404).json({ message: "Loan program not found" });
    }

    lender.loanPrograms = lender.loanPrograms.filter(program => program.toString() !== req.params.programId);
    await lender.save();

    // Delete associated tiers (if applicable)
    await FixAndFlipTier.deleteMany({ loanProgramId: req.params.programId });
    await DSCRTier.deleteMany({ loanProgramId: req.params.programId });
    await GroundUpTier.deleteMany({ loanProgramId: req.params.programId });
    await StabilizedBridgeTier.deleteMany({ loanProgramId: req.params.programId });

    res.json({ success: true, message: "Loan program deleted" });
  } catch (error) {
    console.error("Error deleting loan program:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;