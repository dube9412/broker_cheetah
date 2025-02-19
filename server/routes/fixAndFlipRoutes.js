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
    console.log("🔹 Received Fix and Flip Loan Program data:", req.body);
    const { lenderId } = req.params;

    const lender = await Lender.findById(lenderId);
    if (!lender) {
      console.error("❌ Lender not found:", lenderId);
      return res.status(404).json({ message: "Lender not found" });
    }

    const newProgram = new FixAndFlipLoan({
      name: req.body.name,
      lender: lenderId,
      type: "Fix and Flip",
      minFICO: req.body.minFICO,
      minExperience: req.body.minExperience,
      maxLTP: req.body.maxLTP,
      totalLTC: req.body.totalLTC,
      maxARV: req.body.maxARV,
      tiers: req.body.tiers || [],
    });

    await newProgram.save();

    // ✅ Add reference to the lender
    lender.fixAndFlipPrograms.push(newProgram._id);
    await lender.save();

    console.log("✅ Fix and Flip Loan Program Saved:", newProgram);
    res.status(201).json({ success: true, program: newProgram });
  } catch (error) {
    console.error("❌ Error saving Fix and Flip Loan Program:", error);
    res.status(500).json({ message: "Server error while saving loan program" });
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
