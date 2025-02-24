const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['user', 'admin', 'superadmin', 'lender', 'suspended'], 
    default: "user" 
  },
  marketingOptIn: { type: Boolean, default: false }, // New field for marketing opt-in
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
