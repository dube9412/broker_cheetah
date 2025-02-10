const express = require("express");
const { MongoClient } = require("mongodb");
const router = express.Router();

const uri = "mongodb+srv://dube9412:dfTtxTuAi2eSZ3ux@brokercheetahdb.rdbel.mongodb.net/?retryWrites=true&w=majority&appName=BrokerCheetahDB";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    await client.connect();
    const db = client.db("admin");  // Replace with your actual database name
    const usersCollection = db.collection("users");  // Assuming you have a 'users' collection

    // Find user by email
    const user = await usersCollection.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // If successful login, send a success response
    res.status(200).json({ message: "Login successful" });

  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Server error" });
  } finally {
    await client.close();  // Always close the MongoDB client after use
  }
});

module.exports = router;
