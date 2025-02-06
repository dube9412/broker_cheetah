const express = require("express");
const router = express.Router();
const FixAndFlipLoan = require("../models/FixAndFlipLoan");
const Lender = require("../models/Lender");

// ✅ Debugging: Confirm this file is actually loaded
console.log("✅ Loan Program Routes File Loaded");

// ✅ GET all Fix and Flip programs for a lender
router.get("/:lenderId/fix-and-flip-programs", async (req, res) => {
    try {
        console.log(`🔹 Received GET request for lenderId: ${req.params.lenderId}`);
        const { lenderId } = req.params;

        const fixAndFlipPrograms = await FixAndFlipLoan.find({ lender: lenderId });

        console.log("✅ Found Fix and Flip programs:", fixAndFlipPrograms);
        res.json(fixAndFlipPrograms);
    } catch (error) {
        console.error("❌ Error fetching Fix and Flip programs:", error);
        res.status(500).json({ message: "Failed to fetch Fix and Flip programs" });
    }
});

router.get("/:programId", async (req, res) => {
  try {
      console.log(`🔹 Fetching loan program: ${req.params.programId}`);

      const program = await FixAndFlipLoan.findById(req.params.programId);
      if (!program) {
          console.error("❌ Loan program not found:", req.params.programId);
          return res.status(404).json({ message: "Loan program not found" });
      }

      console.log("✅ Found loan program:", program);
      res.json(program);
  } catch (error) {
      console.error("❌ Error fetching loan program:", error);
      res.status(500).json({ message: "Failed to fetch loan program" });
  }
});


router.put("/:programId", async (req, res) => {
  try {
      console.log(`🔹 Updating loan program: ${req.params.programId}`);

      const updatedProgram = await FixAndFlipLoan.findByIdAndUpdate(
          req.params.programId,
          { $set: req.body },  // Update only fields sent in request
          { new: true, runValidators: true }  // Return updated program & validate
      );

      if (!updatedProgram) {
          console.error("❌ Loan program not found:", req.params.programId);
          return res.status(404).json({ message: "Loan program not found" });
      }

      console.log("✅ Loan program updated:", updatedProgram);
      res.json({ success: true, program: updatedProgram });
  } catch (error) {
      console.error("❌ Error updating loan program:", error);
      res.status(500).json({ message: "Error updating loan program" });
  }
});

// ✅ POST: Add a Fix and Flip Loan Program
router.post("/:lenderId/fix-and-flip-programs", async (req, res) => {
  try {
      console.log("🔹 Received Fix & Flip Loan Program data:", req.body);

      const { lenderId } = req.params;
      const lender = await Lender.findById(lenderId);
      if (!lender) {
          return res.status(404).json({ error: "Lender not found" });
      }

      // ✅ Make sure all fields are saved
      const newProgram = new FixAndFlipLoan({
          name: req.body.name,
          lender: lenderId,
          type: "Fix and Flip",
          minFICO: req.body.minFICO,
          minExperience: req.body.minExperience,
          maxLTP: req.body.maxLTP,
          totalLTC: req.body.totalLTC,
          maxARV: req.body.maxARV,
          minLoanAmount: req.body.minLoanAmount,
          maxLoanAmount: req.body.maxLoanAmount,
          tiers: req.body.tiers || [],
      });

      await newProgram.save();

      // ✅ Add reference to lender
      lender.fixAndFlipPrograms.push(newProgram._id);
      await lender.save();

      console.log("✅ Fix & Flip Loan Program Saved:", newProgram);
      res.status(201).json({ success: true, program: newProgram });

  } catch (error) {
      console.error("❌ Error saving Fix & Flip Loan Program:", error);
      res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:programId", async (req, res) => {
  try {
      console.log(`🔹 Deleting loan program: ${req.params.programId}`);

      // ✅ Find and delete the Fix & Flip Loan Program
      const deletedProgram = await FixAndFlipLoan.findByIdAndDelete(req.params.programId);
      if (!deletedProgram) {
          console.error("❌ Loan program not found:", req.params.programId);
          return res.status(404).json({ message: "Loan program not found" });
      }

      // ✅ Remove reference from lender
      await Lender.updateOne(
          { fixAndFlipPrograms: req.params.programId },
          { $pull: { fixAndFlipPrograms: req.params.programId } }
      );

      console.log("✅ Loan program deleted:", deletedProgram);
      res.json({ success: true, message: "Loan program deleted." });
  } catch (error) {
      console.error("❌ Error deleting loan program:", error);
      res.status(500).json({ message: "Error deleting loan program" });
  }
});



// ✅ Debugging: List Registered Routes
console.log("✅ Registered Routes in loanPrograms.js:");
router.stack.forEach((r) => {
    console.log(`✅ ${Object.keys(r.route.methods).join(", ").toUpperCase()} ${r.route.path}`);
});

module.exports = router;
