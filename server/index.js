const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path"); // ✅ Fix: Require path module

// ✅ Import routes correctly
const adminRoutes = require("./routes/adminRoutes"); // Admin routes
const authRoutes = require("./routes/auth"); // General user/admin auth
const lenderRoutes = require('./routes/lender'); // Lender *companies*
const lenderAuthRoutes = require("./routes/lenderAuth"); // Lender *user* auth
const lenderUserRoutes = require('./routes/lenderUsers'); // Individual lender *user* data
const adminLenderUserRoutes = require("./routes/adminLenderUserRoutes");
const lenderCompanyRoutes = require("./routes/lenderRoutes"); // ✅ Renamed this one to prevent duplication
const loanProgramRoutes = require("./routes/loanPrograms"); 
const fixAndFlipRoutes = require("./routes/fixAndFlipRoutes");
const dscrRoutes = require("./routes/dscrRoutes");
const groundUpRoutes = require("./routes/groundUpRoutes");
const stabilizedBridgeRoutes = require("./routes/stabilizedBridgeRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const documentRoutes = require('./routes/documentRoutes');
const scraperRoutes = process.env.HOST_ENV !== "render" ? require("./routes/scraperRoutes") : null; // Only load scraper in non-render environments
const importJSONRoutes = require("./routes/importJSONRoutes"); // ✅ Import JSON routes

const app = express();

// ✅ Enable CORS for your frontend (Vercel domain)
const corsOptions = {
  origin: 'https://www.brokercheetah.com', // Allow requests from this frontend domain, change on new builds
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// ✅ Middleware for CORS and JSON parsing
app.use(cors(corsOptions));  // Corrected order
app.use(express.json());

// ✅ Connect to MongoDB
mongoose.connect("mongodb+srv://dube9412:ReGuLaRoLdPaSsWoRd@brokercheetahdb.rdbel.mongodb.net/?retryWrites=true&w=majority&appName=BrokerCheetahDB", {})
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ API Routes
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/lenders", lenderRoutes);
app.use("/api/lender-auth", lenderAuthRoutes);
app.use("/api/lender-users", lenderUserRoutes);
app.use("/api/admin-lender-users", adminLenderUserRoutes);
app.use("/api/lender-companies", lenderCompanyRoutes); // ✅ Fixed duplicate route
app.use("/api/loan-programs", loanProgramRoutes);
app.use("/api/fix-and-flip", fixAndFlipRoutes);
app.use("/api/dscr", dscrRoutes);
app.use("/api/ground-up", groundUpRoutes);
app.use("/api/stabilized-bridge", stabilizedBridgeRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/documents", documentRoutes);
if (scraperRoutes) {
  app.use("/api/scrapers", scraperRoutes);
}
app.use("/api/import-json", importJSONRoutes); // ✅ Import JSON routes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// ✅ Debug: List all available routes after mounting
app.use((req, res, next) => {
  console.log(`🔹 Incoming Request: ${req.method} ${req.originalUrl}`);
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
const PORT = process.env.PORT || 5000; // Use 5000 as a fallback
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
