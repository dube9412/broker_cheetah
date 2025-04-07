const express = require("express");
const router = express.Router();
const HelpTicket = require("../models/HelpTicket");
const verifyToken = require("../middleware/verifyToken");

// ✅ Submit a new help ticket
router.post("/", verifyToken, async (req, res) => {
  console.log("🔹 POST /api/admin/help-tickets called");
  console.log("🔹 Request body:", req.body);
  console.log("🔹 Authenticated user:", req.user); // Log the authenticated user
  console.log("🔹 Help ticket submission received:", req.body); // Log the request body
  try {
    const { issue, desiredOutcome } = req.body;

    if (!issue || !desiredOutcome) {
      return res.status(400).json({ success: false, message: "Issue and desired outcome are required." });
    }

    const newHelpTicket = new HelpTicket({
      userEmail: req.user.email, // Use the email from the authenticated user
      issue,
      desiredOutcome,
    });

    await newHelpTicket.save();
    console.log("✅ Help ticket saved:", newHelpTicket); // ✅ Log the saved ticket
    res.status(201).json({ success: true, message: "Help ticket submitted successfully." });
  } catch (error) {
    console.error("❌ Error submitting help ticket:", error);
    res.status(500).json({ success: false, message: "Server error while submitting help ticket." });
  }
});

module.exports = router;
