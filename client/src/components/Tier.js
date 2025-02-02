// Tier.js (Client-Side - No Mongoose, Only Plain Javascript Objects)

// Base Tier Schema (Plain Javascript Object)
const BaseTierSchema = {
    tier: Number,
    minFICO: Number,
    minExperience: Number,
    minLoan: Number,
    maxLoan: Number,
};

// Fix and Flip Schema (Plain Javascript Object)
const FixAndFlipSchema = {
    ...BaseTierSchema, // Spread operator to inherit fields
    maxLTP: Number,
    totalLTC: Number,
    maxARV: Number,
};

// DSCR Schema (Plain Javascript Object)
const DSCRSchema = {
    ...BaseTierSchema, // Spread operator to inherit fields
    minDSCRRatio: Number,
    maxLTV: Number,
};

// Ground Up Construction Schema (Plain Javascript Object)
const GroundUpSchema = {
    ...BaseTierSchema, // Spread operator to inherit fields
    maxLTC: Number,
};

// Stabilized Bridge Schema (Plain Javascript Object)
const StabilizedBridgeSchema = {
    ...BaseTierSchema, // Spread operator to inherit fields
    maxLTV: Number,
};

module.exports = { // Correct CommonJS export
    FixAndFlipSchema,
    DSCRSchema,
    GroundUpSchema,
    StabilizedBridgeSchema,
    BaseTierSchema,
};