const mongoose = require("mongoose");

const lenderUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: false },
  company: { type: String, required: false },
  role: { type: String, default: "lender" },
  approved: { type: Boolean, default: false }, //user account approval
  lenderId: { type: String, default: null }, //additional added line
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("LenderUser", lenderUserSchema);
