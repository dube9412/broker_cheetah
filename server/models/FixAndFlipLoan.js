const mongoose = require("mongoose");

const FixAndFlipLoanSchema = new mongoose.Schema({
  lenderId: { type: mongoose.Schema.Types.ObjectId, ref: "Lender", required: true }, // Lender reference
  minLoanAmount: { type: Number, required: true },
  maxLoanAmount: { type: Number, required: true },
  minFICO: { type: Number, required: true },
  minExperience: { type: Number, required: true }, // Minimum flips required
  maxARV: { type: Number, required: true }, // Max ARV %
  maxLTP: { type: Number, required: true }, // Max Loan-to-Purchase %
  totalLTC: { type: Number, required: true }, // Max Loan-to-Cost %

  rehabDefinition: {
    lightRehabLimit: { type: Number, default: null }, // % of purchase price
    heavyRehabMin: { type: Number, default: null }, // Minimum rehab $ for heavy
  },

  tiers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tier" }], // Array of tiers
});

module.exports = mongoose.model("FixAndFlipLoan", FixAndFlipLoanSchema);
