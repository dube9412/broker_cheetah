const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const LoanProgram = require("../models/LoanProgram");
const Lender = require("../models/Lender");
const { FixAndFlipSchema, DSCRSchema, GroundUpSchema, StabilizedBridgeSchema, BaseTierSchema } = require("../../client/src/components/Tier"); // Import Schemas

// Create Models within the route file
const FixAndFlipTier = mongoose.model("FixAndFlipTier", FixAndFlipSchema);
const DSCRTier = mongoose.model("DSCRTier", DSCRSchema);
const GroundUpTier = mongoose.model("GroundUpTier", GroundUpSchema);
const StabilizedBridgeTier = mongoose.model("StabilizedBridgeTier", StabilizedBridgeSchema);


// GET all loan programs for a lender
router.get("/:lenderId/loanPrograms", async (req, res) => {
  try {
      const lenderId = req.params.lenderId;
      const loanPrograms = await LoanProgram.find({ lender: lenderId });
      res.status(200).json({ loanPrograms });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
  }
});

// GET a single loan program (for editing)
router.get("/:lenderId/loanPrograms/:programId", async (req, res) => {
  try {
      const programId = req.params.programId;
      const loanProgram = await LoanProgram.findById(programId);
      if (!loanProgram) {
          return res.status(404).json({ message: "Loan program not found" });
      }
      res.status(200).json({ loanProgram });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
  }
});

// POST: Add a loan program (Corrected)
router.post("/:lenderId/loanPrograms", async (req, res) => {
  try {
      const { name, type, tiers } = req.body;
      const lender = await Lender.findById(req.params.lenderId);

      if (!lender) {
          return res.status(404).json({ message: "Lender not found" });
      }

      let newLoanProgram = new LoanProgram({ lender: lender._id, name, type }); // Correct: lender field

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

      newLoanProgram.tiers = createdTiers.map(tier => tier._id); // Assign _id's
      await newLoanProgram.save();

      lender.loanPrograms.push(newLoanProgram._id); // Push the _id of the new loan program
      await lender.save();

      res.status(201).json({ loanProgram: newLoanProgram }); // 201 Created
  } catch (error) {
      console.error("Error adding loan program:", error);
      res.status(500).json({ message: "Server error", error: error.message });
  }
});

// PUT: Update an existing loan program (Corrected)
router.put("/:lenderId/loanPrograms/:programId", async (req, res) => {
  try {
      const { name, type, tiers } = req.body;
      const loanProgram = await LoanProgram.findById(req.params.programId);

      if (!loanProgram) {
          return res.status(404).json({ message: "Loan program not found" });
      }

      loanProgram.name = name;
      loanProgram.type = type;

      let updatedTiers = [];

      switch (type) {
          case "Fix and Flip":
              updatedTiers = await Promise.all(tiers.map(tier => {
                  if (tier._id) {
                      return FixAndFlipTier.findByIdAndUpdate(tier._id, tier, { new: true, runValidators: true });
                  } else {
                      return new FixAndFlipTier(tier).save();
                  }
              }));
              break;
          // ... (other cases - same pattern as above)
      }

      loanProgram.tiers = updatedTiers.map(tier => tier._id); // Assign _id's
      await loanProgram.save();

      res.status(200).json({ loanProgram });
  } catch (error) {
      console.error("Error updating loan program:", error);
      res.status(500).json({ message: "Server error", error: error.message });
  }
});

// DELETE: Remove a loan program from a lender (Corrected)
router.delete("/:lenderId/loanPrograms/:programId", async (req, res) => {
  try {
      const lender = await Lender.findById(req.params.lenderId);
      if (!lender) {
          return res.status(404).json({ message: "Lender not found" });
      }

      const loanProgram = await LoanProgram.findByIdAndDelete(req.params.programId); // Get the program to delete

      if (!loanProgram) {
          return res.status(404).json({ message: "Loan program not found" });
      }

      lender.loanPrograms = lender.loanPrograms.filter((program) => program.toString() !== req.params.programId); // Remove from lender
      await lender.save();

      // Delete the associated tier models
      await Promise.all(loanProgram.tiers.map(tierId => {
          switch (loanProgram.type) {
              case "Fix and Flip": return FixAndFlipTier.findByIdAndDelete(tierId);
              case "DSCR": return DSCRTier.findByIdAndDelete(tierId);
              case "Ground Up": return GroundUpTier.findByIdAndDelete(tierId);
              case "Stabilized Bridge": return StabilizedBridgeTier.findByIdAndDelete(tierId);
              default: return Promise.resolve(); // Handle unknown types
          }
      }));


      res.status(204).end(); // 204 No Content on successful delete
  } catch (error) {
      console.error("Error deleting loan program:", error);
      res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;