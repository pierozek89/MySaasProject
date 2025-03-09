import React, { useEffect, useState } from 'react';
import API from '../api';

// Basic page to list or create users
// Extend as needed (role-based forms, etc.)
function Users() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    role: 'PRACOWNIK',
    password: '',
    client_id: 1,
  });

  const fetchUsers = async () => {
    try {
      const res = await API.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const createUser = async (e) => {
    e.preventDefault();
    try {
      await API.post('/users', newUser);
      setNewUser({
        username: '',
        email: '',
        role: 'PRACOWNIK',
        password: '',
        client_id: 1,
      });
      fetchUsers();
    } catch (err) {
      console.error('Error creating user:', err);
    }
  };

  return (
    <div>
      <h1>Users</h1>
      <form onSubmit={createUser} style={{ marginBottom: '1rem' }}>
        <div>
          <label>Username: </label>
          <input
            type="text"
            required
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          />
        </div>
        <div>
          <label>Email: </label>
          <input
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
        </div>
        <div>
          <label>Role: </label>
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            <option value="ADMIN_SYSTEMU">ADMIN_SYSTEMU</option>
            <option value="POWER_USER">POWER_USER</option>
            <option value="PRACOWNIK">PRACOWNIK</option>
          </select>
        </div>
        <div>
          <label>Password: </label>
          <input
            type="password"
            required
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          />
        </div>
        <div>
          <label>Client ID: </label>
          <input
            type="number"
            value={newUser.client_id}
            onChange={(e) =>
              setNewUser({ ...newUser, client_id: parseInt(e.target.value, 10) })
            }
          />
        </div>
        <button type="submit">Create User</button>
      </form>

      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.username} ({u.role}) - {u.email || 'No Email'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Users;
