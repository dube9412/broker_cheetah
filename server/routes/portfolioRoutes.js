const express = require("express");
const router = express.Router();
const PortfolioLoan = require("../models/PortfolioLoan");
const Lender = require("../models/Lender");

// ✅ Debugging: Confirm this file is loaded
console.log("✅ Portfolio Routes File Loaded");

// ✅ GET all Portfolio Loan programs for a lender
router.get("/:lenderId/portfolio-programs", async (req, res) => {
  try {
    const programs = await PortfolioLoan.find({ lender: req.params.lenderId });

    if (!programs.length) {
        console.warn("⚠️ No Portfolio programs found.");
        return res.json([]);  // Return an empty array if none found
        }

    console.log("✅ Found Portfolio programs:", programs);
    res.json(programs);
  } catch (error) {
    console.error("❌ Error fetching Ground Up programs:", error);
    res.status(500).json({ message: "Failed to fetch Ground Up programs." });
  }
});

// ✅ GET a specific Portfolio Loan program by ID
router.get("/portfolio-programs/:programId", async (req, res) => {
  try {
    console.log(`🔹 Fetching Portfolio loan program: ${req.params.programId}`);
    const program = await PortfolioLoan.findById(req.params.programId);
    
    if (!program) {
        console.error("❌ Portfolio Loan Program not found:", req.params.programId);
        return res.status(404).json({ message: "Program not found" });
    }
    console.log("✅ Found Portfolio loan program:", program);
    res.json(program);
  } catch (error) {
    console.error("❌ Error fetching Ground Up program:", error);
    res.status(500).json({ message: "Failed to fetch program." });
  }
});

// ✅ POST: Add a new Portfolio Loan Program
router.post("/:lenderId/portfolio-programs", async (req, res) => {
  try {
    console.log("🔹 Received Portfolio Loan Program data:", req.body);
    const { lenderId } = req.params;

    const lender = await Lender.findById(lenderId);
    if (!lender) {
        console.error("❌ Lender not found:", lenderId);
        return res.status(404).json({ message: "Lender not found" });
        }

    const newProgram = new PortfolioLoan({
        name: req.body.name,
        lender: lenderId,
        type: "Portfolio",
        maxLTV: req.body.maxLTV,
        minLoanAmount: req.body.minLoanAmount,
        maxLoanAmount: req.body.maxLoanAmount, 
        loanTerm: req.body.loanTerm,
        minFICO: req.body.minFICO, 
        maxPortfolioSize: req.body.maxPortfolioSize,
        StylePropertyMap: Array.isArray(req.body.StylePropertyMap) ? req.body.StylePropertyMap : [],
propertyTypes: Array.isArray(req.body.propertyTypes) ? req.body.propertyTypes : [],
        tiers: req.body.tiers || [],
    });

    const savedProgram = await newProgram.save();
    console.log("✅ New Portfolio loan program added:", savedProgram);
    res.status(201).json(savedProgram);
  } catch (error) {
    console.error("❌ Error adding new Portfolio loan program:", error);
    res.status(500).json({ message: "Failed to add new program." });
  }
});

// ✅ PUT: Update a Portfolio Loan Program
router.put("/portfolio-programs/:programId", async (req, res) => {
  try {
    const updatedProgram = await PortfolioLoan.findByIdAndUpdate(req.params.programId, { $set: req.body }, { new: true });
    if (!updatedProgram) {
      return res.status(404).json({ message: "Program not found" });
    }
    res.json({ success: true, program: updatedProgram });
  } catch (error) {
    console.error("❌ Error updating Ground Up program:", error);
    res.status(500).json({ message: "Failed to update program." });
  }
});

// ✅ DELETE: Remove a Portfolio Loan Program
router.delete("/portfolio-programs/:programId", async (req, res) => {
  try {
    const deletedProgram = await PortfolioLoan.findByIdAndDelete(req.params.programId);
    if (!deletedProgram) {
      return res.status(404).json({ message: "Program not found" });
    }
    res.json({ success: true, message: "Program deleted." });
  } catch (error) {
    console.error("❌ Error deleting Ground Up program:", error);
    res.status(500).json({ message: "Failed to delete program." });
  }
});


module.exports = router;
