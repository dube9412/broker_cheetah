const express = require("express");
const router = express.Router();
const LoanProgram = require("../models/LoanProgram");
const Lender = require("../models/Lender");

// GET all loan programs for a lender
router.get("/lenders/:lenderId/loan-programs", async (req, res) => {
  try {
    const lender = await Lender.findById(req.params.lenderId).populate("loanPrograms");
    if (!lender) return res.status(404).json({ message: "Lender not found" });

    res.json(lender.loanPrograms);
  } catch (error) {
    console.error("Error fetching loan programs:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET a specific loan program
router.get("/lenders/:lenderId/loan-programs/:programId", async (req, res) => {
  try {
    const program = await LoanProgram.findById(req.params.programId);
    if (!program) return res.status(404).json({ message: "Loan program not found" });

    res.json(program);
  } catch (error) {
    console.error("Error fetching loan program:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// CREATE a new loan program
router.post("/lenders/:lenderId/loan-programs", async (req, res) => {
  try {
    const lender = await Lender.findById(req.params.lenderId);
    if (!lender) return res.status(404).json({ message: "Lender not found" });

    const newProgram = new LoanProgram(req.body);
    await newProgram.save();

    lender.loanPrograms.push(newProgram._id);
    await lender.save();

    res.status(201).json(newProgram);
  } catch (error) {
    console.error("Error creating loan program:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE an existing loan program
router.put("/lenders/:lenderId/loan-programs/:programId", async (req, res) => {
  try {
    const updatedProgram = await LoanProgram.findByIdAndUpdate(req.params.programId, req.body, { new: true });
    if (!updatedProgram) return res.status(404).json({ message: "Loan program not found" });

    res.json(updatedProgram);
  } catch (error) {
    console.error("Error updating loan program:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE a loan program
router.delete("/lenders/:lenderId/loan-programs/:programId", async (req, res) => {
  try {
    const deletedProgram = await LoanProgram.findByIdAndDelete(req.params.programId);
    if (!deletedProgram) return res.status(404).json({ message: "Loan program not found" });

    await Lender.findByIdAndUpdate(req.params.lenderId, { $pull: { loanPrograms: req.params.programId } });

    res.json({ message: "Loan program deleted successfully" });
  } catch (error) {
    console.error("Error deleting loan program:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
