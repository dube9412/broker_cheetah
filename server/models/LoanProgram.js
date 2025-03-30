const mongoose = require("mongoose");

const LoanProgramSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    lender: { type: mongoose.Schema.Types.ObjectId, ref: "Lender", required: true },
    type: { type: String, required: true },
    highlightNote: { type: String, default: "" }, // Note for search results
  },
  { timestamps: true },
);

const LoanProgram = mongoose.model("LoanProgram", LoanProgramSchema);

module.exports = LoanProgram;