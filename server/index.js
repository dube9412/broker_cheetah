const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Import your route files
const lenderRoutes = require("./routes/lender");
const loanProgramRoutes = require("./routes/loanPrograms");
//... import other route files

// Connect to MongoDB
//... (your MongoDB connection code)

// Use body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use cors middleware
app.use(cors());

// Use your route files
app.use("/api/lenders", lenderRoutes); // Mount lender routes
app.use("/api/loanPrograms", loanProgramRoutes); // Mount loan program routes
//... mount other route files

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});