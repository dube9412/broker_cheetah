import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {AdminNav} from "../../components/AdminNav";


const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAdmin, isSuperAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  
  <AdminNav />

  // Redirect unauthorized users
  useEffect(() => {
    if (!isAdmin && !isSuperAdmin) {
      navigate("/dashboard");
    }
  }, [isAdmin, isSuperAdmin, navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://broker-cheetah-backend.onrender.com/api/admin/users");
        if (!response.ok) {
          throw new Error(`Error fetching users: ${response.statusText}`);
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;
    try {
      const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/admin/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(`User ${action}d successfully.`);
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user._id === userId ? { ...user, role: data.newRole || user.role } : user))
        );
      } else {
        alert(`Failed to ${action} user: ${data.message}`);
      }
    } catch (error) {
      console.error(`Error ${action} user:`, error);
      alert(`An error occurred while trying to ${action} the user.`);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/admin/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("User deleted successfully.");
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      } else {
        alert("Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("An error occurred while deleting the user.");
    }
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="admin-dashboard" style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <nav className="admin-nav" style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <button onClick={() => navigate("/admin-dashboard")} className="nav-button">Admin Home</button>
        <button onClick={() => navigate("/admin/lenders")} className="nav-button">Lenders</button>
        <button onClick={() => navigate("/admin/lender-users")} className="nav-button">Lender Users</button>
        <button onClick={() => navigate("/admin/help-tickets")} className="nav-button">Help Tickets</button>
        <button onClick={() => navigate("/admin/analytics")} className="nav-button">Analytics</button>
        <button onClick={() => navigate("/admin/scraper-tools")} className="nav-button">Help Tickets</button>
        <button onClick={() => navigate("/admin/json-import")} className="nav-button">JSON Import</button>
        <button onClick={() => navigate("/admin/import-data")} className="nav-button">Import Data</button>
        </nav>
    <div style={{ padding: "20px" }}>
      <h1>Admin Users</h1>
      <p>Manage all registered users (Brokers, Admins, Superadmins).</p>

      <table border="1" cellPadding="6" style={{ marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id}>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{new Date(user.createdAt).toLocaleString()}</td>
                <td>
                  {user.role !== "superadmin" && (
                    <>
                      {user.role === "user" && (
                        <button onClick={() => handleRoleChange(user._id, "promote")}>Promote to Admin</button>
                      )}
                      {user.role === "user" && (
                        <button onClick={() => handleRoleChange(user._id, "suspend")}>Suspend</button>
                      )}
                      {user.role === "suspended" && (
                        <button onClick={() => handleRoleChange(user._id, "reactivate")}>Reactivate</button>
                      )}
                      {user.role === "admin" && (
                        <button onClick={() => handleRoleChange(user._id, "demote")}>Demote to User</button>
                      )}
                      <button onClick={() => handleDelete(user._id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No users found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default AdminUsers;

