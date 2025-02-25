// routes/lenderUsers.js (NEW FILE)
const express = require('express');
const router = express.Router();
const LenderUser = require('../models/lenderUser');
const verifyToken = require('../middleware/verifyToken'); // You'll need this middleware
const multer = require('multer'); //For the image upload
const upload = multer({ dest: 'uploads/' }); // Temporary storage for uploads

// Get lender user info by ID (PROTECTED)
router.get('/:lenderUserId', verifyToken, async (req, res) => {
    try {
        // Verify the token and ensure the user is authorized
        if (req.user.role !== 'lender' || req.user.lenderUserId !== req.params.lenderUserId) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        const lenderUser = await LenderUser.findById(req.params.lenderUserId).select('-password'); // Exclude password

        if (!lenderUser) {
            return res.status(404).json({ success: false, message: 'Lender user not found' });
        }

        res.json(lenderUser);
    } catch (error) {
        console.error("Error fetching lender user:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Update lender user info (PROTECTED)
router.put('/:lenderUserId', verifyToken, async (req, res) => {
    try {
        // Verify the token and ensure the user is authorized
        if (req.user.role !== 'lender' || req.user.lenderUserId !== req.params.lenderUserId) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        const updatedLenderUser = await LenderUser.findByIdAndUpdate(
            req.params.lenderUserId,
            req.body, // Contains the updated fields
            { new: true, runValidators: true } // Return the updated document, run schema validators
        ).select('-password'); // Exclude password

        if (!updatedLenderUser) {
            return res.status(404).json({ success: false, message: 'Lender user not found' });
        }

        res.json(updatedLenderUser);
    } catch (error) {
        console.error("Error updating lender user:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

//upload logo
// POST route for logo upload (PROTECTED)
router.post('/:lenderUserId/upload-logo', verifyToken, upload.single('logo'), async (req, res) => {
  try {
    // Verify the token and ensure the user is authorized
    if (req.user.role !== 'lender' || req.user.lenderUserId !== req.params.lenderUserId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Construct the URL to the uploaded file
    const logoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    // Update the lender user's document with the logo URL
    const updatedLenderUser = await LenderUser.findByIdAndUpdate(
      req.params.lenderUserId,
      { logoUrl }, // Update only the logoUrl field
      { new: true, runValidators: false } // Get the updated document
    ).select('-password');

    if (!updatedLenderUser) {
      return res.status(404).json({ success: false, message: 'Lender user not found' });
    }

     res.json({ success: true, logoUrl: updatedLenderUser.logoUrl }); // Return the new URL
    } catch (error) {
        console.error('Error uploading logo:', error);
        res.status(500).json({ success: false, message: 'Server error during logo upload' });
    }
});

module.exports = router;