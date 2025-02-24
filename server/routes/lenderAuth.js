const express = require("express");
const router = express.Router();
const LenderUser = require("../models/lenderUser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "YOUR_SECRET_KEY";

// ✅ Lender Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, phone, company } = req.body;

    const existingLender = await LenderUser.findOne({ email });
    if (existingLender) {
      return res.status(400).json({ success: false, message: "Lender user already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newLenderUser = new LenderUser({
      name,
      email,
      password: hashedPassword,
      phone,
      company,
    });

    await newLenderUser.save();

    res.json({ success: true, message: "Lender account created successfully!" });
  } catch (error) {
    console.error("Lender Signup Error:", error);
    res.status(500).json({ success: false, message: "Signup error" });
  }
});

// ✅ Lender Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const lenderUser = await LenderUser.findOne({ email });

    if (!lenderUser) {
      return res.status(400).json({ success: false, message: "Invalid credentials." });
    }

    const match = await bcrypt.compare(password, lenderUser.password);
    if (!match) {
      return res.status(400).json({ success: false, message: "Invalid credentials." });
    }

    const token = jwt.sign({ lenderUserId: lenderUser._id, role: "lender" }, JWT_SECRET, { expiresIn: "1d" });

    res.json({
      success: true,
      token,
      lenderUserId: lenderUser._id,
      role: "lender",
    });
  } catch (error) {
    console.error("Lender Login Error:", error);
    res.status(500).json({ success: false, message: "Login error" });
  }
});

module.exports = router;
