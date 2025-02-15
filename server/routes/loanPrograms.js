// loanPrograms.js
const express = require("express");
const router = express.Router();
const fixAndFlipRoutes = require("./fixAndFlipRoutes");
const dscrRoutes = require("./dscrRoutes");
const portfolioRoutes = require("./portfolioRoutes");
const groundUpRoutes = require("./groundUpRoutes");
const stabilizedBridgeRoutes = require("./stabilizedBridgeRoutes");

// ✅ Simplified route structure
router.use("/fix-and-flip-programs", fixAndFlipRoutes);  // Fix and Flip Loan Program Routes
router.use("/dscr-programs", dscrRoutes);  // DSCR Loan Program Routes
router.use("/portfolio-programs", portfolioRoutes);  // Portfolio Loan Program Routes
router.use("/ground-up-programs", groundUpRoutes);  // Ground Up Loan Program Routes
router.use("/stabilized-bridge-programs", stabilizedBridgeRoutes);  // Stabilized Bridge Loan Program Routes

// ✅ Debugging: List Registered Routes
console.log("✅ Registered Routes in loanPrograms.js:");
router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`✅ ${Object.keys(r.route.methods).join(", ").toUpperCase()} ${r.route.path}`);
  }
});

module.exports = router;
