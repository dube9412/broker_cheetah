import React, { useState } from "react";

const ChatHead = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

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

      const data = await response.json();
      if (response.ok) {
        const botMessage = { role: "assistant", content: data.reply };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        console.error("Error from GPT API:", data.message);
      }
    } catch (error) {
      console.error("Error communicating with GPT API:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", bottom: "20px", right: "20px", width: "300px", background: "white", border: "1px solid #ccc", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", overflow: "hidden" }}>
      <div style={{ padding: "10px", maxHeight: "400px", overflowY: "auto" }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: "10px", textAlign: msg.role === "user" ? "right" : "left" }}>
            <div style={{ display: "inline-block", padding: "10px", borderRadius: "10px", background: msg.role === "user" ? "#007BFF" : "#f1f1f1", color: msg.role === "user" ? "white" : "black" }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && <div>Loading...</div>}
      </div>
      <div style={{ display: "flex", borderTop: "1px solid #ccc" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: "10px", border: "none", outline: "none" }}
        />
        <button onClick={sendMessage} style={{ padding: "10px", background: "#007BFF", color: "white", border: "none" }}>Send</button>
      </div>
    </div>
  );
};

export default ChatHead;