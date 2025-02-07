const mongoose = require("mongoose");

// Base Tier Schema
const BaseTierSchema = new mongoose.Schema({
  tier: Number,
  minFICO: Number,
  minExperience: Number,
  minLoan: Number,
  maxLoan: Number,
});

// Fix and Flip Schema
const FixAndFlipSchema = new mongoose.Schema({
  ...BaseTierSchema.obj,
  maxLTP: Number,
  totalLTC: Number,
  maxARV: Number,
});

// DSCR Schema
const DSCRSchema = new mongoose.Schema({
  ...BaseTierSchema.obj,
  dscrRatioMin: Number,
  maxLTVCashOut: Number,
  maxLTVRateTerm: Number,
  maxLTVPurchase: Number,
  propertyTypes: [String],
  propertyUse: String,
  prepaymentPeriod: String,
  loanRange: {min: Number, max: Number},
});

// Ground Up Construction Schema
const GroundUpSchema = new mongoose.Schema({
  ...BaseTierSchema.obj,
  maxLTC: Number,
});

// Stabilized Bridge Schema
const StabilizedBridgeSchema = new mongoose.Schema({
  ...BaseTierSchema.obj,
  maxLTV: Number,
});

module.exports = {
  FixAndFlipTier: mongoose.model("FixAndFlipTier", FixAndFlipSchema),
  DSCRTier: mongoose.model("DSCRTier", DSCRSchema),
  GroundUpTier: mongoose.model("GroundUpTier", GroundUpSchema),
  StabilizedBridgeTier: mongoose.model("StabilizedBridgeTier", StabilizedBridgeSchema),
};
