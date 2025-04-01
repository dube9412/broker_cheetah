const mongoose = require("mongoose");

const GroundUpLoanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    lender: { type: mongoose.Schema.Types.ObjectId, ref: "Lender", required: true },
    type: { type: String, required: true, default: "Ground Up" },

    propertyTypes: {
      type: [String],
      enum: ["Single Family 1-4", "Condo", "Townhome", "Manufactured", "Cabins"],
      default: [],
    },

    arv: { type: Number }, // Add ARV
    termLengthMonths: { type: [Number], enum: [12, 13, 18, 19, 24] }, // Update loan term to checkboxes

    constructionBudget: { type: Number },

    tiers: [
      {
        tierName: { type: String },
        minFICO: { type: Number },
        minExperience: { type: Number },
        loanRange: {
          min: { type: Number },
          max: { type: Number },
        },
        maxLTC: { type: Number },
        totalLTC: { type: Number },
        maxARV: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

const GroundUpLoan =
  mongoose.models.GroundUpLoan || mongoose.model("GroundUpLoan", GroundUpLoanSchema);

module.exports = GroundUpLoan;

