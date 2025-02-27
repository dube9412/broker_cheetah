import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const AdminLenderUsers = () => {
    const [lenderUsers, setLenderUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAdmin, isSuperAdmin } = useContext(AuthContext);
    const navigate = useNavigate();
    const [selectedLender, setSelectedLender] = useState({}); // Stores selected lenders for assignment
const [lenders, setLenders] = useState([]); // Stores available lenders
const [message, setMessage] = useState(""); // Stores success/error messages


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

    useEffect(() => {
        const fetchLenders = async () => {
            try {
                const response = await fetch("https://broker-cheetah-backend.onrender.com/api/lenders");
                const data = await response.json();
                if (response.ok) {
                    setLenders(data);
                } else {
                    console.error("Error fetching lenders:", data.message);
                }
            } catch (error) {
                console.error("API Error:", error);
            }
        };
    
        fetchLenders();
    }, []);
    

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
                setLenderUsers(prevUsers =>
                  prevUsers.map(user =>
                    user._id === id ? { ...user, suspended: true } : user
                  )
                );
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
                setLenderUsers(prevUsers =>
                  prevUsers.map(user =>
                    user._id === id ? { ...user, suspended: false } : user
                  )
                );
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
                setLenderUsers(prevUsers => prevUsers.filter(user => user._id !== id));
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete lender user.");
        }
    };

    const handleAssignLender = async (userId) => {
        if (!selectedLender[userId]) {
            setMessage("Please select a lender before assigning.");
            return;
        }
    
        try {
            const response = await fetch("https://broker-cheetah-backend.onrender.com/api/admin-lender-users/assign-lender", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, lenderId: selectedLender[userId] }),
            });
            const data = await response.json(); // ✅ Use data
    
            if (response.ok) {
                setMessage(`Lender assigned successfully: ${data.message || "Updated"}`); // ✅ Show response message
                setLenderUsers(prevUsers =>
                    prevUsers.map(user =>
                        user._id === userId ? { ...user, lenderId: selectedLender[userId], lenderName: data.lenderName } : user
                    )
                );
            } else {
                setMessage(`Error assigning lender: ${data.message}`);
            }
        } catch (error) {
            console.error("Assign error:", error);
            setMessage("Error assigning lender.");
        }
    };
    
    
   

    if (loading) return <div>Loading lender users...</div>;

    return (
        <div className="admin-dashboard" style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1>Admin Lender Users</h1>
            {message && <p style={{ color: "green", fontWeight: "bold" }}>{message}</p>}
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
    {lenderUsers.filter(user => user.approved).map((user) => (
        <tr key={user._id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>
                {user.lenderId ? user.lenderName : (
                   <select
                   onChange={(e) => setSelectedLender({ ...selectedLender, [user._id]: e.target.value })}
               >
                   <option value="">Select Lender</option>
                   {Array.isArray(lenders) && lenders.length > 0 ? (
    lenders.map(lender => (
        <option key={lender._id} value={lender._id}>{lender.name}</option>
    ))
) : (
    <option disabled>Loading lenders...</option> // Fallback in case lenders are not loaded
)}

               </select>
               
                )}
            </td>
            <td>{user.suspended ? "Suspended" : "Active"}</td>
            <td>
                {user.lenderId ? null : (
                    <button onClick={() => handleAssignLender(user._id)}>Assign Lender</button>
                )}
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
