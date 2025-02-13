const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Keep your JWT secret in an environment variable for security
const JWT_SECRET =  process.env.JWT_SECRET || 'YOUR_SECRET_KEY';

// Sign Up
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: 'User already exists.' });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Save user
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Signup error:', error);
    res.json({ success: false, message: 'Signup error' });
  }
});

// Login
// server/routes/auth.js
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
  
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'Invalid credentials.' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({ success: false, message: 'Invalid credentials.' });
    }
    // Create JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: '1d'
    });

    // Check if this user is the admin email
    const isAdmin = (email === 'dube9412@gmail.com');

    // Return isAdmin in the response
    res.json({ success: true, token, isAdmin });
  } catch (error) {
    console.error('Login error:', error);
    res.json({ success: false, message: 'Login error' });
  }
});

module.exports = router;



