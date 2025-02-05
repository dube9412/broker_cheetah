const express = require("express");
const router = express.Router();
const LoanProgram = require("../models/LoanProgram");
// const Tier = require("../models/Tier"); // Comment out the Tier model import
const Lender = require("../models/Lender");

// GET all loan programs for a lender
router.get("/:lenderId/loan-programs", async (req, res) => {
  try {
    const lender = await Lender.findById(req.params.lenderId);
    if (!lender) {
      return res.status(404).json({ message: "Lender not found" });
    }
    const loanPrograms = await LoanProgram.find({ lender: lender._id }); // No need to populate tiers
    res.json({ loanPrograms: loanPrograms ||[] });
  } catch (error) {
    console.error("Error fetching loan programs:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET a single loan program (for editing)
router.get("/:lenderId/loanPrograms/:programId", async (req, res) => {
  try {
    const programId = req.params.programId;
    const loanProgram = await LoanProgram.findById(programId); // No need to populate tiers
    if (!loanProgram) {
      return res.status(404).json({ message: "Loan program not found" });
    }
    res.status(200).json({ loanProgram });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST: Add a loan program (simplified)
router.post("/:lenderId/loan-programs", async (req, res) => {
  try {
    const { name, type } = req.body; // No tiers in the request body
    const lender = await Lender.findById(req.params.lenderId);
    if (!lender) {
      return res.status(404).json({ message: "Lender not found" });
    }

    const newLoanProgram = new LoanProgram({ lender: lender._id, name, type });
    await newLoanProgram.save();

    lender.loanPrograms.push(newLoanProgram._id);
    await lender.save();

    res.status(201).json({ loanProgram: newLoanProgram });
  } catch (error) {
    console.error("Error adding loan program:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// PUT: Update a loan program (simplified)
router.put("/:lenderId/loan-programs/:programId", async (req, res) => {
  try {
    const { name, type } = req.body; // No tiers in the request body
    const loanProgram = await LoanProgram.findById(req.params.programId);
    if (!loanProgram) {
      return res.status(404).json({ message: "Loan program not found" });
    }

    loanProgram.name = name;
    loanProgram.type = type;

    await loanProgram.save();

    res.status(200).json({ loanProgram });
  } catch (error) {
    console.error("Error updating loan program:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// DELETE: Remove a loan program (simplified)
router.delete("/:lenderId/loan-programs/:programId", async (req, res) => {
  try {
    //... (no changes in this route)
  } catch (error) {
    //... error handling
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
        res.render("fix-and-flip-form", { lenderId, program: null, tiers:[]});
        break;
      case "DSCR":
        res.render("dscr-form", { lenderId, program: null, tiers:[]}); // Assuming you have a dscr-form.ejs template
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