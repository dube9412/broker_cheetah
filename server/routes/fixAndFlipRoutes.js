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
      tiers: Array.isArray(req.body.tiers) ? req.body.tiers : [], // Removed extra comma here
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
      interestType,
      drawType,
      crossCollateralAllowed,
    } = req.query;

    const filters = {};
    const programs = await FixAndFlipLoan.find(filters).populate("lender");

    const matchingPrograms = [];

    for (const program of programs) {
      if (state && !program.lender.states.includes(state)) continue;

      const pp = Number(purchasePrice) || 0;
      const rehab = Number(rehabNeeded) || 0;
      const arvNum = Number(arv) || 0;
      const asIs = Number(asisValue) || pp; // Default to purchase price if as-is value is not provided
      const borrowerExperience = Number(experience) || 0;

      const totalCost = pp + rehab;

      // ✅ Filter by Loan Options
      if (recourse) {
        const recourseOption = recourse === "recourse" ? program.recourse.recourse : program.recourse.nonRecourse;
        if (!recourseOption) continue;
      }

      if (interestType) {
        const interestOption = interestType === "dutch" ? program.interestType.dutch : program.interestType.nonDutch;
        if (!interestOption) continue;
      }

      if (drawType) {
        const drawOption = drawType === "self" ? program.drawType.self : program.drawType.thirdParty;
        if (!drawOption) continue;
      }

      if (crossCollateralAllowed && program.crossCollateralAllowed !== (crossCollateralAllowed === "yes")) {
        continue;
      }

      // ✅ Find the best matching tier based on experience and other criteria
      const matchingTier = program.tiers
        .filter((tier) => {
          if (fico && tier.minFICO && Number(fico) < tier.minFICO) return false;
          if (tier.minExperience && borrowerExperience < tier.minExperience) return false;
          return true;
        })
        .sort((a, b) => b.minExperience - a.minExperience)[0]; // Sort by experience descending and pick the best match

      if (!matchingTier) continue; // Skip if no matching tier is found

      // ✅ Constrain Purchase Loan Amount by As-Is Value
      const maxPurchaseLoanAmount = pp * (matchingTier.maxLTC / 100);
      const constrainedPurchaseLoanAmount = Math.min(maxPurchaseLoanAmount, asIs * (matchingTier.maxLTC / 100));

      // ✅ Calculate Rehab Loan Amount and Total Loan Amount
      const rehabLoanAmount = rehab * (matchingTier.rehabPercent / 100);
      const totalLoanAmount = constrainedPurchaseLoanAmount + rehabLoanAmount;

      const tltcLimit = matchingTier.totalLTC ? totalCost * (matchingTier.totalLTC / 100) : Infinity;
      const arvLimit = arvNum * (matchingTier.maxARV / 100);

      const finalConstrainedLoanAmount = Math.min(totalLoanAmount, tltcLimit, arvLimit);

      const warnings = [];
      // ✅ Add warning for ARV/TLTC constraint
      if (finalConstrainedLoanAmount < totalLoanAmount) {
        const reductionAmount = totalLoanAmount - finalConstrainedLoanAmount;
        const limitingFactor = finalConstrainedLoanAmount === tltcLimit ? "TLTC" : "ARV";
        warnings.push(
          `The total loan amount is limited by ${limitingFactor} (whichever is lower). The lender may apply a reduction of $${reductionAmount.toLocaleString()} to the purchase amount or rehab amount.`
        );
      }

      // ✅ Add warning if as-is value constrains the purchase loan amount
      if (constrainedPurchaseLoanAmount < maxPurchaseLoanAmount) {
        warnings.push(
          "When the as-is value is lower than the purchase price, the lender will base the purchase price percentage off this value."
        );
      }

      program.calculations = {
        purchaseLoanAmount: constrainedPurchaseLoanAmount, // Constrained purchase loan amount
        rehabLoanAmount, // Unconstrained rehab loan amount
        totalLoanAmount: finalConstrainedLoanAmount, // Final constrained total loan amount
        tltcLimit,
        arvLimit,
      };

      program.warnings = warnings;

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
        calculations: program.calculations,
        warnings: program.warnings,
        lenderId: program.lender._id,
        programId: program._id,
      });
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
