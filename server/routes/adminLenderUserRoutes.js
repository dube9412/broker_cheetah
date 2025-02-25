const express = require("express");
const router = express.Router();
const LenderUser = require("../models/LenderUser"); // Ensure the case matches the file name

// GET all lender users (Admin Only)
router.get("/", async (req, res) => {
  try {
    const lenderUsers = await LenderUser.find();
    res.status(200).json(lenderUsers);
  } catch (error) {
    console.error("❌ Error fetching lender users:", error);
    res.status(500).json({ message: "Failed to fetch lender users" });
  }
});

module.exports = router;
