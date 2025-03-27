const mongoose = require("mongoose");

const PortfolioLoanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lender: { type: mongoose.Schema.Types.ObjectId, ref: "Lender", required: true },
  type: { type: String, required: true, default: "Portfolio" },

  loanRange: {
    min: { type: Number, required: false },
    max: { type: Number, required: false },
  },
  propertyTypes: [{ type: String, enum: ["Single Family 1-4", "Condo", "Townhome", "Manufactured", "Cabins"], required: false }],
  termMonths: { type: Number, required: false },
  minLoanTerm: { type: Number, required: false },
  maxLoanTerm: { type: Number, required: false },
  minDSCR: { type: Number, required: false },
  tiers: [
    {
      minFICO: { type: Number, required: false },
      maxLTV: { type: Number, required: false },
      minExperience: { type: Number, required: false },
      maxPortfolioSize: { type: Number, required: false },
    }
  ],
},
  { timestamps: true }
);

const PortfolioLoan = mongoose.model("PortfolioLoan", PortfolioLoanSchema);
module.exports = PortfolioLoan;

