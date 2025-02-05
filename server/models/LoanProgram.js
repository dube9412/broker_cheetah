const mongoose = require("mongoose");

const LoanProgramSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    lender: { type: mongoose.Schema.Types.ObjectId, ref: "Lender", required: true },
    type: { type: String, required: true },
    // tiers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tier" }], // Comment out the tiers field
  },
  { timestamps: true },
);

const LoanProgram = mongoose.model("LoanProgram", LoanProgramSchema);

module.exports = LoanProgram;