const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const { isAuthenticated } = require("../middleware/auth");

// ✅ Fetch notifications for the logged-in user
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    res.status(500).json({ success: false, message: "Server error while fetching notifications." });
  }
});

// ✅ Mark notifications as read
router.put("/:id/read", isAuthenticated, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    res.status(200).json({ success: true, notification });
  } catch (error) {
    console.error("❌ Error marking notification as read:", error);
    res.status(500).json({ success: false, message: "Server error while updating notification." });
  }
});

module.exports = router;
