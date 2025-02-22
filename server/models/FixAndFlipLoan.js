const mongoose = require("mongoose");

const FixAndFlipLoanSchema = new mongoose.Schema(
    {
        name: { type: String, required: true }, 
        lender: { type: mongoose.Schema.Types.ObjectId, ref: "Lender", required: true }, 
        type: { type: String, required: true }, 

        loanRange: {
            min: { type: Number, required: false },  // Ensure this is a number
            max: { type: Number, required: false },  // Ensure this is a number
          },

          propertyTypes: [{ type: String, enum: ["Single Family 1-4", "Condo", "Townhome", "Manufactured", "Cabins"], required: false }],
          

        // ✅ Ensure all fields exist
        minFICO: { type: Number, required: false },
        minExperience: { type: Number, required: false },
        maxLTP: { type: Number, required: false },
        totalLTC: { type: Number, required: false },
        maxARV: { type: Number, required: false },
        maxRehab: {type: Number, required: false},
        

        tiers: [ // Optional array for tiered programs
            {
                tierName: { type: String, required: false },
                minFICO: { type: Number, required: false },
                minExperience: { type: Number, required: false },
                maxLTP: { type: Number, required: false },
                totalLTC: { type: Number, required: false },
                maxARV: { type: Number, required: false },
                maxRehab: {type: Number, required: false},
               
            },
        ],
    },
    { timestamps: true }
);

const FixAndFlipLoan = mongoose.model("FixAndFlipLoan", FixAndFlipLoanSchema);

module.exports = FixAndFlipLoan;
