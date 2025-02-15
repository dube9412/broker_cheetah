import React, { useState, useEffect } from 'react';

function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 useEffect(() => {
  const fetchUsers = async () => {
    console.log('Fetching users from API...');
    try {
      const response = await fetch('https://broker-cheetah-backend.onrender.com/api/admin/users');
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Fetched users:', data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  fetchUsers();
}, []);

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
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{new Date(user.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUserList;
