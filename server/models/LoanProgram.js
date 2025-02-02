const mongoose = require("mongoose");

const LoanProgramSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lenderId: { type: mongoose.Schema.Types.ObjectId, ref: "Lender", required: true },
    type: { type: String, required: true }, // Add the 'type' field
    tiers: [{
        type: mongoose.Schema.Types.ObjectId, // Store Tier IDs
        refPath: 'type' // Dynamically reference the correct Tier model
    }]
});

const LoanProgram = mongoose.model("LoanProgram", LoanProgramSchema);

module.exports = LoanProgram;
