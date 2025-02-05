const mongoose = require("mongoose");

const FixAndFlipLoanSchema = new mongoose.Schema(
    {
        name: { type: String, required: true }, // Name of the loan program (e.g., "Fix and Flip - Tier 1")
        lender: { type: mongoose.Schema.Types.ObjectId, ref: "Lender", required: true }, // Reference to the Lender (assuming you have a Lender model)
        type: { type: String, required: true }, // The type of loan program ("Fix and Flip") - important for querying
        tiers: [ // Array of tiers (each tier has its own set of fields)
            {
                tierName: { type: String, required: true }, // Name of the tier (e.g., "Tier 1", "Tier 2")
                minFICO: { type: Number, required: true },
                minExperience: { type: Number, required: true },
                maxLTP: { type: Number, required: true },
                totalLTC: { type: Number, required: true },
                maxARV: { type: Number, required: true },
                minLoanAmount: { type: Number, required: true },
                maxLoanAmount: { type: Number, required: true },
                //... other tier-specific fields
            },
            // Add more tiers as needed
        ],
    },
    { timestamps: true }, // Add timestamps for creation and update
);

const FixAndFlipLoan = mongoose.model("FixAndFlipLoan", FixAndFlipLoanSchema);

module.exports = FixAndFlipLoan;