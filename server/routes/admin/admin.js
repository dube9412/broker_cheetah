// routes/admin/admin.js (CORRECT and COMPLETE - Admin Actions for Lender Users)
const express = require('express');
const router = express.Router();
const LenderUser = require('../models/LenderUser'); // Path to LenderUser
const Lender = require('../models/Lender'); // Path to Lender model
const verifyToken = require('../middleware/verifyToken');

// GET all lender users (with optional filtering)
router.get('/lender-users', verifyToken, async (req, res) => {
    try {
        // Admin check
        if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        let query = {};
        if (req.query.approved) {
            query.approved = req.query.approved === 'true';
        }
        if (req.query.status) {
            if (req.query.status === 'suspended') {
                query.suspended = true;
            } else if (req.query.status === 'active') {
                query.suspended = false;
            }
        }
        //Search
        if(req.query.search){
            query.$or = [
                { name: { $regex: req.query.search, $options: 'i' } }, // Case-insensitive search
                { email: { $regex: req.query.search, $options: 'i' } },
            ]
        }

        const lenderUsers = await LenderUser.find(query).select('-password'); // Exclude password

        // Fetch all lenders (for populating lenderName)
        const lenders = await Lender.find();

        // Map lender users to include lenderName
        const lenderUsersWithLenderName = lenderUsers.map(user => {
            const lender = lenders.find(l => l._id.toString() === user.lenderId);
            return {
                ...user.toObject(), // Convert to plain JavaScript object
                lenderName: lender ? lender.name : 'N/A', // Add lenderName
            };
        });

        res.json(lenderUsersWithLenderName);

    } catch (error) {
        console.error("Error fetching lender users:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// POST - Approve a lender user
router.post('/lender-users/:id/approve', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        const updatedUser = await LenderUser.findByIdAndUpdate(
            req.params.id,
            { approved: true, suspended: false }, // Approve and un-suspend
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'Lender user not found' });
        }

        res.json({ success: true, message: 'Lender user approved successfully' });
    } catch (error) {
        console.error("Error approving lender user:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// POST - Suspend a lender user
router.post('/lender-users/:id/suspend', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        const updatedUser = await LenderUser.findByIdAndUpdate(
            req.params.id,
            { suspended: true },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'Lender user not found' });
        }

        res.json({ success: true, message: 'Lender user suspended successfully' });
    } catch (error) {
        console.error("Error suspending lender user:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// POST - Reactivate a lender user
router.post('/lender-users/:id/reactivate', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        const updatedUser = await LenderUser.findByIdAndUpdate(
            req.params.id,
            { suspended: false },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'Lender user not found' });
        }

        res.json({ success: true, message: 'Lender user reactivated successfully' });
    } catch (error) {
        console.error("Error reactivating lender user:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// DELETE - Delete a lender user
router.delete('/lender-users/:id', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        const deletedUser = await LenderUser.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({ success: false, message: 'Lender user not found' });
        }

        res.json({ success: true, message: 'Lender user deleted successfully' });
    } catch (error) {
        console.error("Error deleting lender user:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});
// POST - Assign a lender to a lender user.
router.post('/assign-lender', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        const { userId, lenderId } = req.body;
        if(!userId || !lenderId){
          return res.status(400).json({success: false, message: 'Both userId and lenderId are required.'})
        }

        const updatedUser = await LenderUser.findByIdAndUpdate(
            userId,
            { lenderId },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'Lender user not found' });
        }
        const lender = await Lender.findById(lenderId);
        res.json({ success: true, message: 'Lender assigned successfully', user:{
            ...updatedUser.toObject(),
            lenderName: lender? lender.name : 'N/A'
        } });
    } catch (error) {
        console.error("Error assigning lender:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;