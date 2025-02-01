const mongoose = require("mongoose");

const TierSchema = new mongoose.Schema({
  lenderId: { type: mongoose.Schema.Types.ObjectId, ref: "Lender", required: true }, // Tied to lender
  loanProgramId: { type: mongoose.Schema.Types.ObjectId, ref: "FixAndFlipLoan", required: true }, // Linked to loan program
  tierName: { type: String, required: true }, // e.g., "Tier 1", "Tier 2", "Elite"
  minFICO: { type: Number, required: true },
  minExperience: { type: Number, required: true }, // Min completed flips
  minTransactionCount: { type: Number, required: true }, // Total transactions
  minTrueFlips: { type: Number, required: true }, // "True flip" completions
  maxLTP: { type: Number, required: true }, // Loan-to-Purchase cap for this tier
  maxARV: { type: Number, required: true }, // Max ARV % allowed
  totalLTC: { type: Number, required: true }, // Max Loan-to-Cost %
  heavyRehabAllowed: { type: Boolean, default: false }, // If heavy rehab is allowed
});

module.exports = mongoose.model("Tier", TierSchema);
