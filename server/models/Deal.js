const mongoose = require("mongoose");

const dealSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lenderId: { type: mongoose.Schema.Types.ObjectId, ref: "Lender", required: true },
  propertyAddress: String,
  loanAmount: Number,
  loanType: { type: String, enum: ["fixAndFlip", "dscr", "stabilizedBridge", "groundUp", "portfolio"], required: true },
  status: { type: String, enum: ["submitted", "approved", "rejected"], default: "submitted" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Deal", dealSchema);
