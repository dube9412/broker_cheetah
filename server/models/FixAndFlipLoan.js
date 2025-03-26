const mongoose = require("mongoose");

const FixAndFlipLoanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    lender: { type: mongoose.Schema.Types.ObjectId, ref: "Lender", required: true },
    type: { type: String, required: true }, // Should always be "Fix and Flip"

    // 🔹 Base-Level Fields
    propertyTypes: {
      type: [String],
      enum: ["Single Family 1-4", "Condo", "Townhome", "Manufactured", "Cabins"],
      default: [],
    },
    experienceWindowMonths: { type: Number },
    minAsIsValue: { type: Number },

    recourse: {
        recourse: { type: Boolean, default: false },
        nonRecourse: { type: Boolean, default: false },
    },
    interestType: {
        dutch: { type: Boolean, default: false },
        nonDutch: { type: Boolean, default: false },
    },
    drawType: {
        self: { type: Boolean, default: false },
        thirdParty: { type: Boolean, default: false },
    },
    crossCollateralAllowed: {
        type: String,
        enum: ["yes", "no"],
        default: "no",
    },
    termLength: { type: Number }, // in months

    // 🔸 Tier-Level Fields
    tiers: [
      {
        tierName: { type: String },

        minFICO: { type: Number },
        minExperience: { type: Number },

        loanRange: {
          min: { type: Number },
          max: { type: Number },
        },

        rehabPercent: { type: Number }, // Percent of rehab costs covered
        maxLTC: { type: Number },       // Loan to purchase/cost
        totalLTC: { type: Number },     // Blended LTC
        maxARV: { type: Number },       // ARV Cap
      },
    ],
  },
  { timestamps: true }
);

const FixAndFlipLoan =
  mongoose.models.FixAndFlipLoan || mongoose.model("FixAndFlipLoan", FixAndFlipLoanSchema);

module.exports = FixAndFlipLoan;
