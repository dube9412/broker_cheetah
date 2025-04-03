const express = require("express");
const router = express.Router();
const Pipeline = require("../models/Pipeline");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

// ✅ Add a new quote to the pipeline
router.post("/", isAuthenticated, async (req, res) => {
  try {
    const { address, fico, experience, purchasePrice, asisValue, rehabNeeded, arv, liquidity } = req.body;

    if (!address || !fico || !experience || !purchasePrice || !asisValue || !rehabNeeded || !arv || !liquidity) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const newPipelineEntry = new Pipeline({
      userId: req.user._id,
      address,
      fico,
      experience,
      purchasePrice,
      asisValue,
      rehabNeeded,
      arv,
      liquidity,
    });

    await newPipelineEntry.save();
    res.status(201).json({ success: true, message: "Pipeline entry added successfully." });
  } catch (error) {
    console.error("❌ Error adding pipeline entry:", error);
    res.status(500).json({ success: false, message: "Server error while adding pipeline entry." });
  }
});

// ✅ Fetch pipeline data for the logged-in user
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const pipeline = await Pipeline.find({ userId: req.user._id }).sort({ address: 1 });
    res.status(200).json({ success: true, pipeline });
  } catch (error) {
    console.error("❌ Error fetching pipeline data:", error);
    res.status(500).json({ success: false, message: "Server error while fetching pipeline data." });
  }
});

// ✅ Fetch all pipeline data (Admin Only)
router.get("/admin", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const pipeline = await Pipeline.find().sort({ address: 1 });
    res.status(200).json({ success: true, pipeline });
  } catch (error) {
    console.error("❌ Error fetching all pipeline data:", error);
    res.status(500).json({ success: false, message: "Server error while fetching all pipeline data." });
  }
});

module.exports = router;
