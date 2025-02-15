// adminRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/user");

// ✅ GET all users (Admin Only)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "email role createdAt");  // Only return relevant fields
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// ✅ Promote a user to admin (Admin Only)
router.post("/promote", async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role === "superadmin") {
      return res.status(403).json({ message: "Cannot modify a superadmin" });
    }
    user.role = "admin";
    await user.save();
    res.status(200).json({ success: true, message: "User promoted to admin" });
  } catch (error) {
    console.error("❌ Error promoting user to admin:", error);
    res.status(500).json({ message: "Failed to promote user" });
  }
});

// ✅ Delete or Suspend a user (Admin Only)
router.delete("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.email === "dube9412@gmail.com") {
      return res.status(403).json({ message: "Cannot delete the superadmin" });
    }
    await user.remove();
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

module.exports = router;
