const express = require("express");
const router = express.Router();
const LoanProgram = require("../models/LoanProgram");
const Tier = require("../models/Tier");
const Lender = require("../models/Lender");

// GET all loan programs for a lender
router.get("/:lenderId/loan-programs", async (req, res) => {
  try {
    const lender = await Lender.findById(req.params.lenderId).populate("loanPrograms");
    if (!lender) {
      return res.status(404).json({ message: "Lender not found" });
    }

    // Populate the 'tiers' field when fetching loan programs
    const loanPrograms = await LoanProgram.find({ lender: lender._id }).populate("tiers");

    res.json({ loanPrograms: loanPrograms || });
  } catch (error) {
    console.error("Error fetching loan programs:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET a single loan program (for editing)
router.get("/:lenderId/loanPrograms/:programId", async (req, res) => {
  try {
    const programId = req.params.programId;
    const loanProgram = await LoanProgram.findById(programId).populate("tiers");
    if (!loanProgram) {
      return res.status(404).json({ message: "Loan program not found" });
    }
    res.status(200).json({ loanProgram });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST: Add a loan program
router.post("/:lenderId/loan-programs", async (req, res) => {
  try {
    const { name, tiers } = req.body;
    const lender = await Lender.findById(req.params.lenderId);

    if (!lender) {
      return res.status(404).json({ message: "Lender not found" });
    }

    const newLoanProgram = new LoanProgram({ lenderId: lender._id, name, tiers });
    await newLoanProgram.save();

    // Create tiers and associate them with the loan program
    const createdTiers = await Promise.all(
      tiers.map((tierData) =>
        new Tier({
        ...tierData,
          lender: lender._id,
          loanProgramId: newLoanProgram._id,
        }).save(),
      ),
    );
    newLoanProgram.tiers = createdTiers.map((tier) => tier._id);

    await newLoanProgram.save();

    lender.loanPrograms.push(newLoanProgram._id);
    await lender.save();

    res.status(201).json({ loanProgram: newLoanProgram });
  } catch (error) {
    console.error("Error adding loan program:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// PUT: Update a loan program
router.put("/:lenderId/loan-programs/:programId", async (req, res) => {
  try {
    const { name, tiers } = req.body;
    const loanProgram = await LoanProgram.findById(req.params.programId);

    if (!loanProgram) {
      return res.status(404).json({ message: "Loan program not found" });
    }

    loanProgram.name = name;

    // Update tiers
    const updatedTiers = await Promise.all(
      tiers.map((tierData) => {
        if (tierData._id) {
          return Tier.findByIdAndUpdate(tierData._id, tierData, { new: true, runValidators: true });
        } else {
          return new Tier({...tierData, lender: req.params.lenderId, loanProgramId: loanProgram._id }).save();
        }
      }),
    );
    loanProgram.tiers = updatedTiers.map((tier) => tier._id);

    await loanProgram.save();

    res.status(200).json({ loanProgram });
  } catch (error) {
    console.error("Error updating loan program:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// DELETE: Remove a loan program
router.delete("/:lenderId/loan-programs/:programId", async (req, res) => {
  try {
    const lender = await Lender.findById(req.params.lenderId);
    if (!lender) {
      return res.status(404).json({ message: "Lender not found" });
    }

    const loanProgram = await LoanProgram.findByIdAndDelete(req.params.programId);
    if (!loanProgram) {
      return res.status(404).json({ message: "Loan program not found" });
    }

    // Remove the loan program from the lender's loanPrograms array
    lender.loanPrograms = lender.loanPrograms.filter((id) => id.toString()!== req.params.programId);
    await lender.save();

    // Delete the associated tiers
    await Tier.deleteMany({ loanProgramId: req.params.programId });

    res.json({ success: true, message: "Loan program deleted" });
  } catch (error) {
    console.error("Error deleting loan program:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route for rendering the new loan program form with the selected type
router.get("/:lenderId/loanPrograms/new", async (req, res) => {
  try {
    const lenderId = req.params.lenderId;
    const programType = req.query.type; // Get the selected program type from the query parameter

    // Render the appropriate template based on the program type
    switch (programType) {
      case "Fix and Flip":
        res.render("fix-and-flip-form", { lenderId, program: null, tiers: });
        break;
      case "DSCR":
        res.render("dscr-form", { lenderId, program: null, tiers: }); // Assuming you have a dscr-form.ejs template
        break;
      //... cases for other loan program types
      default:
        // Handle cases where no or invalid type is selected
        res.redirect(`/lenders/${lenderId}/loanPrograms`); // Or render an error page
    }
  } catch (error) {
    //... error handling
  }
});

module.exports = router;