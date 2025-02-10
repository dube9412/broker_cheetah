const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

// Allow MongoDB connection to bypass SSL verification
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";  // Ignore SSL issues (critical for `mongodb+srv`)

const uri = "mongodb+srv://dube9412:dfTtxTuAi2eSZ3ux@brokercheetahdb.rdbel.mongodb.net/?retryWrites=true&w=majority&appName=BrokerCheetahDB";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

// Initialize Express
const app = express();

// Middleware for CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Routes (just like before)
const scraperRoutes = require("./routes/scraperRoutes");
const authRoutes = require("./routes/auth");
const lenderRoutes = require("./routes/lender");
const loanProgramRoutes = require("./routes/loanPrograms");
const fixAndFlipRoutes = require("./routes/fixAndFlipRoutes");
const dscrRoutes = require("./routes/dscrRoutes");
const groundUpRoutes = require("./routes/groundUpRoutes");
const stabilizedBridgeRoutes = require("./routes/stabilizedBridgeRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");

// Register Routes
app.use("/api/scraper", scraperRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/lenders", lenderRoutes);
app.use("/api/loan-programs", loanProgramRoutes);
app.use("/api/fix-and-flip", fixAndFlipRoutes);
app.use("/api/dscr", dscrRoutes);
app.use("/api/ground-up", groundUpRoutes);
app.use("/api/stabilized-bridge", stabilizedBridgeRoutes);
app.use("/api/portfolio", portfolioRoutes);

// Start Server
const PORT = process.env.PORT || 8080;  // Changed to 8080 to match Railway's default port
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
