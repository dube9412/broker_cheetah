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
    console.log("🔹 Received Ground Up Loan Program data:", req.body);
    const { lenderId } = req.params;

    const lender = await Lender.findById(lenderId);
    if (!lender) {
        console.error("❌ Lender not found:", lenderId);
        return res.status(404).json({ message: "Lender not found" });
        }

    const newProgram = new GroundUpLoan({
        name: req.body.name,
        lender: lenderId,
        type: "Ground Up",
        minFICO: req.body.minFICO,
        minExperience: req.body.minExperience,
        maxLTV: req.body.maxLTV,
        maxLTC: req.body.maxLTC,
        minLoanAmount: req.body.minLoanAmount,
        maxLoanAmount: req.body.maxLoanAmount,
        constructionBudget: req.body.constructionBudget,
        StylePropertyMap: Array.isArray(req.body.StylePropertyMap) ? req.body.StylePropertyMap : [],
propertyTypes: Array.isArray(req.body.propertyTypes) ? req.body.propertyTypes : [],
        tiers: req.body.tiers || [],
    });

    await newProgram.save();

    console.log("✅ Saved new Ground Up program:", newProgram);
    res.status(201).json({ success: true, program: newProgram });
  } catch (error) {
    console.error("❌ Error saving Ground Up program:", error);
    res.status(500).json({ message: "Failed to save program." });
  }
});

// ✅ PUT: Update a Ground Up Loan Program
router.put("/ground-up-programs/:programId", async (req, res) => {
  try {
    console.log(`🔹 Updating Ground Up Loan Program: ${req.params.programId}`);

    const updatedProgram = await GroundUpLoan.findByIdAndUpdate(
        req.params.programId, 
        { $set: req.body }, 
        { new: true, runValidators: true }
    );

    if (!updatedProgram) {
        console.error("❌ Ground Up Loan Program not found:", req.params.programId);
      return res.status(404).json({ message: "Program not found" });
    }

    console.log("✅ Updated Ground Up program:", updatedProgram);
    res.json({ success: true, program: updatedProgram });
  } catch (error) {
    console.error("❌ Error updating Ground Up program:", error);
    res.status(500).json({ message: "Failed to update program." });
  }
});

// ✅ DELETE: Remove a Ground Up Loan Program
router.delete("/ground-up-programs/:programId", async (req, res) => {
  try {
    console.log(`🔹 Deleting Ground Up Loan Program: ${req.params.programId}`) ;

    const deletedProgram = await GroundUpLoan.findByIdAndDelete(req.params.programId);
    if (!deletedProgram) {
      
    console.error("❌ Error deleting Ground Up program:", error);
    res.status(500).json({ message: "Failed to delete program." });
  }

  await Lender.updateOne(
    { groundUpPrograms: req.params.programId },
    { $pull: { groundUpPrograms: req.params.programId } }
  );

  console.log("✅ Ground Up Loan Program deleted:", deletedProgram);
  res.json({ success: true, message: "Loan program deleted." });
  } catch (error) {
    console.error("❌ Error deleting Ground Up program:", error);
    res.status(500).json({ message: "Failed to delete program." });
  }
}); 


module.exports = router;
