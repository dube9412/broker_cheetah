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
      interestType: req.body.interestType || "",
      drawType: req.body.drawType || "",
      crossCollateralAllowed: req.body.crossCollateralAllowed || "",
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

    

  
// ✅ Debugging: List Registered Routes
console.log("✅ Registered Routes in Fix and Flip Routes:");
router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`✅ ${Object.keys(r.route.methods).join(", ").toUpperCase()} ${r.route.path}`);
  }
});

module.exports = router;
