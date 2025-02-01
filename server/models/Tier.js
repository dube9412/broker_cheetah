const mongoose = require("mongoose");

// Base Tier Schema (if you still want it)
const BaseTierSchema = new mongoose.Schema({
  tier: Number,
  minFICO: Number,
  minExperience: Number,
  minLoan: Number,
  maxLoan: Number,
});

// Fix and Flip Schema
const FixAndFlipSchema = new mongoose.Schema({
  ...BaseTierSchema.obj, // Include base fields
  maxLTP: Number,
  totalLTC: Number,
  maxARV: Number,
});

// DSCR Schema
const DSCRSchema = new mongoose.Schema({
  ...BaseTierSchema.obj,
  minDSCRRatio: Number,
  maxLTV: Number,
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
  BaseTierSchema // Export the BaseTierSchema
};

module.exports = mongoose.model("Tier", TierSchema);
