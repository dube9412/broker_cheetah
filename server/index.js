const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dns = require("dns");  // ✅ Move this to the top!

// ✅ Set DNS to prioritize IPv4 (Google & Cloudflare DNS)
/*dns.setServers(["8.8.8.8", "1.1.1.1"]);
dns.setDefaultResultOrder("ipv4first");  // This ensures DNS works properly.*/

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://dube9412:dfTtxTuAi2eSZ3ux@brokercheetahdb.rdbel.mongodb.net/?retryWrites=true&w=majority&appName=BrokerCheetahDB";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";  // Ignore SSL issues (critical for `mongodb+srv`).

// ✅ Initialize Express
const app = express();

// ✅ Middleware for CORS and JSON parsing
app.use(cors());
app.use(express.json());
/*
// ✅ MongoDB connection string (manual version, bypassing DNS issues)
const mongoURI = "mongodb://dube9412:dfTtxTuAi2eSZ3ux@brokercheetahdb-shard-00-00.mongodb.net:27017,brokercheetahdb-shard-00-01.mongodb.net:27017,brokercheetahdb-shard-00-02.mongodb.net:27017/?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority";

// ✅ Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));*/

// ✅ Routes
const scraperRoutes = require('./routes/scraperRoutes');
const authRoutes = require("./routes/auth");
const lenderRoutes = require("./routes/lender");
const loanProgramRoutes = require("./routes/loanPrograms"); 
const fixAndFlipRoutes = require("./routes/fixAndFlipRoutes");
const dscrRoutes = require("./routes/dscrRoutes");
const groundUpRoutes = require("./routes/groundUpRoutes");
const stabilizedBridgeRoutes = require("./routes/stabilizedBridgeRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");

// ✅ Register Routes
app.use('/api/scraper', scraperRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/lenders", lenderRoutes);
app.use("/api/loan-programs", loanProgramRoutes);
app.use("/api/fix-and-flip", fixAndFlipRoutes);
app.use("/api/dscr", dscrRoutes);
app.use("/api/ground-up", groundUpRoutes);
app.use("/api/stabilized-bridge", stabilizedBridgeRoutes);
app.use("/api/portfolio", portfolioRoutes);

// ✅ Debug: Log Route Hits
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
const PORT = process.env.PORT || 8080;  // Changed to 8080 to match Railway's default port
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});

