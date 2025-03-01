const express = require("express");
const router = express.Router();
const Lender = require("../models/Lender");
const verifyToken = require("../middleware/verifyToken");

// ✅ Allow Lenders to Fetch Only Their Own Lender Data
router.get("/:lenderId", verifyToken, async (req, res) => {
    try {
        // ✅ Check if the user is an admin or if the lenderId matches the logged-in user
        if (req.user.role !== "admin" && req.user.role !== "superadmin" && req.user.lenderId !== req.params.lenderId) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        const lender = await Lender.findById(req.params.lenderId);
        if (!lender) {
            return res.status(404).json({ success: false, message: "Lender not found" });
        }

        res.json({ success: true, lender });
    } catch (error) {
        console.error("Error fetching lender:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ✅ Allow Lenders to Update Their Own Lender Data
router.put("/:lenderId", verifyToken, async (req, res) => {
    try {
        if (req.user.role !== "admin" && req.user.role !== "superadmin" && req.user.lenderId !== req.params.lenderId) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        const updatedLender = await Lender.findByIdAndUpdate(req.params.lenderId, req.body, { new: true, runValidators: true });
        if (!updatedLender) {
            return res.status(404).json({ success: false, message: "Lender not found" });
        }

        res.json({ success: true, lender: updatedLender });
    } catch (error) {
        console.error("Error updating lender:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
