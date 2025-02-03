const express = require("express");
const router = express.Router();
const { LoanProgram, Tier } = require("../models/LoanProgram"); // Import LoanProgram and Tier models
const Lender = require("../models/Lender");

// GET all loan programs for a lender
router.get("/:lenderId/loan-programs", async (req, res) => {
    try {
      const lender = await Lender.findById(req.params.lenderId).populate("loanPrograms");
      if (!lender) {
        return res.status(404).json({ message: "Lender not found" });
      }
  
      // Populate the 'tiers' field when fetching loan programs
      const loanPrograms = await LoanProgram.find({ lender: lender._id }).populate("tiers");
  
      res.json({ loanPrograms: loanPrograms || [] });
    } catch (error) {
      console.error("Error fetching loan programs:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

// GET a single loan program (for editing)
router.get("/:lenderId/loanPrograms/:programId", async (req, res) => {
    try {
        const programId = req.params.programId;
        const loanProgram = await LoanProgram.findById(programId).populate("tiers");
        if (!loanProgram) {
            return res.status(404).json({ message: "Loan program not found" });
        }
        res.status(200).json({ loanProgram });
    } catch (err) {
        console.error(err);
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
  
      // Use LoanProgram.create() to create a new loan program document
      const newLoanProgram = await LoanProgram.create({
        lender: req.params.lenderId, // Use lender (ObjectId)
        name,
        type,
        tiers: createdTiers.map(tier => tier._id), // Assign tier IDs
      });
  
      //... rest of your route logic...
    } catch (error) {
      //... error handling...
    }
  });

// PUT: Update a loan program
router.put("/:lenderId/loanPrograms/:programId", async (req, res) => {
    try {
      const { name, type, tiers } = req.body;
  
      // Use LoanProgram.findByIdAndUpdate() to update the loan program
      const loanProgram = await LoanProgram.findByIdAndUpdate(
        req.params.programId,
        {
          name,
          type,
          tiers: tiers.map(tier => tier._id), // Assign tier IDs
        },
        { new: true, runValidators: true },
      );
  
      if (!loanProgram) {
        return res.status(404).json({ message: "Loan program not found" });
      }
  
      res.status(200).json({ loanProgram });
    } catch (error) {
      console.error("Error updating loan program:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });

// DELETE: Remove a loan program
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

        // Remove the loan program from the lender's loanPrograms array
        lender.loanPrograms = lender.loanPrograms.filter((id) => id.toString()!== req.params.programId);
        await lender.save();

        // Delete the associated tiers
        await Tier.deleteMany({ loanProgramId: req.params.programId });

        res.json({ success: true, message: "Loan program deleted" });
    } catch (error) {
        console.error("Error deleting loan program:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;