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

// ✅ DELETE: Remove a Stabilized Bridge Loan Program
router.delete("/stabilized-bridge-programs/:programId", async (req, res) => {
  try {
    const deletedProgram = await StabilizedBridgeLoan.findByIdAndDelete(req.params.programId);
    if (!deletedProgram) {
      return res.status(404).json({ message: "Program not found" });
    }
    res.json({ success: true, message: "Program deleted." });
  } catch (error) {
    console.error("❌ Error deleting Ground Up program:", error);
    res.status(500).json({ message: "Failed to delete program." });
  }
});

module.exports = router;
// Repeat the same pattern as above for Stabilized Bridge Loans

module.exports = router;
