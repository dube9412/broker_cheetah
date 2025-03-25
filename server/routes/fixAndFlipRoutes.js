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
      interestType: req.body.interestType || { dutch: false, nonDutch: false },      crossCollateralAllowed: req.body.crossCollateralAllowed || "",
      propertyTypes: Array.isArray(req.body.propertyTypes) ? req.body.propertyTypes : [],

      // ✅ Tiers array
      tiers: Array.isArray(req.body.tiers) ? req.body.tiers : [],
    });

    await newProgram.save();
    res.status(201).json({ success: true, program: newProgram });
  } catch (error) {
    console.error("❌ Error creating Fix & Flip program:", error);
    res.status(500).json({ success: false, message: "Server error during Fix & Flip program creation." });
  }
});

// ✅ PUT: Update a Fix and Flip Loan Program
router.put("/fix-and-flip-programs/:programId", async (req, res) => {
  try {
    console.log(`🔹 Updating Fix and Flip loan program: ${req.params.programId}`);

    const updatedProgram = await FixAndFlipLoan.findByIdAndUpdate(
      req.params.programId,
      { $set: req.body }, // Update only fields sent in the request
      { new: true, runValidators: true } // Return the updated document
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
    } = req.query;

    const filters = {};

    // ✅ Base-level filters
    if (crossCollateralAllowed) filters.crossCollateralAllowed = crossCollateralAllowed;

    // ✅ Recourse filtering (OR logic)
    if (recourse === "true" || nonRecourse === "true") {
      filters.$or = [];
      if (recourse === "true") filters.$or.push({ "recourse.recourse": true });
      if (nonRecourse === "true") filters.$or.push({ "recourse.nonRecourse": true });
    }

   if (interestTypeDutch === "true" || interestTypeNonDutch === "true") {
      filters.$or = [];
      if (interestTypeDutch === "true") filters.$or.push({ "interestType.dutch": true });
      if (interestTypeNonDutch === "true") filters.$or.push({ "interestType.nonDutch": true });
    }

    // ✅ Fetch all programs that meet base-level filters
    const programs = await FixAndFlipLoan.find(filters).populate("lender");

    const matchingPrograms = [];

    for (const program of programs) {
      // ✅ Check state compatibility
      if (state && !program.lender.states.includes(state)) continue;

      // ✅ Tier matching
      const matchingTier = program.tiers.find((tier) => {
        if (fico && tier.minFICO && Number(fico) < tier.minFICO) return false;
        if (experience && tier.minExperience && Number(experience) < tier.minExperience) return false;

        const pp = Number(purchasePrice) || 0;
        const rehab = Number(rehabNeeded) || 0;
        const asIs = Number(asisValue) || 0;
        const afterRepairValue = Number(arv) || 0;

        // ✅ Max Purchase Price Check (LTC limit)
        if (tier.maxLTC && asIs && pp > (asIs * tier.maxLTC) / 100) return false;

        // ✅ Max Total LTC Check
        if (tier.totalLTC && (pp + rehab) > (afterRepairValue * tier.totalLTC) / 100) return false;

        // ✅ Max ARV Check
        if (tier.maxARV && afterRepairValue > 0 && (pp + rehab) > (afterRepairValue * tier.maxARV) / 100) return false;

        // ✅ Rehab Percent (optional safety check)
        if (tier.rehabPercent && rehab > 0 && pp > 0) {
          const rehabPercent = (rehab / pp) * 100;
          if (rehabPercent > tier.rehabPercent) return false;
        }

        return true; // ✅ Found a tier that works
      });

      if (matchingTier) {
        matchingPrograms.push({
          name: program.lender.name,
          contact: program.lender.contactName,
          phone: program.lender.phone,
          email: program.lender.email,
          programId: program._id,
          lenderId: program.lender._id,
          tier: matchingTier.tierName || "Unnamed Tier",
        });
      }
    }

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
