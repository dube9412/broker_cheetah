const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const FixAndFlipLoan = require("../models/FixAndFlipLoan"); // Only this one for now

router.post("/", async (req, res) => {
  try {
    const payload = req.body;

    if (!Array.isArray(payload)) {
      return res.status(400).json({ message: "Payload must be an array of loan programs" });
    }

    const inserted = [];

    for (const program of payload) {
      // Check required fields
      if (!program.name || !program.type || !program.lender) {
        console.warn("Skipping program due to missing required fields:", program);
        continue;
      }

      // Normalize the type field to lowercase
      program.type = program.type.toLowerCase();

      // Convert lender to ObjectId
      program.lender = mongoose.Types.ObjectId(program.lender);

      const newProgram = new FixAndFlipLoan(program);
      await newProgram.save();
      inserted.push(newProgram);
    }

    res.status(200).json({ success: true, insertedCount: inserted.length, inserted });
  } catch (error) {
    console.error("❌ Error importing JSON:", error);
    res.status(500).json({ success: false, message: "Server error during import" });
  }
});

module.exports = router;
