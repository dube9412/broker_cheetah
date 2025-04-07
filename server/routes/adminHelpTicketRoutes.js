const express = require("express");
const router = express.Router();
const HelpTicket = require("../models/HelpTicket");

// ✅ GET all help tickets
router.get("/", verifyToken, async (req, res) => {
  try {
    const tickets = await HelpTicket.find();
    res.status(200).json({ tickets });
  } catch (error) {
    console.error("❌ Error fetching help tickets:", error);
    res.status(500).json({ message: "Failed to fetch help tickets" });
  }
});

// ✅ Submit a new help ticket (no token required)
router.post("/", async (req, res) => {
  console.log("🔹 POST /api/admin/help-tickets called");
  console.log("🔹 Request body:", req.body);

  try {
    const { issue, desiredOutcome, userEmail } = req.body;

    if (!issue || !desiredOutcome) {
      return res.status(400).json({ success: false, message: "Issue and desired outcome are required." });
    }

    const newHelpTicket = new HelpTicket({
      userEmail: userEmail || "Anonymous", // Allow anonymous submissions
      issue,
      desiredOutcome,
    });

    await newHelpTicket.save();
    console.log("✅ Help ticket saved:", newHelpTicket);
    res.status(201).json({ success: true, message: "Help ticket submitted successfully." });
  } catch (error) {
    console.error("❌ Error submitting help ticket:", error);
    res.status(500).json({ success: false, message: "Server error while submitting help ticket." });
  }
});

// ✅ Resolve a help ticket
router.post("/:ticketId/resolve", verifyToken, async (req, res) => {
  try {
    const ticket = await HelpTicket.findById(req.params.ticketId);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    ticket.status = "Resolved";
    await ticket.save();
    res.status(200).json({ success: true, message: "Ticket resolved" });
  } catch (error) {
    console.error("❌ Error resolving help ticket:", error);
    res.status(500).json({ message: "Failed to resolve ticket" });
  }
});

module.exports = router;
