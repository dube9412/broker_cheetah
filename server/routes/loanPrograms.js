const express = require("express");
const router = express.Router();
const fixAndFlipRoutes = require("./fixAndFlipRoutes");
const dscrRoutes = require("./dscrRoutes");
const portfolioRoutes = require("./portfolioRoutes");
const groundUpRoutes = require("./groundUpRoutes");
const stabilizedBridgeRoutes = require("./stabilizedBridgeRoutes");


// ✅ Add sub-routes for each loan program type
router.use("/fix-and-flip", fixAndFlipRoutes);  // Fix and Flip Loan Program Routes
router.use("/dscr", dscrRoutes);  // DSCR Loan Program Routes
router.use("/portfolio", portfolioRoutes);  // Portfolio Loan Program Routes
router.use("/ground-up", groundUpRoutes);  // Ground Up Loan Program Routes
router.use("/stabilized-bridge", stabilizedBridgeRoutes);  // Stabilized Bridge Loan Program Routes


// ✅ Debugging: List Registered Routes
console.log("✅ Registered Routes in loanPrograms.js:");
router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`✅ ${Object.keys(r.route.methods).join(", ").toUpperCase()} ${r.route.path}`);
  }
});

module.exports = router;
