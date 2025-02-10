const mongoose = require("mongoose");

const PortfolioLoanSchema = new mongoose.Schema({
  lender: { type: mongoose.Schema.Types.ObjectId, ref: "Lender", required: true },
  name: { type: String, default: "Portfolio Loan" },
  maxLTV: Number,
  minLoanAmount: Number,
  maxLoanAmount: Number,
  loanTerm: Number,
  minFICO: Number,
  maxPortfolioSize: Number,
  propertyTypesAllowed: [String],
  tiers: [
    {
      minFICO: Number,
      maxLTV: Number,
      maxPortfolioSize: Number,
    },
  ],
});

module.exports = mongoose.model("PortfolioLoan", PortfolioLoanSchema);
