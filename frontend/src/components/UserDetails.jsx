// src/components/UserDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserById } from '../services/api';

const UserDetails = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await getUserById(id);
        setUser(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch user details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <p className="loading">Loading user details...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <div className="container user-details">
      <h1>{user.name}</h1>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Phone:</strong> {user.phone}</p>
      <p><strong>Company:</strong> {user.company}</p>
      <p><strong>City:</strong> {user.address.city}</p>
      <p><strong>Zipcode:</strong> {user.address.zipcode}</p>
      <Link to="/" className="button back-button">Back to Dashboard</Link>
    </div>
  );
};

export default UserDetails;