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

router.get("/search", async (req, res) => {
  try {
    const {
      state,
      fico,
      experience,
      loanAmount,
      propertyType,
      zipcode,
      loanTerm,
      maxLTV,
      maxPortfolioSize,
      minDSCR,
    } = req.query;

    const filters = {};
    if (propertyType) filters.propertyTypes = propertyType;
    if (loanTerm) filters.termMonths = { $gte: Number(loanTerm) };
    if (maxLTV) filters["tiers.maxLTV"] = { $gte: Number(maxLTV) };
    if (maxPortfolioSize) filters["tiers.maxPortfolioSize"] = { $gte: Number(maxPortfolioSize) };
    if (minDSCR) filters.minDSCR = { $lte: Number(minDSCR) };

    const programs = await PortfolioLoan.find(filters).populate("lender");

    const matchingPrograms = [];

    for (const program of programs) {
      if (state && !program.lender.states.includes(state)) continue;

      const matchingTier = program.tiers.find((tier) => {
        if (fico && tier.minFICO && Number(fico) < tier.minFICO) return false;
        if (experience && tier.minExperience && Number(experience) < tier.minExperience) return false;

        if (loanAmount) {
          const amount = Number(loanAmount);
          if (program.loanRange?.min && amount < program.loanRange.min) return false;
          if (program.loanRange?.max && amount > program.loanRange.max) return false;
        }

        return true;
      });

      if (matchingTier) {
        matchingPrograms.push({
          lenderName: program.lender.name,
          lenderPhone: program.lender.phone,
          lenderId: program.lender._id,
          programId: program._id,
          loanRangeMin: program.loanRange?.min || null,
          loanRangeMax: program.loanRange?.max || null,
          termMonths: program.termMonths || "N/A",
          maxLTV: matchingTier.maxLTV || "N/A",
          maxPortfolioSize: matchingTier.maxPortfolioSize || "N/A",
        });
      }
    }

    res.json(matchingPrograms);
  } catch (error) {
    console.error("❌ Portfolio Search error:", error);
    res.status(500).json({ message: "Server error during Portfolio loan search." });
  }
});


// ✅ DELETE: Remove a Portfolio Loan Program
const mongoose = require("mongoose");

router.delete("/:lenderId/portfolio-programs/:programId", async (req, res) => {
    console.log("🛠️ DELETE Request Received for Portfolio ID:", req.params.programId, "from Lender:", req.params.lenderId);

    try {
        const programId = new mongoose.Types.ObjectId(req.params.programId); // Force conversion to ObjectId

        console.log("🔎 Checking if program exists in MongoDB...");
        const program = await PortfolioLoan.findById(programId);

        if (!program) {
            console.error("❌ Loan program not found in DB:", req.params.programId);
            return res.status(404).json({ error: "Loan program not found in database" });
        }

        console.log("✅ Loan program found. Proceeding with deletion:", program);
        await PortfolioLoan.findByIdAndDelete(programId);

        console.log("✅ Loan program successfully deleted.");
        return res.status(200).json({ success: true, message: "Loan program deleted." });

    } catch (error) {
        console.error("❌ Error deleting DSCR Loan Program:", error);
        return res.status(500).json({ error: "Server error while deleting loan program" });
    }
});


module.exports = router;
