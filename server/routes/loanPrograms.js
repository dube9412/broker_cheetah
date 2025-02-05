const express = require("express");
const router = express.Router();
const LoanProgram = require("../models/LoanProgram");
// const Tier = require("../models/Tier"); // Comment out the Tier model import
const Lender = require("../models/Lender");
const FixAndFlipLoan = require('../models/FixAndFlipLoan'); // Adjust path as needed

// GET all loan programs for a lender
router.get('/loanPrograms', async (req, res) => {
    const lenderId = req.query.lenderId;
    const programType = req.query.programType; // Get the program type from the query

    try {
        let loanPrograms;
        if (programType === 'Fix and Flip') {
            loanPrograms = await FixAndFlipLoan.find({ lender: lenderId });
        } else {
            // Handle other program types similarly (e.g., DSCR, Ground Up, etc.)
            loanPrograms = await LoanProgram.find({ lender: lenderId }); // Default if type is not specified
        }
        res.json(loanPrograms);
    } catch (error) {
      console.error("Error fetching loan programs:", error);
      res.status(500).json({ 
          success: false, 
          message: "Failed to fetch loan programs", 
          error: error.message 
      });
  }
});

// GET a single loan program (for editing)
router.get('/loanPrograms/:programId', async (req, res) => {
    const programId = req.params.programId;
    const programType = req.query.programType;

    try {
        let loanProgram;
        if (programType === 'Fix and Flip') {
            loanProgram = await FixAndFlipLoan.findById(programId);
        } else {
            loanProgram = await LoanProgram.findById(programId);
        }

        if (!loanProgram) {
            return res.status(404).json({ error: 'Loan program not found' });
        }
        res.json(loanProgram);
    } catch (error) {
        //... error handling
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