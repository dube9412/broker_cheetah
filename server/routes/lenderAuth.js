// routes/lenderAuth.js (VERIFIED CORRECT)
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const LenderUser = require('../models/LenderUser'); // VERIFIED CORRECT PATH

// Lender User Signup Route
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, phone, company } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const existingUser = await LenderUser.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newLenderUser = new LenderUser({
            name,
            email,
            password: hashedPassword,
            phone,
            company,
            approved: false,
            suspended: false
        });

        await newLenderUser.save();
        res.status(201).json({ success: true, message: "Signup successful, pending admin approval" });

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Lender User Login Route
router.post('/login', async (req, res) => {
    try {
        console.log("🔍 Login Attempt:", req.body); // ✅ Log email and password input

        const { email, password } = req.body;
        const lenderUser = await LenderUser.findOne({ email });

        if (!lenderUser) {
            console.log("❌ User not found in DB");
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        // *** CHECK FOR APPROVED STATUS ***
        if (!lenderUser.approved) {
            return res.status(403).json({ success: false, message: 'Account awaiting admin approval.' });
        }
        console.log("✅ Found user:", lenderUser.email);

        const isMatch = await bcrypt.compare(password, lenderUser.password);
        console.log("🔍 Password Match:", isMatch);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        lenderUser.lastLogin = new Date();
        await lenderUser.save();

        const token = jwt.sign({ lenderUserId: lenderUser._id, role: "lender" }, process.env.JWT_SECRET, { expiresIn: "1d" });
        console.log("🔑 Generated Token:", token);

        res.json({
            success: true,
            token,
            lenderUserId: lenderUser._id,
            role: 'lender',
            approved: lenderUser.approved, // Essential
            lenderId: lenderUser.lenderId, // Essential (might be null)
        });

    } catch (error) {
        console.error("Lender User Login Error:", error);
        res.status(500).json({ success: false, message: "Login error", error: error.message });
    }
});


module.exports = router;