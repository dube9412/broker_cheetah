const mongoose = require("mongoose");

const StabilizedBridgeLoanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lender: { type: mongoose.Schema.Types.ObjectId, ref: "Lender", required: true },
  type: { type: String, required: true, default: "Stabilized Bridge" },
  loanRange: {
    min: { type: Number, required: false },
    max: { type: Number, required: false },
  },
  propertyTypes: [{ type: String, enum: ["Single Family 1-4", "Condo", "Townhome", "Manufactured", "Cabins"], required: false }],
  termMonths: { type: Number, required: false },
  rehabComplete: { type: Boolean, default: false }, // Add rehabComplete field
  rehabRemaining: { type: Number, required: false }, // Add rehabRemaining field
  tiers: [
    {
      minFICO: { type: Number, required: false },
      maxLTV: { type: Number, required: false },
      minExperience: { type: Number, required: false },      
      minDSCR: { type: Number, required: false },
    }
  ],
},
{ timestamps: true }
);

const StabilizedBridgeLoan = mongoose.model("StabilizedBridgeLoan", StabilizedBridgeLoanSchema);
module.exports = StabilizedBridgeLoan;