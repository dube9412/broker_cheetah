const mongoose = require("mongoose");
const { FixAndFlipSchema, DSCRSchema, GroundUpSchema, StabilizedBridgeSchema, BaseTierSchema } = require("../../client/src/components/Tier"); // Correct path to your Tier schemas

const LoanProgramSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        lender: { type: mongoose.Schema.Types.ObjectId, ref: "Lender", required: true }, // Add lender field
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

// Define your Tier models *here*, in LoanProgram.js
const FixAndFlipTier = mongoose.model("FixAndFlipTier", FixAndFlipSchema);
const DSCRTier = mongoose.model("DSCRTier", DSCRSchema);
const GroundUpTier = mongoose.model("GroundUpTier", GroundUpSchema);
const StabilizedBridgeTier = mongoose.model("StabilizedBridgeTier", StabilizedBridgeSchema);


module.exports = { // Export all models
    FixAndFlipTier,
    DSCRTier,
    GroundUpTier,
    StabilizedBridgeTier,
    LoanProgram,
};