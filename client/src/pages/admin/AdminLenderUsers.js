import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import AdminNav from "../../components/AdminNav";

const AdminLenderUsers = () => {
    const [lenderUsers, setLenderUsers] = useState([]);
    const [lenders, setLenders] = useState([]); // To hold your lender list
    const [selectedLenderIds, setSelectedLenderIds] = useState({}); // Tracks selected lender
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("all"); // 'all', 'pending', 'approved', 'suspended'
    const [searchTerm, setSearchTerm] = useState(""); // Search term
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
                let url = "https://broker-cheetah-backend.onrender.com/api/admin/lender-users";
                const queryParams = [];

                if (filterStatus === "pending") {
                    queryParams.push("approved=false");
                } else if (filterStatus === "approved") {
                    queryParams.push("approved=true&status=active"); //Approved and active.
                } else if (filterStatus === "suspended") {
                    queryParams.push("status=suspended");
                }

                if (searchTerm) {
                  queryParams.push(`search=${searchTerm}`);
                }

                if (queryParams.length > 0) {
                    url += `?${queryParams.join('&')}`;
                }

                const response = await fetch(url);
                const data = await response.json();
                if (response.ok) {
                    setLenderUsers(data); // Expect data to be the array directly
                } else {
                    console.error("Failed to fetch lender users:", data.message);
                }

                 // Fetch all lenders (for assigning)
                 const lendersResponse = await fetch("https://broker-cheetah-backend.onrender.com/api/lenders");
                 const lendersData = await lendersResponse.json();
                 if (lendersResponse.ok) {
                     setLenders(lendersData.lenders); // Assuming your lenders are in data.lenders
                 } else {
                     console.error("Failed to fetch lenders:", lendersData.message);
                 }
            } catch (error) {
                console.error("Error fetching lender users/lenders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLenderUsers();
    }, [isAdmin, isSuperAdmin, navigate, filterStatus, searchTerm]); // Include filterStatus and Search Term

    const handleApprove = async (id) => {
      if (!window.confirm("Are you sure you want to approve this lender user?")) return;
      try {
          const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/admin/lender-users/${id}/approve`, {
              method: "POST", //or put
          });
          if (response.ok) {
              alert("Lender user approved successfully.");
                // Efficiently update the state *without* refetching
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
                // Update local state to reflect the change
                setLenderUsers(prevUsers =>
                    prevUsers.map(user => user._id === userId ? { ...user, suspended: action === 'suspend' } : user)
                );
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
                // Update local state to reflect the deletion
                setLenderUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
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
            const response = await fetch("https://broker-cheetah-backend.onrender.com/api/admin/assign-lender", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, lenderId }),
            });

            const data = await response.json();
            if (data.success) {
                alert("Lender assigned successfully.");
                //find user in lender users array and add lender name
                setLenderUsers(prevUsers =>
                    prevUsers.map(user =>
                      user._id === userId
                        ? { ...user,
                            lenderId,
                            lenderName: lenders.find(l => l._id.toString() === lenderId)?.name || 'N/A'
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
                        {lenderUsers.length > 0 ? (
                            lenderUsers.map((user) => (
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
                                        {!user.approved && (
                                            <>
                                                <button onClick={() => handleApprove(user._id)}>Approve</button>
                                                <button onClick={() => handleDelete(user._id)}>Delete</button>
                                            </>
                                        )}
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
                                        {user.role !== "superadmin" && user.approved && (
                                            <>
                                               {user.suspended != true && (
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