// src/pages/admin/AdminLenderApprovals.js
import React, { useState, useEffect } from "react";

const AdminLenderApprovals = () => {
  const [pendingLenders, setPendingLenders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPendingLenders = async () => {
      try {
        const response = await fetch(
          "https://broker-cheetah-backend.onrender.com/api/admin/pending-lenders"
        );
        const data = await response.json();
        if (response.ok) {
          setPendingLenders(data);
        } else {
          console.error("Error fetching pending lender edits:", data.message);
        }
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    fetchPendingLenders();
  }, []);

  const handleApprove = async (lenderId, field, newValue) => {
    try {
      const response = await fetch(
        `https://broker-cheetah-backend.onrender.com/api/admin/approve-lender-edit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lenderId, field, newValue }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setMessage(`Approved change for ${field}`);
        setPendingLenders((prev) =>
          prev.map((lender) =>
            lender._id === lenderId
              ? {
                  ...lender,
                  [field]: newValue, // ✅ Update UI with approved value
                  pendingEdits: { ...lender.pendingEdits, [field]: null }, // ✅ Remove pending field
                }
              : lender
          )
        );
      } else {
        setMessage("Error approving change.");
      }
    } catch (error) {
      console.error("Approval error:", error);
      setMessage("Error approving change.");
    }
  };

  const handleReject = async (lenderId, field) => {
    try {
      const response = await fetch(
        `https://broker-cheetah-backend.onrender.com/api/admin/reject-lender-edit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lenderId, field }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setMessage(`Rejected change for ${field}`);
        setPendingLenders((prev) =>
          prev.map((lender) =>
            lender._id === lenderId
              ? {
                  ...lender,
                  pendingEdits: { ...lender.pendingEdits, [field]: null }, // ✅ Remove pending field
                }
              : lender
          )
        );
      } else {
        setMessage("Error rejecting change.");
      }
    } catch (error) {
      console.error("Rejection error:", error);
      setMessage("Error rejecting change.");
    }
  };

  return (
    <div className="admin-lender-approvals">
      <h2>Pending Lender Edits</h2>

      {message && <p>{message}</p>}

      {pendingLenders.length === 0 ? (
        <p>No pending lender edits.</p>
      ) : (
        pendingLenders.map((lender) => (
          <div key={lender._id} className="lender-approval-card">
            <h3>{lender.companyName}</h3>
            <p>Lender ID: {lender._id}</p>

            {Object.entries(lender.pendingEdits || {}).map(([field, newValue]) =>
              newValue ? (
                <div key={field} className="edit-entry">
                  <strong>{field}</strong>: {lender[field]} → <span className="new-value">{newValue}</span>
                  <button onClick={() => handleApprove(lender._id, field, newValue)}>Approve</button>
                  <button onClick={() => handleReject(lender._id, field)}>Reject</button>
                </div>
              ) : null
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default AdminLenderApprovals;
