// src/pages/LenderPortal/LenderDashboard.js
import React, { useState, useEffect, useContext } from "react";
import { LenderAuthContext } from "../../context/LenderAuthContext";
import { useNavigate } from "react-router-dom";

const LenderDashboard = () => {
  const { lenderUserId, isLenderLoggedIn } = useContext(LenderAuthContext);
  const navigate = useNavigate();
  const [lenderInfo, setLenderInfo] = useState(null);
  const [pendingEdits, setPendingEdits] = useState({});
  const [logo, setLogo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isLenderLoggedIn || !lenderUserId) {
      navigate("/lender/login");
      return;
    }

    const fetchLenderInfo = async () => {
      try {
        const response = await fetch(
          `https://broker-cheetah-backend.onrender.com/api/lenders/${lenderUserId}`
        );
        const data = await response.json();
        if (response.ok) {
          setLenderInfo(data);
        } else {
          console.error("Error fetching lender info:", data.message);
        }
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    fetchLenderInfo();
  }, [isLenderLoggedIn, lenderUserId, navigate]);

  const handleEditChange = (e) => {
    setPendingEdits({
      ...pendingEdits,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitEdits = async () => {
    try {
      const response = await fetch(
        `https://broker-cheetah-backend.onrender.com/api/lenders/${lenderUserId}/edit-request`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ updates: pendingEdits }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setMessage("Your changes have been submitted for approval.");
        setPendingEdits({});
      } else {
        setMessage("Error submitting changes.");
      }
    } catch (error) {
      console.error("Edit submission error:", error);
      setMessage("Error submitting changes.");
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    setLogo(file);
    setUploading(true);

    const formData = new FormData();
    formData.append("logo", file);

    try {
      const response = await fetch(
        `https://broker-cheetah-backend.onrender.com/api/lenders/${lenderUserId}/upload-logo`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      if (response.ok) {
        setLenderInfo({ ...lenderInfo, logoUrl: data.logoUrl });
        setMessage("Logo uploaded successfully!");
      } else {
        setMessage("Error uploading logo.");
      }
    } catch (error) {
      console.error("Logo upload error:", error);
      setMessage("Error uploading logo.");
    }

    setUploading(false);
  };

  if (!lenderUserId) {
    return (
      <div className="lender-dashboard">
        <h1>AWAITING ASSIGNMENT CONFIRMATION</h1>
        <p>Please wait for an admin to assign you to a lender.</p>
      </div>
    );
  }

  return (
    <div className="lender-dashboard">
      <h2>Welcome to Your Lender Portal</h2>

      {lenderInfo ? (
        <>
          <div className="lender-info">
            <label>Company Name:</label>
            <input
              type="text"
              name="companyName"
              value={pendingEdits.companyName ?? lenderInfo.companyName}
              onChange={handleEditChange}
            />

            <label>Contact Email:</label>
            <input
              type="email"
              name="contactEmail"
              value={pendingEdits.contactEmail ?? lenderInfo.contactEmail}
              onChange={handleEditChange}
            />

            <label>Phone:</label>
            <input
              type="text"
              name="phone"
              value={pendingEdits.phone ?? lenderInfo.phone}
              onChange={handleEditChange}
            />

            <label>States Operating In:</label>
            <input
              type="text"
              name="states"
              value={pendingEdits.states ?? lenderInfo.states}
              onChange={handleEditChange}
            />

            <button onClick={handleSubmitEdits}>Submit Changes for Approval</button>

            <h3>Company Logo:</h3>
            {lenderInfo.logoUrl && <img src={lenderInfo.logoUrl} alt="Company Logo" />}
            <input type="file" accept="image/*" onChange={handleLogoUpload} disabled={uploading} />
          </div>

          <div className="lender-actions">
            <button onClick={() => navigate("/lender/loan-programs")}>
              Manage Loan Programs
            </button>
            <button onClick={() => navigate("/lender/documents")}>
              Manage Documents
            </button>
          </div>

          {message && <p>{message}</p>}
        </>
      ) : (
        <p>Loading lender information...</p>
      )}
    </div>
  );
};

export default LenderDashboard;

  