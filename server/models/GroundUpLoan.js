const mongoose = require("mongoose");

const GroundUpLoanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lender: { type: mongoose.Schema.Types.ObjectId, ref: "Lender", required: true },
  type: { type: String, required: true, default: "Ground Up" },
  loanRange: {
    min: { type: Number, required: false },
    max: { type: Number, required: false },
  },
  propertyTypes: [{ type: String, enum: ["Single Family 1-4", "Condo", "Townhome", "Manufactured", "Cabins"], required: false }],
  termMonths: { type: Number, required: false },
  constructionBudget: { type: Number, required: false },
   tiers: [
    {
      minFICO: { type: Number, required: false },
      minExperience: { type: Number, required: false },
      maxLTV: { type: Number, required: false },
      maxLTC: { type: Number, required: false },
      },
  ],
},
{ timestamps: true }
);

const GroundUpLoan = mongoose.model("GroundUpLoan", GroundUpLoanSchema);
module.exports = GroundUpLoan;

