import React, { useState, useEffect } from 'react';

function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://broker-cheetah-backend.onrender.com/api/admin/users');
        if (!response.ok) {
          throw new Error(`Error fetching users: ${response.statusText}`);
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSuspend = async (userId) => {
    if (!window.confirm('Are you sure you want to suspend this user?')) return;
    try {
      const response = await fetch('https://broker-cheetah-backend.onrender.com/api/admin/suspend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const data = await response.json();
      if (response.ok) {
        alert('User suspended successfully.');
        setUsers(users.map(user => user._id === userId ? { ...user, role: 'suspended' } : user));
      } else {
        alert(`Failed to suspend user: ${data.message}`);
      }
    } catch (error) {
      console.error('Error suspending user:', error);
      alert('An error occurred while suspending the user.');
    }
  };

  const handleDemote = async (userId) => {
    if (!window.confirm('Are you sure you want to demote this user back to a regular user?')) return;
    try {
      const response = await fetch('https://broker-cheetah-backend.onrender.com/api/admin/demote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const data = await response.json();
      if (response.ok) {
        alert('User demoted successfully.');
        setUsers(users.map(user => user._id === userId ? { ...user, role: 'user' } : user));
      } else {
        alert(`Failed to demote user: ${data.message}`);
      }
    } catch (error) {
      console.error('Error demoting user:', error);
      alert('An error occurred while demoting the user.');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const response = await fetch(`https://broker-cheetah-backend.onrender.com/api/admin/${userId}`, { method: 'DELETE' });
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

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ marginTop: '20px' }}>
      <h2>Admin User List</h2>
      <table border="1" cellPadding="6">
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
                      {user.role !== 'admin' && user.role !== 'suspended' && (
                        <button onClick={() => handlePromote(user._id)}>Promote to Admin</button>
                      )} {' | '}
                      {user.role !== 'suspended' && (
                        <button onClick={() => handleSuspend(user._id)}>Suspend User</button>
                      )} {' | '}
                      {user.role === 'admin' && (
                        <button onClick={() => handleDemote(user._id)}>Demote to User</button>
                      )} {' | '}
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

