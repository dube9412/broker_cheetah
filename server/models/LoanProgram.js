const mongoose = require("mongoose");
const { FixAndFlipSchema, DSCRSchema, GroundUpSchema, StabilizedBridgeSchema, BaseTierSchema } = require("../../client/src/components/Tier"); // Correct path to your Tier schemas

// Define your Tier models *here*, in LoanProgram.js
const FixAndFlipTier = mongoose.model("FixAndFlipTier", FixAndFlipSchema);
const DSCRTier = mongoose.model("DSCRTier", DSCRSchema);
const GroundUpTier = mongoose.model("GroundUpTier", GroundUpSchema);
const StabilizedBridgeTier = mongoose.model("StabilizedBridgeTier", StabilizedBridgeSchema);


const LoanProgramSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lender: { type: mongoose.Schema.Types.ObjectId, ref: "Lender", required: true }, // Correct field name: lender
    type: { type: String, required: true },
    tiers: [{
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'type' // Dynamically reference the correct Tier model
    }]
}, { timestamps: true }); // Add timestamps for better data management

const LoanProgram = mongoose.model("LoanProgram", LoanProgramSchema);

module.exports = { // Export all models
    FixAndFlipTier,
    DSCRTier,
    GroundUpTier,
    StabilizedBridgeTier,
    LoanProgram,
};