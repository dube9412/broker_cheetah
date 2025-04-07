const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

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

// Fetch users for admin list
router.get('/admin/users', async (req, res) => {
  try {
    const users = await User.find({}, 'firstName lastName email role createdAt lastLogin marketingOptIn');
    console.log('Fetched users from database:', users); // Log fetched users to verify data
    res.json(users.map(user => user.toObject())); // Ensure data is sent as plain objects
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
});

module.exports = router;