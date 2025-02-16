const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  marketingOptIn: { type: Boolean, default: false }, // New field for marketing opt-in
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
