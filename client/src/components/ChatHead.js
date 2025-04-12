import React, { useState } from "react";
import logo from "../assets/logo.png"; // Import the Broker Cheetah logo

const ChatHead = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      let data;
      try {
        data = await response.json();
      } catch (error) {
        console.error("Error parsing JSON response:", error);
        setMessages((prev) => [...prev, { role: "assistant", content: "An error occurred. Please try again later." }]);
        return;
      }

      if (response.ok) {
        const botMessage = { role: "assistant", content: data.reply };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        console.error("Error from GPT API:", data.message);
        setMessages((prev) => [...prev, { role: "assistant", content: data.message || "An error occurred." }]);
      }
    } catch (error) {
      console.error("Error communicating with GPT API:", error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Failed to connect to the server. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", bottom: "20px", right: "20px" }}>
      {!isOpen && (
        <img
          src={logo}
          alt="Chat Head"
          onClick={toggleChat}
          style={{
            width: "60px",
            height: "60px",
            cursor: "pointer",
            borderRadius: "50%",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#FFC107", // Cheetah-themed yellow
            border: "2px solid #FF6F00", // Cheetah-themed orange
          }}
        />
      )}

      {isOpen && (
        <div
          style={{
            width: "300px",
            background: "#FFF8E1", // Light cheetah-themed background
            border: "1px solid #FF6F00",
            borderRadius: "10px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "10px", maxHeight: "400px", overflowY: "auto" }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "10px",
                  textAlign: msg.role === "user" ? "right" : "left",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    padding: "10px",
                    borderRadius: "10px",
                    background: msg.role === "user" ? "#FF6F00" : "#FFF3E0",
                    color: msg.role === "user" ? "white" : "black",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && <div>Loading...</div>}
          </div>
          <div style={{ display: "flex", borderTop: "1px solid #FF6F00" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              style={{ flex: 1, padding: "10px", border: "none", outline: "none" }}
            />
            <button
              onClick={sendMessage}
              style={{
                padding: "10px",
                background: "#FF6F00",
                color: "white",
                border: "none",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHead;