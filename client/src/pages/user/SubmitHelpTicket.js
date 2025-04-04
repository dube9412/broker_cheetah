import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SubmitHelpTicket = () => {
  const [issue, setIssue] = useState("");
  const [desiredOutcome, setDesiredOutcome] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/help-tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ issue, desiredOutcome }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Help ticket submitted successfully!");
        setIssue("");
        setDesiredOutcome("");
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error submitting help ticket:", error);
      setMessage("Failed to submit help ticket.");
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Submit a Help Ticket</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "0 auto" }}>
        <div style={{ marginBottom: "10px" }}>
          <label>Issue:</label>
          <textarea
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            required
            style={{ width: "100%", height: "100px", padding: "8px", margin: "5px 0" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Desired Outcome:</label>
          <textarea
            value={desiredOutcome}
            onChange={(e) => setDesiredOutcome(e.target.value)}
            required
            style={{ width: "100%", height: "100px", padding: "8px", margin: "5px 0" }}
          />
        </div>
  );
};

export default SubmitHelpTicket;
