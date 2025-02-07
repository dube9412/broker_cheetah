const mongoose = require("mongoose");

const DscrLoanSchema = new mongoose.Schema({
    lender: { type: mongoose.Schema.Types.ObjectId, ref: "Lender", required: true },
    minFICO: { type: Number, required: true },
    experience: { type: Number, required: true },
    maxLTVPurchase: { type: Number, required: true },
    maxLTVRateTerm: { type: Number, required: true },
    maxLTVCashOut: { type: Number, required: true },
    minLoanAmount: { type: Number, required: true },
    maxLoanAmount: { type: Number, required: true },
    propertyTypes: [{ type: String, enum: ["Single Family 1-4", "Condo", "Townhome", "Manufactured", "Cabins"], required: true }],
    propertyUse: { type: String, enum: ["Standard Rental", "Short Term Rental", "Vacant"], required: true },
    prepaymentPeriod: { type: String, required: true },
    dscrRatioMin: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("DscrLoanProgram", DscrLoanSchema);

