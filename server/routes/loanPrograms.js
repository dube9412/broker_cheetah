// loanPrograms.js
const express = require("express");
const router = express.Router();
const fixAndFlipRoutes = require("./fixAndFlipRoutes");
const dscrRoutes = require("./dscrRoutes");
const portfolioRoutes = require("./portfolioRoutes");
const groundUpRoutes = require("./groundUpRoutes");
const stabilizedBridgeRoutes = require("./stabilizedBridgeRoutes");

// Use normalized type names in routes
router.use("/fix-and-flip", fixAndFlipRoutes);
router.use("/dscr", dscrRoutes);
router.use("/portfolio", portfolioRoutes);
router.use("/ground-up", groundUpRoutes);
router.use("/stabilized-bridge", stabilizedBridgeRoutes);

module.exports = router;
