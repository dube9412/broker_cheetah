const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// Import all routes
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/auth");
const lenderRoutes = require("./routes/lender");
const lenderAuthRoutes = require("./routes/lenderAuth");
const lenderUserRoutes = require("./routes/lenderUsers");
const adminLenderUserRoutes = require("./routes/adminLenderUserRoutes");
const lenderCompanyRoutes = require("./routes/lenderRoutes");
const loanProgramRoutes = require("./routes/loanPrograms");
const fixAndFlipRoutes = require("./routes/fixAndFlipRoutes");
const dscrRoutes = require("./routes/dscrRoutes");
const groundUpRoutes = require("./routes/groundUpRoutes");
const stabilizedBridgeRoutes = require("./routes/stabilizedBridgeRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const documentRoutes = require("./routes/documentRoutes");
const scraperRoutes = process.env.HOST_ENV !== "render" ? require("./routes/scraperRoutes") : null;
const importJSONRoutes = require("./routes/importJSONRoutes");
const pipelineRoutes = require("./routes/pipelineRoutes");
const adminHelpTicketRoutes = require("./routes/adminHelpTicketRoutes");
const quoteRoutes = require("./routes/quoteRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

// Enable CORS using corsOptions
const corsOptions = {
  origin: process.env.FRONTEND_URL || "https://www.brokercheetah.com", // Frontend domain
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb+srv://dube9412:ReGuLaRoLdPaSsWoRd@brokercheetahdb.rdbel.mongodb.net/?retryWrites=true&w=majority", {})
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Mount all routes
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/lenders", lenderRoutes);
app.use("/api/lender-auth", lenderAuthRoutes);
app.use("/api/lender-users", lenderUserRoutes);
app.use("/api/admin-lender-users", adminLenderUserRoutes);
app.use("/api/lender-companies", lenderCompanyRoutes);
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
app.use("/api/import-json", importJSONRoutes);
app.use("/api/pipeline", pipelineRoutes);
app.use("/api/admin/help-tickets", adminHelpTicketRoutes);
app.use("/api/quotes", quoteRoutes); // Ensure this is the only route handling /api/quotes
app.use("/api/chat", chatRoutes);

// Serve static files (if applicable)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
