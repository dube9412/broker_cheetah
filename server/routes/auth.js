const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');

// Sign Up Route
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });

    // Save the new user
    await newUser.save();
    res.json({ success: true, message: "User created successfully!" });
  } catch (error) {
    console.error("Signup error:", error);
    res.json({ success: false, message: "Signup error" });
  }
});

module.exports = router;





