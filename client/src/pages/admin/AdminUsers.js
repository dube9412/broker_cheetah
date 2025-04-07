import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const AdminUsers = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc"); // Define sortOrder state
  const { isAdmin, isSuperAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect unauthorized users
  useEffect(() => {
    if (!isAdmin && !isSuperAdmin) {
      navigate("/dashboard");
    }
  }, [isAdmin, isSuperAdmin, navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://broker-cheetah-backend.onrender.com/api/admin/users"); // Use full backend URL
        if (!response.ok) {
          throw new Error(`Error fetching users: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Fetched users from backend:", data);
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
          prevUsers.map((user) => user._id === userId ? { ...user, role: data.newRole || user.role } : user)
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

  // Sort users based on role
  const sortedUsers = [...users].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.role.localeCompare(b.role);
    } else {
      return b.role.localeCompare(a.role);
    }
  });

  // Filter users based on search term
  const filteredUsers = sortedUsers.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log("Filtered Users:", filteredUsers); // Log filtered users after filtering

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="admin-dashboard" style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ padding: "20px" }}>
        <h1>Admin Users</h1>
        <p>Manage all registered users (Brokers, Admins, Superadmins).</p>

        {/* Search Field */}
        <input
          type="text"
          placeholder="Search by email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '8px', width: '200px', marginBottom: '20px' }}
        />

        {/* Sort Dropdown */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={{ padding: '8px', marginLeft: '10px' }}
        >
          <option value="asc">Role: A-Z</option>
          <option value="desc">Role: Z-A</option>
        </select>

        <table border="1" cellPadding="10" style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created At</th>
              <th>Last Login</th>
              <th>Marketing Opt-In</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id}>
                 
                 <td>{user.firstName} {user.lastName}</td>

                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{new Date(user.createdAt).toLocaleString()}</td>
                  <td>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never"}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={user.marketingOptIn} // Display marketingOptIn as a checkbox
                      readOnly
                    />
                  </td>
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
                <td colSpan="7">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
        {console.log("Rendered Table Data:", filteredUsers)} {/* Log table data after rendering */}
      </div>
    </div>
  );
};

export default AdminUsers;

