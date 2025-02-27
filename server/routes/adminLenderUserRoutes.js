const express = require("express");
const router = express.Router();
const LenderUser = require("../models/LenderUser"); // Ensure the case matches the file name

// ✅ GET all lender users (Admin Only)
router.get("/", async (req, res) => {
  try {
    const lenderUsers = await LenderUser.find();
    res.status(200).json(lenderUsers);
  } catch (error) {
    console.error("❌ Error fetching lender users:", error);
    res.status(500).json({ message: "Failed to fetch lender users" });
  }
});

// ✅ Approve a lender user
router.post("/:id/approve", async (req, res) => {
  try {
    const updatedUser = await LenderUser.findByIdAndUpdate(
      req.params.id,
      { approved: true, suspended: false }, // Approve and un-suspend
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "Lender user not found" });
    }

    res.json({ success: true, message: "Lender user approved successfully", user: updatedUser });
  } catch (error) {
    console.error("Error approving lender user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Suspend a lender user
router.post("/:id/suspend", async (req, res) => {
  try {
    const updatedUser = await LenderUser.findByIdAndUpdate(
      req.params.id,
      { suspended: true },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "Lender user not found" });
    }

    res.json({ success: true, message: "Lender user suspended successfully" });
  } catch (error) {
    console.error("Error suspending lender user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Reactivate a lender user
router.post("/:id/reactivate", async (req, res) => {
  try {
    const updatedUser = await LenderUser.findByIdAndUpdate(
      req.params.id,
      { suspended: false },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "Lender user not found" });
    }

    res.json({ success: true, message: "Lender user reactivated successfully" });
  } catch (error) {
    console.error("Error reactivating lender user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ DELETE - Delete a lender user
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await LenderUser.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "Lender user not found" });
    }

    res.json({ success: true, message: "Lender user deleted successfully" });
  } catch (error) {
    console.error("Error deleting lender user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
// POST - Assign a lender to a lender user.
router.post('/assign-lender', async (req, res) => {
  try {
      const { userId, lenderId } = req.body;

      if (!userId || !lenderId) {
          return res.status(400).json({ success: false, message: 'Both userId and lenderId are required.' });
      }

      const updatedUser = await LenderUser.findByIdAndUpdate(
          userId,
          { lenderId },
          { new: true }
      ).select('-password');

      if (!updatedUser) {
          return res.status(404).json({ success: false, message: 'Lender user not found' });
      }

      res.json({ success: true, message: 'Lender assigned successfully', user: updatedUser });
  } catch (error) {
      console.error("Error assigning lender:", error);
      res.status(500).json({ success: false, message: "Server error" });
  }
});


module.exports = router;
