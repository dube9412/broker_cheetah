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

// POST: Add a loan program (Significant Changes)
router.post("/:lenderId/loanPrograms", async (req, res) => {
    try {
        const { name, type, tiers } = req.body;  // tiers will now contain the correct structure
        const lender = await Lender.findById(req.params.lenderId);

        if (!lender) {
            return res.status(404).json({ message: "Lender not found" });
        }

        let newLoanProgram = new LoanProgram({ lenderId: lender._id, name, type });

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
                return res.status(400).json({ message: "Invalid loan program type" }); // Handle invalid type
        }

        newLoanProgram.tiers = createdTiers.map(tier => tier._id);

        await newLoanProgram.save();
        lender.loanPrograms.push(newLoanProgram._id);
        await lender.save();

        res.json({ success: true, loanProgram: newLoanProgram });
    } catch (error) {
        console.error("Error adding loan program:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// PUT: Update an existing loan program (Significant Changes)
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
                    if (tier._id) { // If _id exists, it's an existing tier to update
                        return FixAndFlipTier.findByIdAndUpdate(tier._id, tier, { new: true });
                    } else { // Otherwise, create a new tier
                        return new FixAndFlipTier(tier).save();
                    }
                }));
                break;
            case "DSCR":
                updatedTiers = await Promise.all(tiers.map(tier => {
                    if (tier._id) {
                        return DSCRTier.findByIdAndUpdate(tier._id, tier, { new: true });
                    } else {
                        return new DSCRTier(tier).save();
                    }
                }));
                break;
            case "Ground Up":
                updatedTiers = await Promise.all(tiers.map(tier => {
                    if (tier._id) {
                        return GroundUpTier.findByIdAndUpdate(tier._id, tier, { new: true });
                    } else {
                        return new GroundUpTier(tier).save();
                    }
                }));
                break;
            case "Stabilized Bridge":
                updatedTiers = await Promise.all(tiers.map(tier => {
                    if (tier._id) {
                        return StabilizedBridgeTier.findByIdAndUpdate(tier._id, tier, { new: true });
                    } else {
                        return new StabilizedBridgeTier(tier).save();
                    }
                }));
                break;
            default:
                return res.status(400).json({ message: "Invalid loan program type" });
        }

        loanProgram.tiers = updatedTiers.map(tier => tier._id);

        await loanProgram.save();

        res.json({ success: true, loanProgram });
    } catch (error) {
        console.error("Error updating loan program:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// DELETE: Remove a loan program from a lender
router.delete("/:lenderId/loanPrograms/:programId", async (req, res) => {
  try {
      const lender = await Lender.findById(req.params.lenderId);
      if (!lender) {
          return res.status(404).json({ message: "Lender not found" });
      }

      await LoanProgram.findByIdAndDelete(req.params.programId);
      lender.loanPrograms = lender.loanPrograms.filter((program) => program.toString() !== req.params.programId);
      await lender.save();

      res.json({ success: true, message: "Loan program deleted" });
  } catch (error) {
      console.error("Error deleting loan program:", error);
      res.status(500).json({ message: "Server error", error: error.message });
  }
});
module.exports = router;