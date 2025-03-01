// src/pages/LenderPortal/LenderDashboard.js
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LenderAuthContext } from "../../context/LenderAuthContext"; // ✅ Import context

const LenderDashboard = () => {
    const navigate = useNavigate();
    const { lenderUserId, logoutLender } = useContext(LenderAuthContext); // ✅ Context
    const [lenderInfo, setLenderInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token || !lenderUserId) {
            logoutLender();
            navigate("/lender/login");
            return;
        }

        const fetchLenderInfo = async () => {
            try {
                console.log("🔍 Fetching Lender Info for:", lenderUserId);
                const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/lenders/${lenderUserId}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    setLenderInfo(data);
                } else {
                    console.error("❌ Fetch Lender Error:", data.message);
                    setError(data.message || "Error fetching lender details.");
                }
            } catch (err) {
                console.error("❌ API Error:", err);
                setError("Server error fetching lender details.");
            } finally {
                setLoading(false);
            }
        };

        fetchLenderInfo();
    }, [lenderUserId, navigate, logoutLender]);

    if (loading) return <p>Loading lender data...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div className="lender-dashboard">
            <h2>Welcome to Your Lender Portal</h2>

            <div className="lender-info">
                <h3>Basic Information</h3>
                <p><strong>Company Name:</strong> {lenderInfo.lenderName}</p>
                <p><strong>Portal Website:</strong> <a href={lenderInfo.portalWebsite} target="_blank" rel="noopener noreferrer">{lenderInfo.portalWebsite}</a></p>
                <p><strong>Website:</strong> <a href={lenderInfo.lenderWebsite} target="_blank" rel="noopener noreferrer">{lenderInfo.lenderWebsite}</a></p>
                <p><strong>Contact Name:</strong> {lenderInfo.lenderContactName}</p>
                <p><strong>Email:</strong> {lenderInfo.email}</p>
                <p><strong>Phone:</strong> {lenderInfo.phone}</p>
                <p><strong>States:</strong> {lenderInfo.states?.join(", ") || "N/A"}</p>

                <h3>Loan Settings</h3>
                <p><strong>Broker Friendly:</strong> {lenderInfo.brokerFriendly ? "Yes" : "No"}</p>
                <p><strong>White Label Paperwork:</strong> {lenderInfo.whiteLabelPaperwork ? "Yes" : "No"}</p>
                <p><strong>White Label Funding (TPO):</strong> {lenderInfo.whiteLabelFunding ? "Yes" : "No"}</p>

                <h3>Loan Policies</h3>
                <p><strong>Assumable Loans:</strong> {lenderInfo.assumable ? "Yes" : "No"}</p>
                <p><strong>Background Restrictions:</strong> {lenderInfo.backgroundLimitations}</p>
                <p><strong>Financial Crimes Allowed:</strong> {lenderInfo.financialCrimes ? "Yes" : "No"}</p>
            </div>

            <div className="lender-actions">
                <button onClick={() => navigate(`/lender/edit/${lenderUserId}`)}>Edit Lender Info</button>
                <button onClick={() => navigate(`/lender/loan-programs/${lenderUserId}`)}>Manage Loan Programs</button>
                <button onClick={() => navigate("/lender/documents")}>Manage Documents</button>
                <button onClick={logoutLender} style={{ backgroundColor: "red", color: "white" }}>Logout</button>
            </div>
        </div>
    );
};

export default LenderDashboard;
