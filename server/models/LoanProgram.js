const mongoose = require("mongoose");

const LoanProgramSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        lender: { type: mongoose.Schema.Types.ObjectId, ref: "Lender", required: true }, // Corrected field name: lender
        type: { type: String, required: true },
        tiers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                refPath: "type",
            },
        ],
    },
    { timestamps: true },
);

const LoanProgram = mongoose.model("LoanProgram", LoanProgramSchema);

module.exports = LoanProgram;