// adminRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/user"); // Corrected to match the actual file name
const adminController = require('../controllers/adminController');
const documentRoutes = require('./documentRoutes');
const LenderUser = require("../models/LenderUser");
const Lender = require("../models/Lender");
const Quote = require("../models/Quote"); // Add Quote model

// ✅ Use existing document routes inside /api/admin/documents
router.use("/documents", documentRoutes);

// ✅ GET all users (Admin Only)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "firstName lastName email role createdAt lastLogin marketingOptIn");  // Only return relevant fields
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

// ✅ Suspend a user (Admin Only)
router.post("/suspend", async (req, res) => {
    try {
      const { userId } = req.body;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (user.role === "superadmin") {
        return res.status(403).json({ message: "Cannot suspend a superadmin" });
      }
      user.role = "suspended";
      await user.save();
      res.status(200).json({ success: true, message: "User suspended successfully" });
    } catch (error) {
      console.error("❌ Error suspending user:", error);
      res.status(500).json({ message: "Failed to suspend user" });
    }
  });

  router.post("/reactivate", async (req, res) => {
    try {
      const { userId } = req.body;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (user.role !== "suspended") {
        return res.status(400).json({ message: "User is not suspended" });
      }
      user.role = "user";
      await user.save();
      res.status(200).json({ success: true, message: "User reactivated successfully" });
    } catch (error) {
      console.error("❌ Error reactivating user:", error);
      res.status(500).json({ message: "Failed to reactivate user" });
    }
  });
  
  // ✅ Demote an admin back to a regular user (Admin Only)
  router.post("/demote", async (req, res) => {
    try {
      const { userId } = req.body;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (user.role !== "admin") {
        return res.status(400).json({ message: "Only admins can be demoted" });
      }
      user.role = "user";
      await user.save();
      res.status(200).json({ success: true, message: "User demoted successfully" });
    } catch (error) {
      console.error("❌ Error demoting user:", error);
      res.status(500).json({ message: "Failed to demote user" });
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

router.post("/toggle-optin", async (req, res) => {
  try {
    const { userId, marketingOptIn } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.marketingOptIn = marketingOptIn;
    await user.save();
    res.status(200).json({ success: true, message: "Marketing opt-in status updated" });
  } catch (error) {
    console.error("Error updating opt-in status:", error);
    res.status(500).json({ message: "Failed to update opt-in status" });
  }
});

router.post('/assign-lender', adminController.assignLenderToUser);

router.get("/analytics", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalLenders = await Lender.countDocuments();
    const totalQuotes = await Quote.countDocuments();
    const totalRevenue = 10000; // Placeholder (replace with real revenue data)
    const subscriptionUsers = 500; // Placeholder

    res.status(200).json({
      totalUsers,
      totalLenders,
      totalQuotes,
      totalRevenue,
      subscriptionUsers,
    });
  } catch (error) {
    console.error("❌ Error fetching analytics:", error);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
});

router.post("/import-json", async (req, res) => {
  try {
    const jsonData = req.body;
    if (!jsonData) return res.status(400).json({ message: "No data provided" });

    // ✅ Add logic to process & store JSON data
    console.log("✅ Received JSON Data:", jsonData);

    res.status(200).json({ success: true, message: "JSON Imported Successfully" });
  } catch (error) {
    console.error("❌ Error importing JSON:", error);
    res.status(500).json({ message: "Failed to import JSON" });
  }
});


module.exports = router;
