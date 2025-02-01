const mongoose = require("mongoose");

const TierSchema = new mongoose.Schema({
  tier: Number,
  fico: Number,
  experience: Number,
  maxLTP: Number,
  totalLTC: Number,
  maxARV: Number,
  minLoan: Number,
  maxLoan: Number,
});

const LoanProgramSchema = new mongoose.Schema({
  name: String,
  tiers: [TierSchema],
});

module.exports = mongoose.model("LoanProgram", LoanProgramSchema);


