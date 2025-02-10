const mongoose = require("mongoose");

const StabilizedBridgeLoanSchema = new mongoose.Schema({
  lender: { type: mongoose.Schema.Types.ObjectId, ref: "Lender", required: true },
  name: { type: String, default: "Stabilized Bridge Loan" },
  maxLTV: Number,
  minLoanAmount: Number,
  maxLoanAmount: Number,
  minDSCR: Number,
  loanTerm: Number,
  interestRateRange: String,
  stateAvailability: [String],
  propertyTypesAllowed: [String],
  prepaymentPenalty: String,
  tiers: [
    {
      minFICO: Number,
      maxLTV: Number,
      minDSCR: Number,
    },
  ],
});

module.exports = mongoose.model("StabilizedBridgeLoan", StabilizedBridgeLoanSchema);
