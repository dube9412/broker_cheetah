const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dns = require("dns");  // ✅ Move this to the top!

// ✅ Set DNS to prioritize IPv4 (Google & Cloudflare DNS)
dns.setServers(["8.8.8.8", "1.1.1.1"]);
dns.setDefaultResultOrder("ipv4first");  // This ensures DNS works properly.

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";  // Ignore SSL issues (critical for `mongodb+srv`).

const scraperRoutes = require('./routes/scraperRoutes');
const authRoutes = require("./routes/auth");
const lenderRoutes = require("./routes/lender");
const loanProgramRoutes = require("./routes/loanPrograms"); 
const fixAndFlipRoutes = require("./routes/fixAndFlipRoutes");
const dscrRoutes = require("./routes/dscrRoutes");
const groundUpRoutes = require("./routes/groundUpRoutes");
const stabilizedBridgeRoutes = require("./routes/stabilizedBridgeRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");

const app = express();

app.use(cors());
app.use(express.json());


// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));



  app.use('/api/scraper', scraperRoutes);

// ✅ Load Routes Correctly
app.use("/api/auth", authRoutes);
app.use("/api/lenders", lenderRoutes);
app.use("/api/loan-programs", loanProgramRoutes); // ✅ Fixed here
app.use("/api/fix-and-flip", fixAndFlipRoutes);  // Fix and Flip programs
app.use("/api/dscr", dscrRoutes);                // DSCR programs
app.use("/api/ground-up", groundUpRoutes);
app.use("/api/stabilized-bridge", stabilizedBridgeRoutes);
app.use("/api/portfolio", portfolioRoutes);

// ✅ Debug: List all available routes after mounting
app.use((req, res, next) => {
    console.log("✅ Route Hit:", req.method, req.originalUrl);
    next();
});

// ✅ Log All Available Routes
console.log("✅ Available Routes:");
setTimeout(() => {
    app._router.stack
        .filter(r => r.route)
        .forEach(r => {
            console.log(`✅ ${Object.keys(r.route.methods).join(", ").toUpperCase()} ${r.route.path}`);
        });
}, 1000);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
