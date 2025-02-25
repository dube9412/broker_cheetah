// routes/lenders.js (You likely ALREADY have this)
const express = require('express');
const router = express.Router();
const Lender = require('../models/Lender'); // Path to your Lender model

// GET all lenders
router.get('/', async (req, res) => {
    try {
        const lenders = await Lender.find();
        res.json({ success: true, lenders }); // Consistent response format
    } catch (error) {
        console.error("Error fetching lenders:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;