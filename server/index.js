const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const verifyToken = require("./middleware/verifyToken");

const adminLenderUserRoutes = require("./routes/admin/admin"); // Update path

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://dube9412:ReGuLaRoLdPaSsWoRd@brokercheetahdb.rdbel.mongodb.net/?retryWrites=true&w=majority&appName=BrokerCheetahDB", {})
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use("/api/admin", verifyToken, adminLenderUserRoutes); // Update path

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
