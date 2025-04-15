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
    crossCollateralAllowed: { type: Boolean },
    setting: { type: String, enum: ["Rural", "Non-Rural"], default: "Non-Rural" }, // Renamed from 'rural' to 'setting'

    termLengthMonths: { type: [Number], default: [] }, // Update to array for multiple term lengths

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

        maxLTC: { type: Number },       // Loan to purchase/cost
        totalLTC: { type: Number },     // Blended LTC
        maxARV: { type: Number },       // ARV Cap
        rehabPercent: { type: Number }, // Percent of rehab costs covered
        maxRehabBudget: { type: Number, default: 0 }, // Add maxRehabBudget field
      },
    ],
  },
  { timestamps: true }
);

const FixAndFlipLoan =
  mongoose.models.FixAndFlipLoan || mongoose.model("FixAndFlipLoan", FixAndFlipLoanSchema);

module.exports = FixAndFlipLoan;
