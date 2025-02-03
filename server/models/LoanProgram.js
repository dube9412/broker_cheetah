const mongoose = require("mongoose");

const LoanProgramSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lenderId: { type: mongoose.Schema.Types.ObjectId, ref: "Lender", required: true },
  tiers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tier" }],
});

module.exports = mongoose.model("LoanProgram", LoanProgramSchema);
