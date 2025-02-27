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
        const { email, password } = req.body;
        const LenderUser = await LenderUser.findOne({ email });

        if (!LenderUser) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        // *** CHECK FOR APPROVED STATUS ***
        if (!LenderUser.approved) {
            return res.status(403).json({ success: false, message: 'Account awaiting admin approval.' });
        }

        const isMatch = await bcrypt.compare(password, LenderUser.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ lenderUserId: LenderUser._id, role: "lender" }, process.env.JWT_SECRET, { expiresIn: "1d" });

        // *** INCLUDE approved AND lenderId IN RESPONSE ***
        res.json({
            success: true,
            token,
            lenderUserId: LenderUser._id,
            role: 'lender',
            approved: LenderUser.approved, //  Essential
            lenderId: LenderUser.lenderId, //  Essential (might be null)
        });

    } catch (error) {
        console.error("Lender User Login Error:", error);
        res.status(500).json({ success: false, message: "Login error" });
    }
});

module.exports = router;