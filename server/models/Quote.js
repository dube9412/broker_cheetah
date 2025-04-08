const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lenderId: { type: mongoose.Schema.Types.ObjectId, ref: "Lender", required: true },
  loanType: { type: String, enum: ["fixAndFlip", "dscr", "stabilizedBridge", "groundUp", "portfolio"], required: true },
  propertyAddress: String,
  ficoScore: Number,
  experience: Number,
  purchasePrice: Number,
  rehabNeeded: Number,
  arv: Number,
  liquidity: Number,
  rentRate: Number, // DSCR-specific
  taxes: Number, // DSCR-specific
  insurance: Number, // DSCR-specific
  hoa: Number, // DSCR-specific
  downPayment: Number, // Stabilized Bridge-specific
  projectCost: Number, // Ground Up-specific
  portfolioDetails: String, // Portfolio-specific
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Quote", quoteSchema);
