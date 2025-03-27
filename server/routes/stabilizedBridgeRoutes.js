const express = require("express");
const router = express.Router();
const StabilizedBridgeLoan = require("../models/StabilizedBridgeLoan");
const Lender = require("../models/Lender");

// ✅ GET all Stabilized Bridge Loan programs for a lender
router.get("/:lenderId/stabilized-bridge-programs", async (req, res) => {
  try {
    const programs = await StabilizedBridgeLoan.find({ lender: req.params.lenderId });
    res.json(programs);
  } catch (error) {
    console.error("❌ Error fetching Ground Up programs:", error);
    res.status(500).json({ message: "Failed to fetch Ground Up programs." });
  }
});

// ✅ GET a specific Stabilized Bridge Loan program by ID
router.get("/stabilized-bridge-programs/:programId", async (req, res) => {
  try {
    const program = await StabilizedBridgeLoan.findById(req.params.programId);
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }
    res.json(program);
  } catch (error) {
    console.error("❌ Error fetching Ground Up program:", error);
    res.status(500).json({ message: "Failed to fetch program." });
  }
});

// ✅ POST: Add a new Stabilized Bridge Loan Program
router.post("/:lenderId/stabilized-bridge-programs", async (req, res) => {
  try {
    const newProgram = new StabilizedBridgeLoan({ ...req.body, lender: req.params.lenderId });
    await newProgram.save();
    res.status(201).json({ success: true, program: newProgram });
  } catch (error) {
    console.error("❌ Error saving Ground Up program:", error);
    res.status(500).json({ message: "Failed to save program." });
  }
});

// ✅ PUT: Update a Stabilized Bridge Loan Program
router.put("/stabilized-bridge-programs/:programId", async (req, res) => {
  try {
    const updatedProgram = await StabilizedBridgeLoan.findByIdAndUpdate(req.params.programId, { $set: req.body }, { new: true });
    if (!updatedProgram) {
      return res.status(404).json({ message: "Program not found" });
    }
    res.json({ success: true, program: updatedProgram });
  } catch (error) {
    console.error("❌ Error updating Ground Up program:", error);
    res.status(500).json({ message: "Failed to update program." });
  }
});

// ✅ Stabilized Bridge Search Endpoint
router.get("/search", async (req, res) => {
  try {
    const {
      state,
      fico,
      experience,
      loanAmount,
      propertyType,
      zipcode,
      dscrRatio,
    } = req.query;

    const filters = {};

    if (propertyType) filters.propertyTypes = propertyType;

    const programs = await StabilizedBridgeLoan.find(filters).populate("lender");

    const matchingPrograms = [];

    for (const program of programs) {
      if (state && !program.lender.states.includes(state)) continue;

      const matchingTier = program.tiers.find((tier) => {
        if (fico && tier.minFICO && Number(fico) < tier.minFICO) return false;
        if (experience && tier.minExperience && Number(experience) < tier.minExperience) return false;
        if (dscrRatio && tier.minDSCR && Number(dscrRatio) < tier.minDSCR) return false;

        if (loanAmount) {
          const loan = Number(loanAmount);
          if (program.loanRange?.min && loan < program.loanRange.min) return false;
          if (program.loanRange?.max && loan > program.loanRange.max) return false;
        }

        return true;
      });

      if (matchingTier) {
        matchingPrograms.push({
          lenderName: program.lender.name,
          lenderPhone: program.lender.phone,
          lenderId: program.lender._id,
          programId: program._id,
          loanRange: program.loanRange || {},
          termMonths: program.termMonths || "N/A",
          maxLTV: matchingTier.maxLTV || "N/A",
          minDSCR: matchingTier.minDSCR || "N/A",
        });
      }
    }

    res.json(matchingPrograms);
  } catch (error) {
    console.error("❌ Stabilized Bridge Search error:", error);
    res.status(500).json({ message: "Server error during Stabilized Bridge search." });
  }
});


// ✅ DELETE: Remove a Stabilized Bridge Loan Program
const mongoose = require("mongoose");

router.delete("/:lenderId/stabilized-bridge-programs/:programId", async (req, res) => {
    console.log("🛠️ DELETE Request Received for Stabilized Bridge ID:", req.params.programId, "from Lender:", req.params.lenderId);

    try {
        const programId = new mongoose.Types.ObjectId(req.params.programId); // Force conversion to ObjectId

        console.log("🔎 Checking if program exists in MongoDB...");
        const program = await StabilizedBridgeLoan.findById(programId);

        if (!program) {
            console.error("❌ Loan program not found in DB:", req.params.programId);
            return res.status(404).json({ error: "Loan program not found in database" });
        }

        console.log("✅ Loan program found. Proceeding with deletion:", program);
        await StabilizedBridgeLoan.findByIdAndDelete(programId);

        console.log("✅ Loan program successfully deleted.");
        return res.status(200).json({ success: true, message: "Loan program deleted." });

    } catch (error) {
        console.error("❌ Error deleting DSCR Loan Program:", error);
        return res.status(500).json({ error: "Server error while deleting loan program" });
    }
});

module.exports = router;
// Repeat the same pattern as above for Stabilized Bridge Loans

module.exports = router;
