const express = require("express");
const router = express.Router();
const DSCRLoan = require("../models/DSCRLoan");
const Lender = require("../models/Lender");

// ✅ Debugging: Confirm this file is loaded
console.log("✅ DSCR Routes File Loaded");

// ✅ GET all DSCR loan programs for a lender
router.get("/:lenderId/dscr-programs", async (req, res) => {
  try {
    console.log(`🔹 Fetching DSCR programs for lenderId: ${req.params.lenderId}`);
    const dscrPrograms = await DSCRLoan.find({ lender: req.params.lenderId });

    if (dscrPrograms.length === 0) {
      console.warn("⚠️ No DSCR programs found.");
      return res.status(404).json({ message: "No DSCR programs found." });
    }

    console.log("✅ Found DSCR programs:", dscrPrograms);
    res.json(dscrPrograms);
  } catch (error) {
    console.error("❌ Error fetching DSCR programs:", error);
    res.status(500).json({ message: "Failed to fetch DSCR programs." });
  }
});

// ✅ GET a specific DSCR loan program by ID
router.get("/dscr-programs/:programId", async (req, res) => {
  try {
    console.log(`🔹 Fetching DSCR loan program: ${req.params.programId}`);
    const program = await DSCRLoan.findById(req.params.programId);

    if (!program) {
      console.error("❌ DSCR Loan Program not found:", req.params.programId);
      return res.status(404).json({ message: "Loan program not found" });
    }

    console.log("✅ Found DSCR loan program:", program);
    res.json(program);
  } catch (error) {
    console.error("❌ Error fetching DSCR loan program:", error);
    res.status(500).json({ message: "Failed to fetch loan program" });
  }
});

// ✅ POST: Add a new DSCR Loan Program
router.post("/:lenderId/dscr-programs", async (req, res) => {
  try {
    console.log("🔹 Received DSCR Loan Program data:", req.body);
    const { lenderId } = req.params;

    // Ensure the lender exists
    const lender = await Lender.findById(lenderId);
    if (!lender) {
      console.error("❌ Lender not found:", lenderId);
      return res.status(404).json({ message: "Lender not found" });
    }

    // Convert loanRange to numbers if necessary
    const { min, max } = req.body.loanRange || {};
    const loanRange = {};
    if (!isNaN(min)) loanRange.min = parseInt(min);
    if (!isNaN(max)) loanRange.max = parseInt(max);
    
    if (loanRange.min !== undefined && loanRange.max !== undefined && loanRange.min >= loanRange.max) {
      return res.status(400).json({ message: "Minimum loan range must be less than the maximum." });
    }
    
    const propertyUse = Array.isArray(req.body.propertyUse) ? req.body.propertyUse[0] : req.body.propertyUse || undefined;


    // Create a new DSCR loan program
    const newProgram = new DSCRLoan({
      name: req.body.name,
      lender: lenderId,
      type: "DSCR",
      loanRange,
      propertyTypes: req.body.propertyTypes || [],
      propertyUse,
      prepaymentPeriod: req.body.prepaymentPeriod,
      tiers: req.body.tiers || [],
    });

    // Save the new program
    await newProgram.save();

    // Add reference to the lender's DSCR programs
if (!lender.dscrPrograms) {
  lender.dscrPrograms = [];  // ✅ Initialize if undefined
}
lender.dscrPrograms.push(newProgram._id);
await lender.save();

    console.log("✅ DSCR Loan Program Saved:", newProgram);
    res.status(201).json({ success: true, program: newProgram });

  } catch (error) {
    console.error("❌ Server error while saving DSCR Loan Program:", error);
    res.status(500).json({ message: "Server error while saving loan program" });
  }
});


// ✅ PUT: Update a DSCR Loan Program
router.put("/dscr-programs/:programId", async (req, res) => {
  try {
    console.log(`🔹 Updating DSCR loan program: ${req.params.programId}`);

    const updatedProgram = await DSCRLoan.findByIdAndUpdate(
      req.params.programId,
      { $set: req.body }, // Update only fields sent in the request
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedProgram) {
      console.error("❌ DSCR Loan Program not found:", req.params.programId);
      return res.status(404).json({ message: "Loan program not found" });
    }

    console.log("✅ DSCR Loan Program updated:", updatedProgram);
    res.json({ success: true, program: updatedProgram });
  } catch (error) {
    console.error("❌ Error updating DSCR Loan Program:", error);
    res.status(500).json({ message: "Failed to update loan program" });
  }
});

// ✅ DELETE: Remove a DSCR Loan Program
router.delete("/:programId", async (req, res) => {
  try {
    const deletedProgram = await DSCRLoan.findByIdAndDelete(req.params.programId);
    if (!deletedProgram) {
      return res.status(404).json({ message: "Loan program not found" });
    }

    await Lender.updateOne(
      { dscrPrograms: req.params.programId },
      { $pull: { dscrPrograms: req.params.programId } }
    );

    res.status(200).json({ success: true, message: "Loan program deleted." });  // ✅ Always return a JSON response
  } catch (error) {
    console.error("❌ Error deleting DSCR Loan Program:", error);
    res.status(500).json({ message: "Failed to delete loan program" });
  }
});


// ✅ Debugging: List Registered Routes
console.log("✅ Registered Routes in DSCR Routes:");
router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`✅ ${Object.keys(r.route.methods).join(", ").toUpperCase()} ${r.route.path}`);
  }
});

module.exports = router;
