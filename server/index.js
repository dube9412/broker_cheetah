const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// ✅ Import routes correctly
const authRoutes = require("./routes/auth");
const lenderRoutes = require("./routes/lender");
const loanProgramRoutes = require("./routes/loanPrograms"); 

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/brokerCheetahDB", {})
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Load Routes Correctly
app.use("/api/auth", authRoutes);
app.use("/api/lenders", lenderRoutes);
app.use("/api/loan-programs", loanProgramRoutes); // ✅ Fixed here

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
