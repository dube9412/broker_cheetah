// adminUserList.js (React Component for Admin Dashboard)
import React, { useState, useEffect } from 'react';

function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users');  // Ensure this endpoint is available
        const data = await response.json();
        if (response.ok) {
          setUsers(data);
        } else {
          throw new Error(data.message || 'Failed to fetch users');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handlePromote = async (userId) => {
    if (!window.confirm('Are you sure you want to promote this user to admin?')) return;
    try {
      const response = await fetch('/api/admin/promote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const data = await response.json();
      if (response.ok) {
        alert('User promoted to admin successfully.');
        setUsers(users.map(user => user._id === userId ? { ...user, role: 'admin' } : user));
      } else {
        alert(`Failed to promote user: ${data.message}`);
      }
    } catch (error) {
      console.error('Error promoting user:', error);
      alert('An error occurred while promoting the user.');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const response = await fetch(`/api/admin/${userId}`, { method: 'DELETE' });
      const data = await response.json();
      if (response.ok) {
        alert('User deleted successfully.');
        setUsers(users.filter(user => user._id !== userId));
      } else {
        alert(`Failed to delete user: ${data.message}`);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('An error occurred while deleting the user.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Admin User List</h2>
      <table border="1" cellPadding="6" style={{ marginTop: '1rem' }}>
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
            users.map(user => (
              <tr key={user._id}>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{new Date(user.createdAt).toLocaleString()}</td>
                <td>
                  {user.role !== 'superadmin' && (
                    <>
                      <button onClick={() => handlePromote(user._id)}>Promote to Admin</button> {' | '}
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
  );
}

export default AdminUserList;
