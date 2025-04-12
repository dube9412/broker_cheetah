const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: "Message is required." });
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ OPENAI_API_KEY is not set in the environment variables.");
    return res.status(500).json({ message: "Server configuration error. Please contact support." });
  }

  console.log("🔍 Sending message to OpenAI API:", message);

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    console.log("✅ OpenAI API response:", response.data);

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("❌ Error communicating with OpenAI API:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to communicate with GPT API.", error: error.response?.data || error.message });
  }
});

module.exports = router;