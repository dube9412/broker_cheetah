const express = require("express");
const router = express.Router();
const LenderUser = require("../models/LenderUser");

router.get("/", async (req, res) => {
    try {
        const lenderUsers = await LenderUser.find().select("-password");
        res.json(lenderUsers);
    } catch (error) {
        console.error("Error fetching lender users:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
