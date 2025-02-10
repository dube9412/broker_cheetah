const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const scraperRoutes = require("./routes/scraperRoutes");

// ✅ Import routes correctly
const authRoutes = require("./routes/auth");
const lenderRoutes = require("./routes/lender");
const loanProgramRoutes = require("./routes/loanPrograms"); 
const fixAndFlipRoutes = require("./routes/fixAndFlipRoutes");
const dscrRoutes = require("./routes/dscrRoutes");
const groundUpRoutes = require("./routes/groundUpRoutes");
const stabilizedBridgeRoutes = require("./routes/stabilizedBridgeRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");

const app = express();

// ✅ Middleware for CORS and JSON parsing
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/brokerCheetahDB", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ API Routes
app.use("/api/scraper", scraperRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/lenders", lenderRoutes);
app.use("/api/loan-programs", loanProgramRoutes);
app.use("/api/fix-and-flip", fixAndFlipRoutes); 
app.use("/api/dscr", dscrRoutes);                
app.use("/api/ground-up", groundUpRoutes);
app.use("/api/stabilized-bridge", stabilizedBridgeRoutes);
app.use("/api/portfolio", portfolioRoutes);

// ✅ Debug: List all available routes after mounting
app.use((req, res, next) => {
  console.log("✅ Route Hit:", req.method, req.originalUrl);
  next();
});

// ✅ Log all available routes in the application
console.log("✅ Available Routes:");
setTimeout(() => {
  app._router.stack
    .filter(r => r.route)
    .forEach(r => {
      console.log(`✅ ${Object.keys(r.route.methods).join(", ").toUpperCase()} ${r.route.path}`);
    });
}, 1000);

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
