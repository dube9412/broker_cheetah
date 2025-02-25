import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const AdminLenderUsers = () => {
    const [lenderUsers, setLenderUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lenders, setLenders] = useState([]); // For lender dropdown
    const { isAdmin, isSuperAdmin } = useContext(AuthContext);
    const navigate = useNavigate();
    const [selectedLender, setSelectedLender] = useState({});

    useEffect(() => {
        if (!isAdmin && !isSuperAdmin) {
            navigate("/dashboard");
            return;
        }

        const fetchLenderUsers = async () => {
            setLoading(true);
            try {
                const response = await fetch("https://broker-cheetah-backend.onrender.com/api/admin-lender-users");
                const data = await response.json();
                if (response.ok) {
                    setLenderUsers(data);
                } else {
                    console.error("Failed to fetch lender users:", data.message);
                }
            } catch (error) {
                console.error("Error fetching lender users:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchLenders = async () => {
            try {
                const response = await fetch("https://broker-cheetah-backend.onrender.com/api/lenders");
                const data = await response.json();
                if (response.ok) {
                    setLenders(data.lenders);
                } else {
                    console.error("Failed to fetch lenders:", data.message);
                }
            } catch (error) {
                console.error("Error fetching lenders:", error);
            }
        };

        fetchLenderUsers();
        fetchLenders();
    }, [isAdmin, isSuperAdmin, navigate]);

    const handleApprove = async (id) => {
        if (!selectedLender[id]) {
            alert("Please select a lender before approving.");
            return;
        }

        if (!window.confirm("Are you sure you want to approve this lender user?")) return;

        try {
            const response = await fetch(
                `https://broker-cheetah-backend.onrender.com/api/admin-lender-users/${id}/approve`,
                { method: "POST" }
            );

            if (response.ok) {
                alert("Lender user approved successfully.");
                setLenderUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user._id === id ? { ...user, approved: true, lenderId: selectedLender[id] } : user
                    )
                );
            } else {
                alert("Failed to approve lender user.");
            }
        } catch (error) {
            console.error("Error approving lender user:", error);
            alert("An error occurred while approving the lender user.");
        }
    };

    const handleSuspend = async (id) => {
        if (!window.confirm("Are you sure you want to suspend this lender user?")) return;

        try {
            const response = await fetch(
                `https://broker-cheetah-backend.onrender.com/api/admin-lender-users/${id}/suspend`,
                { method: "POST" }
            );

            if (response.ok) {
                alert("Lender user suspended successfully.");
                setLenderUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user._id === id ? { ...user, suspended: true } : user
                    )
                );
            } else {
                alert("Failed to suspend lender user.");
            }
        } catch (error) {
            console.error("Error suspending lender user:", error);
            alert("An error occurred while suspending the lender user.");
        }
    };

    const handleReactivate = async (id) => {
        if (!window.confirm("Are you sure you want to reactivate this lender user?")) return;

        try {
            const response = await fetch(
                `https://broker-cheetah-backend.onrender.com/api/admin-lender-users/${id}/reactivate`,
                { method: "POST" }
            );

            if (response.ok) {
                alert("Lender user reactivated successfully.");
                setLenderUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user._id === id ? { ...user, suspended: false } : user
                    )
                );
            } else {
                alert("Failed to reactivate lender user.");
            }
        } catch (error) {
            console.error("Error reactivating lender user:", error);
            alert("An error occurred while reactivating the lender user.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this lender user? This action cannot be undone.")) return;

        try {
            const response = await fetch(
                `https://broker-cheetah-backend.onrender.com/api/admin-lender-users/${id}`,
                { method: "DELETE" }
            );

            if (response.ok) {
                alert("Lender user deleted successfully.");
                setLenderUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
            } else {
                alert("Failed to delete lender user.");
            }
        } catch (error) {
            console.error("Error deleting lender user:", error);
            alert("An error occurred while deleting the lender user.");
        }
    };

    if (loading) return <div>Loading lender users...</div>;

    return (
        <div className="admin-dashboard" style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1>Admin Lender Users</h1>
            <p>Manage and approve lender users.</p>

            <h2>Pending Approvals</h2>
            <table border="1" cellPadding="6" style={{ marginTop: "1rem" }}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Assign Lender</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {lenderUsers.filter(user => !user.approved).length > 0 ? (
                        lenderUsers.filter(user => !user.approved).map((user) => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <select
                                        onChange={(e) => setSelectedLender({ ...selectedLender, [user._id]: e.target.value })}
                                    >
                                        <option value="">Select Lender</option>
                                        {lenders.map(lender => (
                                            <option key={lender._id} value={lender._id}>{lender.name}</option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <button onClick={() => handleApprove(user._id)}>Approve</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="4">No pending lender users.</td></tr>
                    )}
                </tbody>
            </table>

            <h2>Active Lender Users</h2>
            <table border="1" cellPadding="6" style={{ marginTop: "1rem" }}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {lenderUsers.filter(user => user.approved).map((user) => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.suspended ? "Suspended" : "Active"}</td>
                            <td>
                                {user.suspended ? (
                                    <button onClick={() => handleReactivate(user._id)}>Reactivate</button>
                                ) : (
                                    <button onClick={() => handleSuspend(user._id)}>Suspend</button>
                                )}
                                <button onClick={() => handleDelete(user._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminLenderUsers;

