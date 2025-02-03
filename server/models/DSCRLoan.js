const mongoose = require("mongoose");

const DSCRLoanSchema = new mongoose.Schema({
  lenderId: { type: mongoose.Schema.Types.ObjectId, ref: "Lender" },
  name: String,
  tiers: [
    {
      tier: Number,
      fico: Number,
      experience: Number,
      minDSCRRatio: Number,  // Instead of ARV, DSCR uses this
      maxLTV: Number,        // Loan-To-Value instead of LTP
      minLoan: Number,
      maxLoan: Number,
    },
  ],
});

module.exports = mongoose.model("DSCRLoan", DSCRLoanSchema);
