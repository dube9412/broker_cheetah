const mongoose = require("mongoose");

const DscrLoanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    lender: { type: mongoose.Schema.Types.ObjectId, ref: "Lender", required: true },
    type: { type: String, required: true, default: "DSCR" },

    loanRange: {
      min: { type: Number, required: false },
      max: { type: Number, required: false },
    },

    propertyTypes: {
      type: [String],
      enum: ["Single Family 1-4", "Condo", "Townhome", "Manufactured", "Cabins"],
      default: [],
    },

    propertyUse: {
      type: String,
      enum: ["Standard Rental", "Short Term Rental", "Vacant"],
    },

    prepaymentPeriod: {
      type: String,
    },

    dscrInputs: {
      currentRent: { type: Number },
      marketRent: { type: Number },
      taxes: { type: Number },
      insurance: { type: Number },
      hoaFees: { type: Number },
    },

    tiers: [
      {
        minFICO: { type: Number },
        minExperience: { type: Number },
        maxLTVPurchase: { type: Number },
        maxLTVRateTerm: { type: Number },
        maxLTVCashOut: { type: Number },
        dscrRatioMin: { type: Number },
      }
    ],
  },
  { timestamps: true }
);

const DSCRLoan = mongoose.model("DSCRLoan", DscrLoanSchema);
module.exports = DSCRLoan;
