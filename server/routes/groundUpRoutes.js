const express = require("express");
const router = express.Router();
const GroundUpLoan = require("../models/GroundUpLoan");
const Lender = require("../models/Lender");

// ✅ Debugging: Confirm this file is loaded
console.log("✅ Ground Up Routes File Loaded");

// ✅ GET all Ground Up loan programs for a lender
router.get("/:lenderId/ground-up-programs", async (req, res) => {
    try {
        const groundUpPrograms = await GroundUpLoan.find({ lender: req.params.lenderId });
    
        if (!groundUpPrograms.length) {
          console.warn("⚠️ No Ground Up programs found.");
          return res.json([]);  // Return an empty array if none found
        }
    
        console.log("✅ Found Ground Up programs:", groundUpPrograms);
        res.json(groundUpPrograms);
      } catch (error) {
        console.error("❌ Error fetching Ground Up programs:", error);
        res.status(500).json({ message: "Failed to fetch Ground Up programs." });
      }
    });

// ✅ GET a specific Ground Up loan program by ID
router.get("/ground-up-programs/:programId", async (req, res) => {
  try {
    console.log(`🔹 Fetching Ground Up loan program: ${req.params.programId}`);
    const program = await GroundUpLoan.findById(req.params.programId);

    if (!program) {
        console.error("❌ Ground Up Loan Program not found:", req.params.programId);
      return res.status(404).json({ message: "Program not found" });
    }
    console.log("✅ Found Ground Up loan program:", program);
    res.json(program);
  } catch (error) {
    console.error("❌ Error fetching Ground Up program:", error);
    res.status(500).json({ message: "Failed to fetch program." });
  }
});

// ✅ POST: Add a new Ground Up Loan Program
router.post("/:lenderId/ground-up-programs", async (req, res) => {
  try {
    const { lenderId } = req.params;

    const newProgram = new GroundUpLoan({
      name: req.body.name || "Ground Up Construction Loan",
      type: req.body.type || "Ground Up",
      lender: lenderId,

      // ✅ Base-level fields
      experienceWindowMonths: req.body.experienceWindowMonths || null,
      minAsIsValue: req.body.minAsIsValue || null,
      termLengthMonths: req.body.termLengthMonths || null,
      constructionBudget: req.body.constructionBudget || null,
      recourse: req.body.recourse || { recourse: false, nonRecourse: false },
      interestType: req.body.interestType || { dutch: false, nonDutch: false },
      drawType: req.body.drawType || { self: false, thirdParty: false },
      crossCollateralAllowed:
        typeof req.body.crossCollateralAllowed === "boolean"
          ? req.body.crossCollateralAllowed
          : null,

      propertyTypes: Array.isArray(req.body.propertyTypes) ? req.body.propertyTypes : [],

      // ✅ Tiers array
      tiers: Array.isArray(req.body.tiers) ? req.body.tiers : [],
    });

    await newProgram.save();
    res.status(201).json({ success: true, program: newProgram });
  } catch (error) {
    console.error("❌ Error creating Ground Up program:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ PUT: Update a Ground Up Loan Program
router.put("/ground-up-programs/:programId", async (req, res) => {
  try {
    const updatePayload = {
      experienceWindowMonths: req.body.experienceWindowMonths || null,
      minAsIsValue: req.body.minAsIsValue || null,
      termLengthMonths: req.body.termLengthMonths || null,
      constructionBudget: req.body.constructionBudget || null,
      recourse: req.body.recourse || { recourse: false, nonRecourse: false },
      interestType: req.body.interestType || { dutch: false, nonDutch: false },
      drawType: req.body.drawType || { self: false, thirdParty: false },
      crossCollateralAllowed:
        typeof req.body.crossCollateralAllowed === "boolean"
          ? req.body.crossCollateralAllowed
          : null,

      propertyTypes: Array.isArray(req.body.propertyTypes) ? req.body.propertyTypes : [],
      tiers: Array.isArray(req.body.tiers) ? req.body.tiers : [],
    };

    const updatedProgram = await GroundUpLoan.findByIdAndUpdate(
      req.params.programId,
      { $set: updatePayload },
      { new: true, runValidators: true }
    );

    if (!updatedProgram) {
      return res.status(404).json({ message: "Loan program not found" });
    }

    res.json({ success: true, program: updatedProgram });
  } catch (error) {
    console.error("❌ Error updating Ground Up Loan Program:", error);
    res.status(500).json({ message: "Failed to update loan program" });
  }
});

// ✅ Ground Up Search Endpoint
router.get("/search", async (req, res) => {
  try {
    const {
      state,
      fico,
      experience,
      loanAmount,
      propertyType,
      zipcode,
    } = req.query;

    const filters = {};

    if (propertyType) filters.propertyTypes = propertyType;

    const programs = await GroundUpLoan.find(filters).populate("lender");

    const matchingPrograms = [];

    for (const program of programs) {
      if (state && !program.lender.states.includes(state)) continue;

      const matchingTier = program.tiers.find((tier) => {
        if (fico && tier.minFICO && Number(fico) < tier.minFICO) return false;
        if (experience && tier.minExperience && Number(experience) < tier.minExperience) return false;

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
          constructionBudget: program.constructionBudget || "N/A",
          maxLTV: matchingTier.maxLTV || "N/A",
          maxLTC: matchingTier.maxLTC || "N/A",
        });
      }
    }

    res.json(matchingPrograms);
  } catch (error) {
    console.error("❌ Ground Up Search error:", error);
    res.status(500).json({ message: "Server error during Ground Up search." });
  }
});


// ✅ DELETE: Remove a Ground Up Loan Program
const mongoose = require("mongoose");

router.delete("/:lenderId/ground-up-programs/:programId", async (req, res) => {
    console.log("🛠️ DELETE Request Received for Ground Up ID:", req.params.programId, "from Lender:", req.params.lenderId);

    try {
        const programId = new mongoose.Types.ObjectId(req.params.programId); // Force conversion to ObjectId

        console.log("🔎 Checking if program exists in MongoDB...");
        const program = await GroundUpLoan.findById(programId);

        if (!program) {
            console.error("❌ Loan program not found in DB:", req.params.programId);
            return res.status(404).json({ error: "Loan program not found in database" });
        }

        console.log("✅ Loan program found. Proceeding with deletion:", program);
        await GroundUpLoan.findByIdAndDelete(programId);

        console.log("✅ Loan program successfully deleted.");
        return res.status(200).json({ success: true, message: "Loan program deleted." });

    } catch (error) {
        console.error("❌ Error deleting DSCR Loan Program:", error);
        return res.status(500).json({ error: "Server error while deleting loan program" });
    }
});


module.exports = router;
