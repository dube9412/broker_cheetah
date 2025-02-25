const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const adminLenderUserRoutes = require("./routes/adminLenderUserRoutes");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/brokerCheetahDB", {})
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use("/api/admin-lender-users", adminLenderUserRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
