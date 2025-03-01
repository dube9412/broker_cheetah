// src/pages/LenderPortal/LenderDashboard.js
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LenderAuthContext } from "../../context/LenderAuthContext"; // ✅ Import context

const LenderDashboard = () => {
    const navigate = useNavigate();
    const { lenderUserId, logoutLender } = useContext(LenderAuthContext); // ✅ Context
    
    const [lenderUserInfo, setLenderUserInfo] = useState(null); // ✅ Store lender user info
    const [lenderInfo, setLenderInfo] = useState(null); // ✅ Store lender details
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token || !lenderUserId) {
            logoutLender();
            navigate("/lender/login");
            return;
        }

        // ✅ Fetch Lender User Info First (To Get lenderId)
        const fetchLenderUserInfo = async () => {
            try {
                console.log("🔍 Fetching Lender User Info:", lenderUserId);
                const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/lender-users/${lenderUserId}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    console.log("✅ Lender User Data:", data);
                    setLenderUserInfo(data.lenderUser); // ✅ Store lender user info
                } else {
                    console.error("❌ Fetch Lender User Error:", data.message);
                    setError(data.message || "Error fetching lender user details.");
                    return;
                }
            } catch (err) {
                console.error("❌ API Error Fetching Lender User:", err);
                setError("Server error fetching lender user.");
                return;
            }
        };

        fetchLenderUserInfo();
    }, [lenderUserId, navigate, logoutLender]);

    // ✅ Fetch Lender Info using lenderId (After lenderUserInfo is fetched)
    useEffect(() => {
        if (!lenderUserInfo) return; // 🔥 Wait until lenderUserInfo is loaded

        if (!lenderUserInfo.lenderId) {
            console.error("❌ No lenderId found for this user.");
            setError("No lender assigned to this account.");
            return;
        }

        const fetchLenderInfo = async () => {
            try {
                console.log("🔍 Fetching Lender Info for:", lenderUserInfo.lenderId);
                const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/lenders/${lenderUserInfo.lenderId}`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    console.log("✅ Lender Data:", data);
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
    }, [lenderUserInfo]);

    if (loading) return <p>Loading lender data...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div className="lender-dashboard">
            <h2>Welcome to Your Lender Portal</h2>

            <h3>Lenders</h3>
            <table border="1" cellPadding="6" style={{ marginTop: "1rem" }}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Website</th>
                        <th>Portal</th>
                        <th>Contact</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {lenderInfo ? (
                        <tr key={lenderInfo._id}>
                            <td>{lenderInfo.name}</td>
                            <td>
                                {lenderInfo.website ? (
                                    <a href={lenderInfo.website} target="_blank" rel="noopener noreferrer">
                                        {lenderInfo.website}
                                    </a>
                                ) : "N/A"}
                            </td>
                            <td>
                                {lenderInfo.portalAddress ? (
                                    <a href={lenderInfo.portalAddress} target="_blank" rel="noopener noreferrer">
                                        {lenderInfo.portalAddress}
                                    </a>
                                ) : "N/A"}
                            </td>
                            <td>{lenderInfo.contactName || "N/A"}</td>
                            <td>{lenderInfo.phone || "N/A"}</td>
                            <td>
                                {lenderInfo.email ? (
                                    <a href={`mailto:${lenderInfo.email}`}>{lenderInfo.email}</a>
                                ) : "N/A"}
                            </td>
                            <td>
                                <Link to={`/lender/edit-lender/${lenderInfo._id}`}>
                                    <button>Edit</button>
                                </Link>{" "}
                                |{" "}
                                <button onClick={() => navigate(`/lender/manage-loan-programs/${lenderInfo._id}`)}>
                                    Manage Loan Programs
                                </button>
                            </td>
                        </tr>
                    ) : (
                        <tr>
                            <td colSpan="7">No lender assigned to this account.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <button onClick={logoutLender} style={{ backgroundColor: "red", color: "white", marginTop: "20px" }}>
                Logout
            </button>
        </div>
    );
};

export default LenderDashboard;


