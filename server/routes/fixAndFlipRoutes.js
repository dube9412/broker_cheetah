const express = require("express");
const router = express.Router();
const FixAndFlipLoan = require("../models/FixAndFlipLoan");
const Lender = require("../models/Lender");

// ✅ Debugging: Confirm this file is loaded
console.log("✅ Fix and Flip Routes File Loaded");

// ✅ GET all Fix and Flip programs for a lender
router.get("/:lenderId/fix-and-flip-programs", async (req, res) => {
  try {
    console.log(`🔹 Fetching Fix and Flip programs for lenderId: ${req.params.lenderId}`);
    const fixAndFlipPrograms = await FixAndFlipLoan.find({ lender: req.params.lenderId });

    if (fixAndFlipPrograms.length === 0) {
      console.warn("⚠️ No Fix and Flip programs found.");
      return res.status(404).json({ message: "No Fix and Flip programs found." });
    }

    console.log("✅ Found Fix and Flip programs:", fixAndFlipPrograms);
    res.json(fixAndFlipPrograms);
  } catch (error) {
    console.error("❌ Error fetching Fix and Flip programs:", error);
    res.status(500).json({ message: "Failed to fetch Fix and Flip programs." });
  }
});

// ✅ GET a specific Fix and Flip loan program by ID
router.get("/fix-and-flip-programs/:programId", async (req, res) => {
  try {
    console.log(`🔹 Fetching Fix and Flip loan program: ${req.params.programId}`);
    const program = await FixAndFlipLoan.findById(req.params.programId);

    if (!program) {
      console.error("❌ Fix and Flip Loan Program not found:", req.params.programId);
      return res.status(404).json({ message: "Loan program not found" });
    }

    console.log("✅ Found Fix and Flip loan program:", program);
    res.json(program);
  } catch (error) {
    console.error("❌ Error fetching Fix and Flip loan program:", error);
    res.status(500).json({ message: "Failed to fetch loan program" });
  }
});

// ✅ POST: Add a new Fix and Flip Loan Program
router.post("/:lenderId/fix-and-flip-programs", async (req, res) => {
  try {
    const { lenderId } = req.params;

    const newProgram = new FixAndFlipLoan({
      name: req.body.name || "Fix and Flip",
      type: req.body.type || "Fix and Flip",
      lender: lenderId,

      // ✅ Base-level fields
      experienceWindowMonths: req.body.experienceWindowMonths || null,
      minAsIsValue: req.body.minAsIsValue || null,
      termLengthMonths: req.body.termLengthMonths || null,
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
    console.error("❌ Error creating Fix & Flip program:", error.message);
    console.error("❌ Stack Trace:", error.stack);
    res.status(500).json({ success: false, message: error.message });
  }
  
});

// ✅ PUT: Update a Fix and Flip Loan Program
router.put("/fix-and-flip-programs/:programId", async (req, res) => {
  try {
    console.log(`🔹 Updating Fix and Flip loan program: ${req.params.programId}`);

    const updatePayload = {
      experienceWindowMonths: req.body.experienceWindowMonths || null,
      minAsIsValue: req.body.minAsIsValue || null,
      termLengthMonths: req.body.termLengthMonths || null,
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
    
    const updatedProgram = await FixAndFlipLoan.findByIdAndUpdate(
      req.params.programId,
      { $set: updatePayload },
      { new: true, runValidators: true }
    );
    

    if (!updatedProgram) {
      console.error("❌ Fix and Flip Loan Program not found:", req.params.programId);
      return res.status(404).json({ message: "Loan program not found" });
    }

    console.log("✅ Fix and Flip Loan Program updated:", updatedProgram);
    res.json({ success: true, program: updatedProgram });
  } catch (error) {
    console.error("❌ Error updating Fix and Flip Loan Program:", error);
    res.status(500).json({ message: "Failed to update loan program" });
  }
});

// ✅ DELETE: Remove a Fix and Flip Loan Program
const mongoose = require("mongoose");

router.delete("/:lenderId/fix-and-flip-programs/:programId", async (req, res) => {
    console.log("🛠️ DELETE Request Received for Fix and Flip ID:", req.params.programId, "from Lender:", req.params.lenderId);

    try {
        const programId = new mongoose.Types.ObjectId(req.params.programId); // Force conversion to ObjectId

        console.log("🔎 Checking if program exists in MongoDB...");
        const program = await FixAndFlipLoan.findById(programId);

        if (!program) {
            console.error("❌ Loan program not found in DB:", req.params.programId);
            return res.status(404).json({ error: "Loan program not found in database" });
        }

        console.log("✅ Loan program found. Proceeding with deletion:", program);
        await FixAndFlipLoan.findByIdAndDelete(programId);

        console.log("✅ Loan program successfully deleted.");
        return res.status(200).json({ success: true, message: "Loan program deleted." });

    } catch (error) {
        console.error("❌ Error deleting Fix and Flip Loan Program:", error);
        return res.status(500).json({ error: "Server error while deleting loan program" });
    }
});

// ✅ SEARCH Fix and Flip Programs
router.get("/search", async (req, res) => {
  try {
    const {
      state,
      fico,
      purchasePrice,
      rehabNeeded,
      arv,
      asisValue,
      experience,
      liquidity,
      recourse,
      nonRecourse,
      interestTypeDutch,
      interestTypeNonDutch,
      crossCollateralAllowed,
      propertyType,
    } = req.query;

    console.log("🔍 Search Query Parameters:", req.query);

    const filters = {};

    // Apply loan option filters
    if (crossCollateralAllowed) filters.crossCollateralAllowed = crossCollateralAllowed;

    if (recourse === "true" || nonRecourse === "true") {
      filters.$or = [];
      if (recourse === "true") filters.$or.push({ "recourse.recourse": true });
      if (nonRecourse === "true") filters.$or.push({ "recourse.nonRecourse": true });
    }

    if (interestTypeDutch === "true" || interestTypeNonDutch === "true") {
      filters.$or = filters.$or || [];
      if (interestTypeDutch === "true") filters.$or.push({ "interestType.dutch": true });
      if (interestTypeNonDutch === "true") filters.$or.push({ "interestType.nonDutch": true });
    }

    if (propertyType) filters.propertyTypes = propertyType;

    console.log("🔍 Filters Applied:", filters);

    const programs = await FixAndFlipLoan.find(filters).populate("lender");

    console.log("🔍 Matching Programs Found:", programs.length);

    const matchingPrograms = [];

    for (const program of programs) {
      if (state && !program.lender.states.includes(state)) continue;

      const matchingTier = program.tiers.find((tier) => {
        if (fico && tier.minFICO && Number(fico) < tier.minFICO) return false;
        if (experience && tier.minExperience && Number(experience) < tier.minExperience) return false;

        const pp = Number(purchasePrice) || 0;
        const rehab = Number(rehabNeeded) || 0;
        const arvNum = Number(arv) || 0;
        const asIs = Number(asisValue) || pp;

        if (pp > asIs) {
          program.warning = "The purchase price difference will have to be covered by the borrower.";
        }

        const totalCost = pp + rehab;
        const ltcLimit = tier.maxLTC ? (asIs * tier.maxLTC) / 100 : Infinity;
        const totalLtcLimit = tier.totalLTC ? (totalCost * tier.totalLTC) / 100 : Infinity;
        const arvLimit = tier.maxARV ? (arvNum * tier.maxARV) / 100 : Infinity;

        if (totalCost > totalLtcLimit || totalCost > arvLimit) {
          program.warning = "The loan amount may be further limited due to ARV or Total Loan to Cost factors.";
        }

        return true;
      });

      if (matchingTier) {
        matchingPrograms.push({
          name: program.lender.name,
          phone: program.lender.phone,
          email: program.lender.email,
          maxLTC: matchingTier.maxLTC || "N/A",
          rehabPercent: matchingTier.rehabPercent || "N/A",
          termLengthMonths: program.termLengthMonths || "N/A",
          interestType: program.interestType?.dutch ? "Dutch" : program.interestType?.nonDutch ? "Non-Dutch" : "N/A",
          recourse: program.recourse?.recourse ? "Recourse" : program.recourse?.nonRecourse ? "Non-Recourse" : "N/A",
          rehabType: pp && rehab ? (rehab / pp > 1 ? "Heavy" : rehab / pp > 0.5 ? "Medium" : "Light") : "N/A",
          warning: program.warning || null,
          lenderId: program.lender._id,
          programId: program._id,
        });
      }
    }

    console.log("🔍 Final Matching Programs:", matchingPrograms.length);
    res.json(matchingPrograms);
  } catch (error) {
    console.error("❌ Error in Fix and Flip Search:", error);
    res.status(500).json({ message: "Search failed" });
  }
});

  
// ✅ Debugging: List Registered Routes
console.log("✅ Registered Routes in Fix and Flip Routes:");
router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`✅ ${Object.keys(r.route.methods).join(", ").toUpperCase()} ${r.route.path}`);
  }
});

module.exports = router;
