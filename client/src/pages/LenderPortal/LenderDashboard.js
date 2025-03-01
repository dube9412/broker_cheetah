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
        if (!lenderUserInfo || !lenderUserInfo.lenderId) return; // 🔥 Wait until we have lenderId

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

    if (!lenderInfo) {
        return (
            <div className="lender-dashboard">
                <h2>Welcome to Your Lender Portal</h2>
                <p style={{ color: "red", fontWeight: "bold" }}>❌ No lender assigned to this account.</p>
                <button 
                    onClick={() => {
                        logoutLender();
                        navigate("/lender/login"); // ✅ Redirect to login
                    }} 
                    style={{ backgroundColor: "red", color: "white", marginTop: "20px" }}>
                    Logout
                </button>
            </div>
        );
    }

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
                    <tr>
                        <td>{lenderInfo.name}</td>
                        <td>{lenderInfo.website || "N/A"}</td>
                        <td>{lenderInfo.portalAddress || "N/A"}</td>
                        <td>{lenderInfo.contactName || "N/A"}</td>
                        <td>{lenderInfo.phone || "N/A"}</td>
                        <td>{lenderInfo.email || "N/A"}</td>
                        <td>
                            <Link to={`/edit-lender/${lenderInfo._id}?returnTo=/lender/dashboard`}><button>Edit</button></Link> {" | "}
                            <Link to={`/manage-loan-programs/${lenderInfo._id}?returnTo=/lender/dashboard`}><button>Manage Loan Programs</button></Link>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default LenderDashboard;



