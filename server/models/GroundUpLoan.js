const mongoose = require("mongoose");

const GroundUpLoanSchema = new mongoose.Schema({
  lender: { type: mongoose.Schema.Types.ObjectId, ref: "Lender", required: true },
  name: { type: String, default: "Ground Up Construction Loan" },
  minFICO: { type: Number, required: true },
  experienceRequired: { type: Number, required: true },  // More explicit name
  maxLTV: { type: Number, required: true },
  maxLTC: { type: Number },
  minLoanAmount: { type: Number, required: true },
  maxLoanAmount: { type: Number },
  termMonths: { type: Number, required: true },
  constructionBudget: { type: mongoose.Schema.Types.Decimal128 },
  propertyTypesAllowed: { type: [String], default: [] },  // Default to an empty array
  tiers: [
    {
      minFICO: Number,
      maxLTV: Number,
      maxLTC: Number,
      experience: Number,  // Consider `experienceMonths` for consistency
    },
  ],
});

module.exports = mongoose.model("GroundUpLoan", GroundUpLoanSchema);

