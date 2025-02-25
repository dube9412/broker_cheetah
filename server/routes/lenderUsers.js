// routes/lenderUsers.js (For INDIVIDUAL LENDER USER actions - NOT ADMIN)
const express = require('express');
const router = express.Router();
const LenderUser = require('../models/LenderUser'); // Ensure the case matches the file name
const verifyToken = require('../middleware/verifyToken');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Get *own* lender user info (PROTECTED)
router.get('/:lenderUserId', verifyToken, async (req, res) => {
    try {
        // This route is for a lender user to get THEIR OWN information.
        // The verifyToken middleware has already decoded the JWT and attached the user info to req.user.
        if (req.user.role !== 'lender' || req.user.lenderUserId !== req.params.lenderUserId) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        const LenderUser = await LenderUser.findById(req.params.lenderUserId).select('-password');

        if (!LenderUser) {
            return res.status(404).json({ success: false, message: 'Lender user not found' });
        }

        res.json(LenderUser);
    } catch (error) {
        console.error("Error fetching lender user:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Update *own* lender user info (PROTECTED)
router.put('/:lenderUserId', verifyToken, async (req, res) => {
    try {
        // This route is for a lender user to update THEIR OWN information.
        if (req.user.role !== 'lender' || req.user.lenderUserId !== req.params.lenderUserId) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }
        // Prevent user from updating sensitive information.
        const updates = { ...req.body };
        delete updates.approved;
        delete updates.lenderId;
        delete updates.suspended;
        delete updates.role;
        const updatedLenderUser = await LenderUser.findByIdAndUpdate(
            req.params.lenderUserId,
            updates, // Only update allowed fields
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedLenderUser) {
            return res.status(404).json({ success: false, message: 'Lender user not found' });
        }

        res.json(updatedLenderUser);
    } catch (error) {
        console.error("Error updating lender user:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// POST route for logo upload (PROTECTED) - For the individual lender user
router.post('/:lenderUserId/upload-logo', verifyToken, upload.single('logo'), async (req, res) => {
    try {
        // This route is for a lender user to upload THEIR OWN logo.
        if (req.user.role !== 'lender' || req.user.lenderUserId !== req.params.lenderUserId) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const logoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        const updatedLenderUser = await LenderUser.findByIdAndUpdate(
            req.params.lenderUserId,
            { logoUrl },
            { new: true, runValidators: false } // Don't run validators for logo URL
        ).select('-password');

        if (!updatedLenderUser) {
            return res.status(404).json({ success: false, message: 'Lender user not found' });
        }

        res.json({ success: true, logoUrl: updatedLenderUser.logoUrl });
    } catch (error) {
        console.error('Error uploading logo:', error);
        res.status(500).json({ success: false, message: 'Server error during logo upload' });
    }
});

module.exports = router;