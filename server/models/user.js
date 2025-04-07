const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin", "superadmin"], default: "user" },
  name: { type: String, required: false },
  marketingOptIn: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  userType: { type: String, enum: ["Broker", "Investor", "Other"], required: true },
  lastLogin: { type: Date, default: null }, // Default to null if the user has never logged in
});

module.exports = mongoose.model("User", userSchema);
