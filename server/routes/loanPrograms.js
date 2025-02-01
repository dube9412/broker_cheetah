const express = require("express");
const router = express.Router();
const LoanProgram = require("../models/LoanProgram"); // Ensure correct casing
const Lender = require("../models/Lender"); // Ensure correct casing

// ✅ GET all loan programs for a lender
router.get("/:lenderId/loan-programs", async (req, res) => {
  try {
    const lender = await Lender.findById(req.params.lenderId);
    if (!lender) {
      return res.status(404).json({ message: "Lender not found" });
    }
    res.json({ loanPrograms: lender.loanPrograms || [] });
  } catch (error) {
    console.error("Error fetching loan programs:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 🟢 POST: Add a loan program to a lender
router.post("/:lenderId/loan-programs", async (req, res) => {
  try {
    const { name, tiers } = req.body;
    const lender = await Lender.findById(req.params.lenderId);
    if (!lender) {
      return res.status(404).json({ message: "Lender not found" });
    }

    const newLoanProgram = new LoanProgram({ lenderId: lender._id, name, tiers });
    await newLoanProgram.save();

    lender.loanPrograms.push(newLoanProgram._id);
    await lender.save();

    res.json({ success: true, loanProgram: newLoanProgram });
  } catch (error) {
    console.error("Error adding loan program:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔄 PUT: Update an existing loan program
router.put("/:lenderId/loan-programs/:programId", async (req, res) => {
  try {
    const { name, tiers } = req.body;
    const loanProgram = await LoanProgram.findByIdAndUpdate(
      req.params.programId,
      { name, tiers },
      { new: true }
    );

    if (!loanProgram) {
      return res.status(404).json({ message: "Loan program not found" });
    }

    res.json({ success: true, loanProgram });
  } catch (error) {
    console.error("Error updating loan program:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔴 DELETE: Remove a loan program from a lender
router.delete("/:lenderId/loan-programs/:programId", async (req, res) => {
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
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;