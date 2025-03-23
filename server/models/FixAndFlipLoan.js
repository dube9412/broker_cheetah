const mongoose = require("mongoose");

const FixAndFlipLoanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    lender: { type: mongoose.Schema.Types.ObjectId, ref: "Lender", required: true },
    type: { type: String, required: true },

    // ✅ Shared Fields Across the Program
    propertyTypes: [
      {
        type: String,
        enum: ["Single Family 1-4", "Condo", "Townhome", "Manufactured", "Cabins"],
      },
    ],
    
    experienceWindowMonths: { type: Number, required: false },
    minAsIsValue: { type: Number, required: false },

    rehabTypeDefinition: {
      method: {
        type: String,
        enum: ["percentage", "sowChecklist"],
        required: false,
      },
      threshold: { type: Number },
      checklistTriggers: [String],
    },

    // ✅ Tiered fields
    tiers: [
      {
        tierName: { type: String, required: false },

        minFICO: { type: Number, required: false },
        minExperience: { type: Number, required: false },

        loanRange: {
          min: { type: Number, required: false },
          max: { type: Number, required: false },
        },

        maxARV: { type: Number, required: false },
        maxRehab: { type: Number, required: false },

        rehabTypeAdjustments: {
          light: {
            maxLTC: { type: Number, required: false },
            totalLTC: { type: Number, required: false },
            maxARV: { type: Number, required: false },
          },
          medium: {
            maxLTC: { type: Number, required: false },
            totalLTC: { type: Number, required: false },
            maxARV: { type: Number, required: false },
          },
          heavy: {
            maxLTC: { type: Number, required: false },
            totalLTC: { type: Number, required: false },
            maxARV: { type: Number, required: false },
          },
        },
      },
    ],
  },
  { timestamps: true }
);

const FixAndFlipLoan =
  mongoose.models.FixAndFlipLoan || mongoose.model("FixAndFlipLoan", FixAndFlipLoanSchema);

module.exports = FixAndFlipLoan;
