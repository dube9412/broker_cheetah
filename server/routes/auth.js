const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Keep your JWT secret in an environment variable for security
const JWT_SECRET =  process.env.JWT_SECRET || 'YOUR_SECRET_KEY';

// Sign Up
router.post('/signup', async (req, res) => {
  const { email, password, marketingOptIn } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: 'User already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, marketingOptIn });
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
      return res.json({ success: false, message: 'Invalid credentials.' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({ success: false, message: 'Invalid credentials.' });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    res.json({ 
      success: true, 
      token, 
      role: user.role, 
      lenderId: user.lenderId || null, 
      isAdmin: user.role === 'admin' || user.role === 'superadmin', 
      isSuperAdmin: user.role === 'superadmin' 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.json({ success: false, message: 'Login error' });
  }
});

router.post('/signup-lender', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: 'User already exists.' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashed, role: "lender", name });
    await newUser.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Signup error:', error);
    res.json({ success: false, message: 'Signup error' });
  }
});




module.exports = router;



