import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllUsers, deleteUser } from '../services/api';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch users.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        setUsers(users.filter((user) => user.id !== id));
      } catch (err) {
        const errorMessage = err.response?.data?.error || 'Failed to delete user.';
        setError(errorMessage);
      }
    }
  };

  if (loading) return <p className="loading">Loading users...</p>;

  return (
    <div className="container">
      <h1>Users</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.company || 'N/A'}</td>
                  <td className="actions">
                    <Link to={`/user/${user.id}`} className="button view-button">View</Link>
                    <Link to={`/edit/${user.id}`} className="button edit-button">Edit</Link>
                    <button onClick={() => handleDelete(user.id)} className="button delete-button">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;