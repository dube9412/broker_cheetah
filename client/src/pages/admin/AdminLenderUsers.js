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
    fetchLenderUsers();
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

  if (loading) return <div>Loading lender users...</div>;

  return (
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
  );
};

export default AdminLenderUsers;
