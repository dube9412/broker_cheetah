import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const AdminLenderUsers = () => {
    const [lenderUsers, setLenderUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAdmin, isSuperAdmin } = useContext(AuthContext);
    const navigate = useNavigate();

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

        fetchLenderUsers();
    }, [isAdmin, isSuperAdmin, navigate]);

    const handleApprove = async (id) => {
        if (!window.confirm("Are you sure you want to approve this lender user?")) return;

        try {
            const response = await fetch(
                `https://broker-cheetah-backend.onrender.com/api/admin-lender-users/${id}/approve`,
                {
                    method: "POST",
                }
            );

            if (response.ok) {
                alert("Lender user approved successfully.");
                setLenderUsers(prevUsers =>
                  prevUsers.map(user =>
                    user._id === id ? { ...user, approved: true, suspended: false } : user
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
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" }
                }
            );
    
            const data = await response.json();
            if (response.ok) {
                alert("Lender user suspended successfully!");
                fetchLenderUsers(); // Refresh the list
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error("Suspend error:", error);
            alert("Failed to suspend lender user.");
        }
    };
    
    const handleReactivate = async (id) => {
        if (!window.confirm("Are you sure you want to reactivate this lender user?")) return;
    
        try {
            const response = await fetch(
                `https://broker-cheetah-backend.onrender.com/api/admin-lender-users/${id}/reactivate`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" }
                }
            );
    
            const data = await response.json();
            if (response.ok) {
                alert("Lender user reactivated successfully!");
                fetchLenderUsers(); // Refresh the list
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error("Reactivate error:", error);
            alert("Failed to reactivate lender user.");
        }
    };
    
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this lender user? This cannot be undone.")) return;
    
        try {
            const response = await fetch(
                `https://broker-cheetah-backend.onrender.com/api/admin-lender-users/${id}`,
                {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" }
                }
            );
    
            const data = await response.json();
            if (response.ok) {
                alert("Lender user deleted successfully!");
                fetchLenderUsers(); // Refresh the list
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete lender user.");
        }
    };
    

    if (loading) return <div>Loading lender users...</div>;

    return (
      <div className="admin-dashboard" style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Admin Lender Users</h1>
      <p>Manage and approve lender users.</p>

      <h2>Pending Lender Users</h2>
<table border="1" cellPadding="6" style={{ marginTop: "1rem" }}>
    <thead>
        <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Lender</th>
            <th>Status</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
    {lenderUsers.filter(user => user.approved === false || user.approved === undefined).length > 0 ? (
    lenderUsers.filter(user => user.approved === false || user.approved === undefined).map((user) => (
                <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.lenderName || "N/A"}</td>
                    <td>Pending</td>
                    <td>
                        <button onClick={() => handleApprove(user._id)}>Approve</button>
                    </td>
                </tr>
            ))
        ) : (
            <tr>
                <td colSpan="5">No pending lender users.</td>
            </tr>
        )}
    </tbody>
</table>

<h2>Active Lender Users</h2>
<table border="1" cellPadding="6" style={{ marginTop: "1rem" }}>
    <thead>
        <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Lender</th>
            <th>Status</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        {lenderUsers.filter(user => user.approved).length > 0 ? (
            lenderUsers.filter(user => user.approved).map((user) => (
                <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.lenderName || "N/A"}</td>
                    <td>{user.suspended ? "Suspended" : "Active"}</td>
                    <td>
                        {user.suspended ? (
                            <button onClick={() => handleReactivate(user._id)}>Reactivate</button>
                        ) : (
                            <button onClick={() => handleSuspend(user._id)}>Suspend</button>
                        )}
                        <button onClick={() => handleDelete(user._id)} style={{ marginLeft: "10px" }}>Delete</button>
                    </td>
                </tr>
            ))
        ) : (
            <tr>
                <td colSpan="5">No active lender users.</td>
            </tr>
        )}
    </tbody>
</table>

export default AdminLenderUsers;
