import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import AdminNav from "../../components/AdminNav";

const AdminLenderUsers = () => {
  const [lenderUsers, setLenderUsers] = useState([]);
  const [lenders, setLenders] = useState([]);
const [selectedLenderIds, setSelectedLenderIds] = useState({});

  const [loading, setLoading] = useState(true);
  const { isAdmin, isSuperAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  <AdminNav />

  useEffect(() => {
    if (!isAdmin && !isSuperAdmin) {
      navigate("/dashboard");
      return;
    }
    
    const fetchLenderUsers = async () => {
      try {
        const response = await fetch("https://broker-cheetah-backend.onrender.com/api/admin/lender-users");
        const data = await response.json();
        if (response.ok) {
          setLenderUsers(data.lenderUsers);
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
  }, [isAdmin, isSuperAdmin, navigate]);
    

  const handleApprove = async (id) => {
    if (!window.confirm("Are you sure you want to approve this lender user?")) return;
    try {
      const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/admin/lender-users/${id}/approve`, {
        method: "POST",
      });
      if (response.ok) {
        alert("Lender user approved successfully.");
        setLenderUsers((prevUsers) => prevUsers.map((user) => (user._id === id ? { ...user, approved: true } : user)));
      } else {
        alert("Failed to approve lender user.");
      }
    } catch (error) {
      console.error("Error approving lender user:", error);
      alert("An error occurred while approving the lender user.");
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
        setLenderUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, lenderName: lenders.find(l => l._id === lenderId).name } : user
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
  <td>{user.approved ? "Approved" : "Pending"}</td>
  <td>
    {!user.approved && (
      <button onClick={() => handleApprove(user._id)}>Approve</button>
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
