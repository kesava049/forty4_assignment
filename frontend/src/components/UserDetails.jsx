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
        setError(null);
        const response = await getUserById(id);
        setUser(response.data);
      } catch (err) {
        const errorMessage = err.response?.data?.error || 'Failed to fetch user details.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <p className="loading">Loading user details...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <div className="container user-details">
      <h1>{user.name}</h1>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
      <p><strong>Company:</strong> {user.company || 'N/A'}</p>
      {user.address && (
        <div className="address-details">
          <h3>Address</h3>
          <p><strong>Street:</strong> {user.address.street}</p>
          <p><strong>City:</strong> {user.address.city}</p>
          <p><strong>Zipcode:</strong> {user.address.zipcode}</p>
        </div>
      )}
      <Link to="/" className="button back-button mt-4">Back to Dashboard</Link>
    </div>
  );
};

export default UserDetails;