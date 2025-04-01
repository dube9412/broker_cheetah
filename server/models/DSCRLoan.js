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

    homeValue: { type: Number }, // Add home value
    purchasePrice: { type: Number }, // Add purchase price
    loanTermYears: { type: Number, enum: [15, 20, 25, 30, 40] }, // Add loan term

    dscrInputs: {
      currentRent: { type: Number },
      marketRent: { type: Number },
      taxes: { type: Number },
      insurance: { type: Number },
      hoaFees: { type: Number },
    },
  },
  { timestamps: true }
);

const DSCRLoan = mongoose.model("DSCRLoan", DscrLoanSchema);
module.exports = DSCRLoan;
