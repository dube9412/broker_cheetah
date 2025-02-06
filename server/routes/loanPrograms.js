const express = require("express");
const router = express.Router();
const FixAndFlipLoan = require("../models/FixAndFlipLoan");
const Lender = require("../models/Lender");

// GET all Fix and Flip loan programs for a lender
router.get("/lenders/:lenderId/fix-and-flip-programs", async (req, res) => {
    try {
        const lenderId = req.params.lenderId;
        const fixAndFlipPrograms = await FixAndFlipLoan.find({ lender: lenderId });
        res.json(fixAndFlipPrograms);
    } catch (error) {
        console.error("Error fetching Fix and Flip programs:", error);
        res.status(500).json({ message: "Failed to fetch Fix and Flip programs" });
    }
});

// GET a single Fix and Flip loan program by ID
router.get("/loan-programs/:programId", async (req, res) => {
    try {
        const programId = req.params.programId;
        const fixAndFlipProgram = await FixAndFlipLoan.findById(programId);
        if (!fixAndFlipProgram) {
            return res.status(404).json({ message: "Fix and Flip program not found" });
        }
        res.json(fixAndFlipProgram);
    } catch (error) {
        console.error("Error fetching Fix and Flip program:", error);
        res.status(500).json({ message: "Failed to fetch Fix and Flip program" });
    }
});

// POST: Add a new Fix and Flip loan program
router.post("/loan-programs", async (req, res) => {
    try {
        const { name, lender, tiers } = req.body;

        // Create a new Fix and Flip loan program
        const newProgram = new FixAndFlipLoan({
            name,
            lender,
            tiers,
        });

        // Save the program to the database
        await newProgram.save();

        // Add the program to the lender's loanPrograms array
        await Lender.findByIdAndUpdate(lender, { $push: { loanPrograms: newProgram._id } });

        res.status(201).json({ message: "Fix and Flip program added successfully", program: newProgram });
    } catch (error) {
        console.error("Error adding Fix and Flip program:", error);
        res.status(500).json({ message: "Failed to add Fix and Flip program" });
    }
});

// PUT: Update an existing Fix and Flip loan program
router.put("/loan-programs/:programId", async (req, res) => {
    try {
        const programId = req.params.programId;
        const { name, tiers } = req.body;

        // Update the Fix and Flip loan program
        const updatedProgram = await FixAndFlipLoan.findByIdAndUpdate(
            programId,
            { name, tiers },
            { new: true } // Return the updated document
        );

        if (!updatedProgram) {
            return res.status(404).json({ message: "Fix and Flip program not found" });
        }

        res.json({ message: "Fix and Flip program updated successfully", program: updatedProgram });
    } catch (error) {
        console.error("Error updating Fix and Flip program:", error);
        res.status(500).json({ message: "Failed to update Fix and Flip program" });
    }
});

// DELETE: Delete a Fix and Flip loan program
router.delete("/loan-programs/:programId", async (req, res) => {
    try {
        const programId = req.params.programId;

        // Delete the Fix and Flip loan program
        const deletedProgram = await FixAndFlipLoan.findByIdAndDelete(programId);

        if (!deletedProgram) {
            return res.status(404).json({ message: "Fix and Flip program not found" });
        }

        // Remove the program from the lender's loanPrograms array
        await Lender.findByIdAndUpdate(deletedProgram.lender, { $pull: { loanPrograms: programId } });

        res.json({ message: "Fix and Flip program deleted successfully" });
    } catch (error) {
        console.error("Error deleting Fix and Flip program:", error);
        res.status(500).json({ message: "Failed to delete Fix and Flip program" });
    }
});

module.exports = router;