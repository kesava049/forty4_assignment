// src/components/UserList.js
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
      const response = await getAllUsers();
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        // Refresh the list by filtering out the deleted user
        setUsers(users.filter((user) => user.id !== id));
      } catch (err) {
        setError('Failed to delete user.');
        console.error(err);
      }
    }
  };

  if (loading) return <p className="loading">Loading users...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="container">
      <h1>Users</h1>
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
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.company}</td>
                <td className="actions">
                  <Link to={`/user/${user.id}`} className="button view-button">View</Link>
                  <Link to={`/edit/${user.id}`} className="button edit-button">Edit</Link>
                  <button onClick={() => handleDelete(user.id)} className="button delete-button">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;