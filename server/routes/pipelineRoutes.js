const express = require("express");
const router = express.Router();
const Pipeline = require("../models/Pipeline");
const Notification = require("../models/Notification");
const verifyToken = require("../middleware/verifyToken"); // ✅ Use verifyToken middleware

// ✅ Fetch all pipeline data (Admin Only)
router.get("/admin", verifyToken, async (req, res) => {
  try {
    const pipeline = await Pipeline.find().sort({ address: 1 });
    res.status(200).json({ success: true, pipeline });
  } catch (error) {
    console.error("❌ Error fetching all pipeline data:", error);
    res.status(500).json({ success: false, message: "Server error while fetching all pipeline data." });
  }
});

// ✅ Update milestones for a pipeline entry
router.put("/:id/milestones", verifyToken, async (req, res) => {
  try {
    const { milestones } = req.body;
    const pipeline = await Pipeline.findByIdAndUpdate(
      req.params.id,
      { milestones },
      { new: true }
    );

    // Trigger notification
    await Notification.create({
      userId: pipeline.userId,
      message: `Milestones updated for pipeline entry: ${pipeline.address}`,
    });

    res.status(200).json({ success: true, pipeline });
  } catch (error) {
    console.error("❌ Error updating milestones:", error);
    res.status(500).json({ success: false, message: "Server error while updating milestones." });
  }
});

// ✅ Update document statuses for a pipeline entry
router.put("/:id/documents", verifyToken, async (req, res) => {
  try {
    const { documents } = req.body;
    const pipeline = await Pipeline.findByIdAndUpdate(
      req.params.id,
      { documents },
      { new: true }
    );

    // Trigger notification
    await Notification.create({
      userId: pipeline.userId,
      message: `Document statuses updated for pipeline entry: ${pipeline.address}`,
    });

    res.status(200).json({ success: true, pipeline });
  } catch (error) {
    console.error("❌ Error updating documents:", error);
    res.status(500).json({ success: false, message: "Server error while updating documents." });
  }
});

// ✅ Add or update contact details for a pipeline entry
router.put("/:id/contacts", verifyToken, async (req, res) => {
  try {
    const { contacts } = req.body;
    const pipeline = await Pipeline.findByIdAndUpdate(
      req.params.id,
      { contacts },
      { new: true }
    );
    res.status(200).json({ success: true, pipeline });
  } catch (error) {
    console.error("❌ Error updating contacts:", error);
    res.status(500).json({ success: false, message: "Server error while updating contacts." });
  }
});

// ✅ Fetch quotes for the logged-in user
router.get("/quotes", verifyToken, async (req, res) => {
  try {
    console.log("🔍 Fetching quotes for user:", req.user._id);
    const quotes = await Quote.find({ userId: req.user._id }).sort({ propertyAddress: 1 });
    console.log("✅ Quotes fetched:", quotes);
    res.status(200).json({ success: true, quotes });
  } catch (error) {
    console.error("❌ Error fetching quotes:", error);
    res.status(500).json({ success: false, message: "Server error while fetching quotes." });
  }
});

module.exports = router;
