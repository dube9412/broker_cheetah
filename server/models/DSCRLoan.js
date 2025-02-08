const mongoose = require("mongoose");

const DscrLoanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    lender: { type: mongoose.Schema.Types.ObjectId, ref: "Lender", required: true },
    type: { type: String, required: true},
    loanRange: {
      min: { type: Number, required: false },
      max: { type: Number, required: false }
    },    
    propertyTypes: [{ type: String, enum: ["Single Family 1-4", "Condo", "Townhome", "Manufactured", "Cabins"], required: false }],
    propertyUse: { type: String, enum: ["Standard Rental", "Short Term Rental", "Vacant"], required: false },
    prepaymentPeriod: { type: String, required: false },

    tiers: [ // Optional array for tiered programs
      {
        minFICO: { type: Number, required: false },
        experience: { type: Number, required: false },
        maxLTVPurchase: { type: Number, required: false },
        maxLTVRateTerm: { type: Number, required: false },
        maxLTVCashOut: { type: Number, required: false },
        dscrRatioMin: { type: Number, required: false }
      },
    ],
  }, { timestamps: true });

const DSCRLoan = mongoose.model("DSCRLoan", DscrLoanSchema);

module.exports = DSCRLoan;