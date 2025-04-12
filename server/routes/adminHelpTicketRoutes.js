const express = require("express");
const router = express.Router();
const HelpTicket = require("../models/HelpTicket");

// ✅ GET all help tickets (no token required)
router.get("/", async (req, res) => {
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
      status: "Open", // Default status
    });

    await newHelpTicket.save();
    console.log("✅ Help ticket saved:", newHelpTicket);
    res.status(201).json({ success: true, message: "Help ticket submitted successfully." });
  } catch (error) {
    console.error("❌ Error submitting help ticket:", error);
    res.status(500).json({ success: false, message: "Server error while submitting help ticket." });
  }
});

// ✅ Update the status of a help ticket (no token required)
router.put('/:ticketId/status', async (req, res) => {
  const { ticketId } = req.params;
  const { status } = req.body;

  console.log("🔍 Updating status for ticket:", ticketId, "to:", status);

  if (!status) {
    return res.status(400).json({ success: false, message: "Status is required." });
  }

  try {
    const ticket = await HelpTicket.findByIdAndUpdate(
      ticketId,
      { status },
      { new: true, runValidators: true }
    );

    if (!ticket) {
      console.error("❌ Ticket not found:", ticketId);
      return res.status(404).json({ success: false, message: "Ticket not found." });
    }

    console.log("✅ Ticket status updated:", ticket);
    res.json({ success: true, ticket });
  } catch (error) {
    console.error("❌ Error updating ticket status:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ✅ Resolve a help ticket (no token required)
router.post("/:ticketId/resolve", async (req, res) => {
  const { ticketId } = req.params;

  console.log("🔍 Resolving ticket:", ticketId);

  try {
    const ticket = await HelpTicket.findByIdAndUpdate(
      ticketId,
      { status: "Resolved" },
      { new: true, runValidators: true }
    );

    if (!ticket) {
      console.error("❌ Ticket not found:", ticketId);
      return res.status(404).json({ success: false, message: "Ticket not found." });
    }

    console.log("✅ Ticket resolved:", ticket);
    res.json({ success: true, ticket });
  } catch (error) {
    console.error("❌ Error resolving ticket:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

module.exports = router;
