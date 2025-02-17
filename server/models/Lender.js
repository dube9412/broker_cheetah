const mongoose = require("mongoose");

const LenderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  states: [String],
  brokersLicenseOnlyStates: [String],
  brokerFriendly: { type: Boolean, default: false },
  portalAddress: { type: String, default: "" },
  contactName: { type: String, default: "" },
  phone: { type: String, default: "" },
  email: { type: String, default: "" },
  website: { type: String, default: "" },
  whiteLabelPaperwork: { type: Boolean, default: false },
  whiteLabelFundingTPO: { type: Boolean, default: false },
  proofOfFundsLetters: { type: Boolean, default: false },
  proofOfFundsNotes: { type: String, default: "" },
  assumable: { type: Boolean, default: false },
  bkFcSsDil: { type: Number, default: null },
  backgroundLimitations: [String],
  loanPrograms: [{ type: mongoose.Schema.Types.ObjectId, ref: "LoanProgram" }],

  // ✅ Fix: Add a reference to Fix and Flip Loan Programs
  fixAndFlipPrograms: [{ type: mongoose.Schema.Types.ObjectId, ref: "FixAndFlipLoan" }],
});

const Lender = mongoose.models.Lender || mongoose.model("Lender", LenderSchema);

module.exports = Lender;

