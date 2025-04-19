const express = require("express");
const router = express.Router();
const FixAndFlipLoan = require("../models/FixAndFlipLoan");
const Lender = require("../models/Lender");
const verifyToken = require("../middleware/verifyToken");
const Pipeline = require("../models/Pipeline");
const sendEmail = require("../utils/email");
const Quote = require("../models/Quote");

// ✅ Debugging: Confirm this file is loaded
console.log("✅ Fix and Flip Routes File Loaded");

// ✅ GET all Fix and Flip programs for a lender
router.get("/:lenderId/fix-and-flip-programs", async (req, res) => {
  try {
    console.log(`🔹 Fetching Fix and Flip programs for lenderId: ${req.params.lenderId}`);
    const fixAndFlipPrograms = await FixAndFlipLoan.find({ lender: req.params.lenderId, type: "Fix and Flip" });

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
      setting: req.body.setting || "Non-Rural", // Ensure setting is saved
    
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
      setting: req.body.setting || "Non-Rural", // Ensure setting is updated

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
      propertyType,
      setting,
      termLengthMonths,
      sortBy, // New sorting option
    } = req.query;

    const filters = {};

    console.log("🔍 Received Query Parameters:", req.query);

    if (recourse && recourse !== 'undefined' && recourse.length > 0) {
      console.log("🔍 Filtering by Recourse:", recourse);
      const recourseFilters = [];
      if (recourse.includes("recourse")) {
        recourseFilters.push({ "recourse.recourse": true });
      }
      if (recourse.includes("nonRecourse")) {
        recourseFilters.push({ "recourse.nonRecourse": true });
      }
      if (recourseFilters.length > 0) {
        filters.$or = filters.$or ? [...filters.$or, ...recourseFilters] : recourseFilters;
      }
    } else {
      console.log("🔍 No Recourse filter applied. Skipping recourse filter.");
    }

    if (interestType && interestType.length > 0) {
      console.log("🔍 Filtering by Interest Type:", interestType);
      const interestFilters = [];
      if (interestType.includes("dutch")) {
        interestFilters.push({ "interestType.dutch": true });
      }
      if (interestType.includes("nonDutch")) {
        interestFilters.push({ "interestType.nonDutch": true });
      }
      if (interestFilters.length > 0) {
        filters.$or = filters.$or ? [...filters.$or, ...interestFilters] : interestFilters;
      }
    }

    if (drawType && drawType.length > 0) {
      console.log("🔍 Filtering by Draw Type:", drawType);
      const drawFilters = [];
      if (drawType.includes("self")) {
        drawFilters.push({ "drawType.self": true });
      }
      if (drawType.includes("thirdParty")) {
        drawFilters.push({ "drawType.thirdParty": true });
      }
      if (drawFilters.length > 0) {
        filters.$or = filters.$or ? [...filters.$or, ...drawFilters] : drawFilters;
      }
    }

    if (crossCollateralAllowed) {
      console.log("🔍 Filtering by Cross Collateral Allowed:", crossCollateralAllowed);
      if (crossCollateralAllowed.includes("yes") && crossCollateralAllowed.includes("no")) {
        filters.$or = [
          { crossCollateralAllowed: true },
          { crossCollateralAllowed: false },
        ];
      } else if (crossCollateralAllowed.includes("yes")) {
        filters.crossCollateralAllowed = true;
      } else if (crossCollateralAllowed.includes("no")) {
        filters.crossCollateralAllowed = false;
      }
    }

    if (setting && setting.includes("Rural") && setting.includes("Non-Rural")) {
      filters.$or = [
        { setting: "Rural" },
        { setting: "Non-Rural" },
      ];
    } else if (setting && setting.includes("Rural")) {
      filters.setting = "Rural";
    } else if (setting && setting.includes("Non-Rural")) {
      filters.setting = "Non-Rural";
    }

    if (termLengthMonths) {
      console.log("🔍 Filtering by Term Length Months (raw):", termLengthMonths);
      const termLengths = Array.isArray(termLengthMonths)
        ? termLengthMonths
        : termLengthMonths.split(",").map(Number);
      console.log("🔍 Parsed Term Length Months:", termLengths);
      filters.termLengthMonths = { $in: termLengths };
    }

    if (propertyType) {
      console.log("🔍 Filtering by Property Type:", propertyType);
      const validPropertyTypes = ["Single Family 1-4", "Condo", "Townhome", "Manufactured", "Cabins"];
      const requestedTypes = propertyType.split(",");
      filters.propertyTypes = { $in: requestedTypes.filter((type) => validPropertyTypes.includes(type)) };
    }

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
        const interestOption = interestType === "dutch" ? program.interestType.dutch : interestType === "nonDutch" ? program.interestType.nonDutch : null;
        if (!interestOption) continue;
      }

      if (drawType) {
        const drawOption = drawType === "self" ? program.drawType.self : drawType === "thirdParty" ? program.drawType.thirdParty : null;
        if (!drawOption) continue;
      }

      if (crossCollateralAllowed && program.crossCollateralAllowed !== (crossCollateralAllowed === "yes")) {
        continue;
      }

      // Exclude lenders if purchase price is below their minimum loan amount
      if (purchasePrice < program.lender.minLoanAmount) {
        console.log("❌ Excluding lender due to purchase price below minimum loan amount.");
        continue;
      }

      // Exclude lenders if as-is value is below their minimum as-is value
      if (asisValue < program.lender.minAsIsValue) {
        console.log("❌ Excluding lender due to as-is value below minimum as-is value.");
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
          `The total loan amount is limited by ${limitingFactor}. The lender WILL reduce the purchase amount or rehab amount by $${reductionAmount.toLocaleString()}.`
        );
      }

      // ✅ Add warning if as-is value constrains the purchase loan amount
      if (constrainedPurchaseLoanAmount < maxPurchaseLoanAmount) {
        const difference = maxPurchaseLoanAmount - constrainedPurchaseLoanAmount;
        const originalDownPayment = pp - (pp * (matchingTier.maxLTC / 100));
        const totalBorrowerCoverage = difference + originalDownPayment;
        warnings.push(
          `When the as-is value is lower than the purchase price, the lender will base the purchase price percentage off this value. The borrower will need to cover the difference of $${difference.toLocaleString()} plus the original expected down payment of $${originalDownPayment.toLocaleString()}, totaling $${totalBorrowerCoverage.toLocaleString()}.`
        );
      }

      console.log("🔍 Filtering lender:", {
        lenderName: program.lender.name,
        asisValue,
        minAsIsValue: program.lender.minAsIsValue,
        finalConstrainedLoanAmount,
        minLoanAmount: program.lender.minLoanAmount,
      });

      console.log("🔍 Payload for filtering:", {
        asisValue,
        minAsIsValue: program.lender.minAsIsValue,
        constrainedLoanAmount: finalConstrainedLoanAmount,
        minLoanAmount: program.lender.minLoanAmount,
      });

      if (asisValue < program.minAsIsValue) {
        console.log("❌ Excluding lender due to as-is value below minimum.");
        continue;
      }

      if (matchingTier.loanRange && matchingTier.loanRange.min && finalConstrainedLoanAmount < matchingTier.loanRange.min) {
        console.log("❌ Excluding lender due to loan amount below minimum tier range.");
        continue;
      }

      if (matchingTier.loanRange && matchingTier.loanRange.max && finalConstrainedLoanAmount > matchingTier.loanRange.max) {
        console.log("❌ Excluding lender due to loan amount above maximum tier range.");
        continue;
      }

      if (asisValue < program.lender.minAsIsValue) {
        console.log("❌ Excluding lender due to as-is value below minimum as-is value.");
        continue;
      }

      if (finalConstrainedLoanAmount < program.lender.minLoanAmount) {
        console.log("❌ Excluding lender due to constrained loan amount below minimum loan amount.");
        continue;
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

    if (sortBy === "ltc") {
      matchingPrograms.sort((a, b) => b.maxLTC - a.maxLTC);
    } else if (sortBy === "loanAmount") {
      matchingPrograms.sort((a, b) => b.calculations.totalLoanAmount - a.calculations.totalLoanAmount);
    }

    res.json(matchingPrograms);
  } catch (error) {
    console.error("❌ Error in Fix and Flip Search:", error);
    res.status(500).json({ message: "Search failed" });
  }
});

// Fix and Flip Quotes
// Add detailed debug logs to the /fix-and-flip route
router.post("/fix-and-flip", verifyToken, async (req, res) => {
  try {
    console.log("🔍 Incoming Request Body:", req.body);
    console.log("🔍 User ID from Token:", req.user?._id);
    console.log("🔍 Lender IDs:", req.body.lenderIds);
    console.log("🔍 Loan Type:", req.body.loanType);

    const {
      lenderIds,
      propertyAddress,
      ficoScore,
      experience,
      purchasePrice,
      rehabNeeded,
      arv,
      liquidity,
    } = req.body;

    if (!lenderIds || lenderIds.length === 0 || !propertyAddress || !ficoScore || !experience || !purchasePrice || !rehabNeeded || !arv || !liquidity) {
      console.error("❌ Missing required fields:", req.body);
      return res.status(400).json({ success: false, message: "Required fields are missing." });
    }

    const user = await User.findById(req.user._id);
    if (!user || !user.email) {
      console.error("❌ User not found or email missing:", req.user._id);
      return res.status(400).json({ success: false, message: "User email not found." });
    }

    const quotes = [];

    for (const lenderId of lenderIds) {
      const lender = await Lender.findById(lenderId);
      if (!lender) {
        console.error("❌ Lender not found:", lenderId);
        return res.status(404).json({ success: false, message: `Lender with ID ${lenderId} not found.` });
      }

      const newQuote = new Quote({
        userId: req.user._id,
        lenderId,
        loanType: "fixAndFlip",
        propertyAddress,
        ficoScore,
        experience,
        purchasePrice,
        rehabNeeded,
        arv,
        liquidity,
      });
      console.log("📝 Saving new quote:", newQuote);
      await newQuote.save();
      quotes.push(newQuote);
    }

    console.log("✅ Quotes submitted successfully:", quotes);
    res.status(201).json({ success: true, message: "Quotes submitted successfully.", quotes });
  } catch (error) {
    console.error("❌ Error submitting Fix and Flip quotes:", error);
    res.status(500).json({ success: false, message: "Server error while submitting quotes." });
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