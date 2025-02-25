import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import AdminNav from "../../components/AdminNav"; // Assuming you might want this later

const AdminLenderUsers = () => {
    const [pendingLenderUsers, setPendingLenderUsers] = useState([]);
    const [allLenderUsers, setAllLenderUsers] = useState([]);
    const [lenders, setLenders] = useState([]); // For the dropdown
    const [selectedLenderIds, setSelectedLenderIds] = useState({}); // Tracks selected lender for assignment
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("all"); // 'all', 'pending', 'approved', 'suspended'
    const [searchTerm, setSearchTerm] = useState(""); // For search
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
                // Fetch pending lender users
                const pendingResponse = await fetch("https://broker-cheetah-backend.onrender.com/api/admin/lender-users?approved=false");
                const pendingData = await pendingResponse.json();
                if (pendingResponse.ok) {
                    setPendingLenderUsers(pendingData);
                } else {
                    console.error("Failed to fetch pending lender users:", pendingData.message);
                }

                // Fetch all lender users
                let allUrl = "https://broker-cheetah-backend.onrender.com/api/admin/lender-users";
                if (searchTerm) {
                  allUrl += `?search=${searchTerm}`;
                }
                const allResponse = await fetch(allUrl);
                const allData = await allResponse.json();

                if (allResponse.ok) {
                    setAllLenderUsers(allData);
                } else {
                    console.error("Failed to fetch all lender users:", allData.message);
                }

            } catch (error) {
                console.error("Error fetching lender users:", error);
            } finally {
                setLoading(false);
            }
        };
         const fetchLenders = async () => { //keep
            try {
              const res = await fetch("https://broker-cheetah-backend.onrender.com/api/lenders");
              const data = await res.json();
              if (res.ok) {
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
    }, [isAdmin, isSuperAdmin, navigate, filterStatus, searchTerm]); // Include searchTerm


    const handleApprove = async (id) => {
        if (!window.confirm("Are you sure you want to approve this lender user?")) return;
        try {
            const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/admin/lender-users/${id}/approve`, {
                method: "POST",
            });
            if (response.ok) {
                alert("Lender user approved successfully.");
                // Remove from pending list and add to all users list (with updated status)
                setPendingLenderUsers(prevUsers => prevUsers.filter(user => user._id !== id));
                const approvedUser = allLenderUsers.find(user => user._id === id);
                if (approvedUser) {
                    setAllLenderUsers(prevUsers => [...prevUsers, { ...approvedUser, approved: true, suspended: false }]);
                }
            } else {
                alert("Failed to approve lender user.");
            }
        } catch (error) {
            console.error("Error approving lender user:", error);
            alert("An error occurred while approving the lender user.");
        }
    };

    const handleRoleChange = async (userId, action) => {
        if (!window.confirm(`Are you sure you want to ${action} this lender user?`)) return;

        try {
            let endpoint = '';
            if (action === 'suspend') {
                endpoint = `https://broker-cheetah-backend.onrender.com/api/admin/lender-users/${userId}/suspend`;
            } else if (action === 'reactivate') {
                endpoint = `https://broker-cheetah-backend.onrender.com/api/admin/lender-users/${userId}/reactivate`;
            } else {
                console.error("Invalid action:", action);
                return;
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await response.json();
            if (response.ok) {
                alert(`Lender user ${action}ed successfully.`);
                // Update both lists
                setPendingLenderUsers(prevUsers => prevUsers.map(user => user._id === userId ? { ...user, suspended: action === 'suspend' } : user));
                setAllLenderUsers(prevUsers => prevUsers.map(user => user._id === userId ? { ...user, suspended: action === 'suspend' } : user));
            } else {
                alert(`Failed to ${action} lender user: ${data.message}`);
            }
        } catch (error) {
            console.error(`Error ${action}ing lender user:`, error);
            alert(`An error occurred while trying to ${action} the lender user.`);
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this lender user?")) return;

        try {
            const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/admin/lender-users/${userId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Lender user deleted successfully.');
                // Update both lists
                setPendingLenderUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
                setAllLenderUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
            } else {
                alert('Failed to delete lender user.');
            }
        } catch (error) {
            console.error("Error deleting lender user:", error);
            alert("An error occurred while deleting the lender user.");
        }
    };

    const assignLenderToUser = async (userId) => {
        const lenderId = selectedLenderIds[userId];
        if (!lenderId) {
            alert("Please select a lender.");
            return;
        }
        try {
            const res = await fetch("https://broker-cheetah-backend.onrender.com/api/admin/assign-lender", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, lenderId }),
            });

            const data = await res.json();
            if (data.success) {
                alert("Lender assigned successfully.");
                //find the user in all users and update
                setAllLenderUsers(prevUsers =>
                    prevUsers.map(user =>
                      user._id === userId
                        ? { ...user,
                            lenderId,
                            lenderName: lenders.find(l => l._id.toString() === lenderId)?.name || 'N/A' //lookup lender
                          }
                        : user
                    )
                  );
            } else {
                alert(`Failed: ${data.message}`);
            }
        } catch (error) {
            console.error("Error assigning lender:", error);
            alert("An error occurred while assigning the lender.");
        }
    };



    if (loading) return <div>Loading lender users...</div>;

    return (
        <div className="admin-dashboard" style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            {/* Inline Navigation (RESTORED) */}
            <nav className="admin-nav" style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
                <button onClick={() => navigate("/admin-dashboard")} className="nav-button">Admin Home</button>
                <button onClick={() => navigate("/admin/users")} className="nav-button">Users</button>
                <button onClick={() => navigate("/admin/lenders")} className="nav-button">Lenders</button>
                <button onClick={() => navigate("/admin/help-tickets")} className="nav-button">Help Tickets</button>
                <button onClick={() => navigate("/admin/analytics")} className="nav-button">Analytics</button>
                <button onClick={() => navigate("/admin/scrapers")} className="nav-button">Scrapers</button>
                <button onClick={() => navigate("/admin/json-tools")} className="nav-button">JSON Tools</button>
                <button onClick={() => navigate("/admin/import-data")} className="nav-button">Import Data</button>
            </nav>

            <div style={{ padding: "20px" }}>
                <h1>Admin Lender Users</h1>
                <p>Manage and approve lender users.</p>

                {/* Search Input */}
                <div>
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="all">All</option>
                        <option value="pending">Pending Approval</option>
                        <option value="approved">Approved</option>
                        <option value="suspended">Suspended</option>
                    </select>

                </div>

                <h2>Pending Approval</h2>
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
                        {pendingLenderUsers.length > 0 ? (
                            pendingLenderUsers.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>Pending</td>
                                    <td>
                                        <button onClick={() => handleApprove(user._id)}>Approve</button>
                                        <button onClick={() => handleDelete(user._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No pending lender users.</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <h2>All Lender Users</h2>
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
                        {allLenderUsers.length > 0 ? (
                            allLenderUsers.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.lenderName || "N/A"}</td>
                                    <td>
                                        {user.approved
                                            ? user.suspended
                                                ? "Suspended"
                                                : "Approved"
                                            : "Pending"}
                                    </td>
                                    <td>
                                        {/* Assign Lender (if approved) */}
                                         {user.approved && (
                                        <>
                                          <select
                                            value={selectedLenderIds[user._id] || ""}
                                            onChange={(e) =>
                                              setSelectedLenderIds({
                                                ...selectedLenderIds,
                                                [user._id]: e.target.value,
                                              })
                                            }
                                          >
                                            <option value="">Select Lender...</option>
                                            {lenders.map((lender) => (
                                              <option key={lender._id} value={lender._id}>
                                                {lender.name}
                                              </option>
                                            ))}
                                          </select>
                                          <button onClick={() => assignLenderToUser(user._id)}>
                                            Assign Lender
                                          </button>
                                        </>
                            )}

                                        {/* Suspend/Reactivate/Delete */}
                                        {user.role !== "superadmin" && (
                                            <>
                                                {user.approved == true && user.suspended != true &&(
                                                    <button onClick={() => handleRoleChange(user._id, "suspend")}>Suspend</button>
                                                )}
                                                {user.suspended && (
                                                    <button onClick={() => handleRoleChange(user._id, "reactivate")}>Reactivate</button>
                                                )}
                                                <button onClick={() => handleDelete(user._id)}>Delete</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">No lender users found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminLenderUsers;