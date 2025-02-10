const express = require('express');
const { MongoClient } = require('mongodb');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Keep your JWT secret in an environment variable for security
const JWT_SECRET = process.env.JWT_SECRET;

const mongoURI = process.env.MONGODB_URI;

const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
  if (!client.isConnected()) {
    await client.connect();
  }
}

router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: 'User already exists.' });
    }
    // Hash the password
    const hashed = await bcrypt.hash(password, 10);
    // Save user
    const newUser = new User({ email, password: hashed });
    await newUser.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Signup error:', error);
    res.json({ success: false, message: 'Signup error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    await connectToDatabase();
    const db = client.db("admin");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send('Invalid credentials');
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: '1d'
    });

    // Check if this user is the admin email
    const isAdmin = (email === 'dube9412@gmail.com');

    // Return isAdmin in the response
    res.json({ success: true, token, isAdmin });
  } catch (err) {
    console.error('MongoDB Error:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;