const mongoose = require("mongoose");

const FixAndFlipLoanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    lender: { type: mongoose.Schema.Types.ObjectId, ref: "Lender", required: true },
    type: { type: String, required: true }, // Add the 'type' field
    tiers: [
      {
        tierName: { type: String, required: true },
        minFICO: { type: Number, required: true },
        minExperience: { type: Number, required: true },
        maxLTP: { type: Number, required: true },
        totalLTC: { type: Number, required: true },
        maxARV: { type: Number, required: true },
        minLoanAmount: { type: Number, required: true },
        maxLoanAmount: { type: Number, required: true },
        //... other tier fields you might need
      },
    ],
  },
  { timestamps: true },
);

const FixAndFlipLoan = mongoose.model("FixAndFlipLoan", FixAndFlipLoanSchema);

module.exports = FixAndFlipLoan;