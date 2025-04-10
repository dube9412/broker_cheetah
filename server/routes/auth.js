const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/email'); // Import email utility
const crypto = require('crypto');

// Keep your JWT secret in an environment variable for security
const JWT_SECRET =  process.env.JWT_SECRET || 'YOUR_SECRET_KEY';

// Sign Up
router.post('/signup', async (req, res) => {
  const { email, password, marketingOptIn, firstName, lastName, userType } = req.body; // Add new fields
  try {
    if (!firstName || !lastName || !userType) {
      return res.json({ success: false, message: 'First name, last name, and user type are required.' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: 'User already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, marketingOptIn, firstName, lastName, userType }); // Include new fields
    await newUser.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Signup error:', error);
    res.json({ success: false, message: 'Signup error' });
  }
});


// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Check if JWT_SECRET is defined
    if (!JWT_SECRET) {
      console.error("❌ JWT_SECRET is not defined. Please set it in the environment variables.");
      return res.status(500).json({ success: false, message: "Server configuration error." });
    }

    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    console.log("🔑 Generated Token:", token);

    res.status(200).json({
      success: true,
      token,
      role: user.role,
      isAdmin: user.role === 'admin',
      isSuperAdmin: user.role === 'superadmin',
      lenderId: user.lenderId || null,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// Request password reset
router.post('/password-reset/request', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const resetLink = `${req.protocol}://${req.get('host')}/reset-password?token=${resetToken}`;
    await sendEmail(email, 'Password Reset Request', `Reset your password using this link: ${resetLink}`);

    res.status(200).json({ success: true, message: 'Password reset email sent' });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Verify reset token
router.post('/password-reset/verify', async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired token' });

    res.status(200).json({ success: true, message: 'Token verified' });
  } catch (error) {
    console.error('Error verifying reset token:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Reset password
router.post('/password-reset/reset', async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired token' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;