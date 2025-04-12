import React, { useState } from "react";

const LenderPasswordReset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/lender-auth/password-reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Password reset email sent successfully.");
      } else {
        setMessage(data.message || "Failed to send password reset email.");
      }
    } catch (error) {
      console.error("Error requesting password reset:", error);
      setMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div>
      <h2>Lender Password Reset</h2>
      <form onSubmit={handleSubmit}>
        <label>Email Address:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Request Reset</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default LenderPasswordReset;