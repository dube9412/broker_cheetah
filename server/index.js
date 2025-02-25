const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// ✅ Import routes correctly
const adminRoutes = require("./routes/admin/admin"); //  Admin routes
const authRoutes = require("./routes/auth");        // General user/admin auth
const lenderRoutes = require('./routes/lenders');   // Lender *companies*
const lenderAuthRoutes = require("./routes/lenderAuth"); // Lender *user* auth
const loanProgramRoutes = require("./routes/loanPrograms");
const fixAndFlipRoutes = require("./routes/fixAndFlipRoutes");
const dscrRoutes = require("./routes/dscrRoutes");
const groundUpRoutes = require("./routes/groundUpRoutes");
const stabilizedBridgeRoutes = require("./routes/stabilizedBridgeRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const documentRoutes = require('./routes/documentRoutes');
const lenderUserRoutes = require('./routes/lenderUsers'); // Individual lender *user* data
const scraperRoutes = process.env.HOST_ENV !== "render" ? require("./routes/scraperRoutes") : null;//added for render

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
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected using MONGO_URI"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));


// ✅ API Routes
app.use("/api/admin", adminRoutes);         // Admin routes (including lender user management by admins)
app.use("/api/auth", authRoutes);           // General user/admin auth
app.use("/api/lenders", lenderRoutes);  // Lender *companies* (list of lenders)
app.use("/api/lender", lenderAuthRoutes);    // Lender *user* signup/login
app.use("/api/loan-programs", loanProgramRoutes);
app.use("/api/fix-and-flip", fixAndFlipRoutes);
app.use("/api/dscr", dscrRoutes);
app.use("/api/ground-up", groundUpRoutes);
app.use("/api/stabilized-bridge", stabilizedBridgeRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/lender-users', lenderUserRoutes); // Individual lender *user* data (for LenderDashboard)
if (scraperRoutes) {
  app.use("/api/scraper", scraperRoutes);
}
app.use('/uploads', express.static('uploads'));//serve logo

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