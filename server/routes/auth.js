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
    if (!user) {
      return res.status(404).json({ success: false, message: 'Invalid credentials.' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(404).json({ success: false, message: 'Invalid credentials.' });
    }

    // Update lastLogin field
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    res.json({ 
      success: true, 
      token, 
      role: user.role,  
      isAdmin: user.role === 'admin' || user.role === 'superadmin', 
      isSuperAdmin: user.role === 'superadmin',
      firstName: user.firstName, // Include first name
      lastName: user.lastName,  // Include last name
      lastLogin: user.lastLogin // Include last login
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login error' });
  }
});

// Fetch users for admin list
router.get('/admin/users', async (req, res) => {
  try {
    const users = await User.find({}, 'firstName lastName email role createdAt lastLogin'); // Fetch required fields
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
});

module.exports = router;