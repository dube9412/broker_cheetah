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
      const response = await fetch("https://broker-cheetah-backend.onrender.com/api/admin/help-tickets", { // ✅ Ensure correct backend URL
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ issue, desiredOutcome }),
      });

      if (response.status === 405) {
        setMessage("Error: Method Not Allowed. Please contact support.");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error occurred." }));
        setMessage(`Error: ${errorData.message}`);
        return;
      }

      const data = await response.json().catch(() => ({ message: "Help ticket submitted successfully!" }));
      setMessage(data.message);
      setIssue("");
      setDesiredOutcome("");
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
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            type="button"
            onClick={handleCancel}
            style={{ padding: "10px 20px", background: "#6c757d", color: "white", border: "none" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{ padding: "10px 20px", background: "#007BFF", color: "white", border: "none" }}
          >
            Submit
          </button>
        </div>
      </form>
      {message && <p style={{ marginTop: "10px", color: "green" }}>{message}</p>}
    </div>
  );
};

export default SubmitHelpTicket;
