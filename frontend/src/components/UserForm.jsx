// src/components/UserForm.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById, createUser, updateUser } from '../services/api';

const UserForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: { street: '', city: '', zipcode: '', geo: { lat: '', lng: '' } },
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { id } = useParams(); // Gets the 'id' from the URL if we are editing
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      const fetchUser = async () => {
        setLoading(true);
        try {
          const response = await getUserById(id);
          setFormData(response.data);
        } catch (err) {
          console.error(err);
          setErrors({ form: 'Failed to fetch user data.' });
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [id, isEditMode]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required.';
    if (!formData.email) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid.';
    }
    if (!formData.phone) newErrors.phone = 'Phone is required.';
    if (!formData.address.city) newErrors.city = 'City is required.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Handle nested address fields
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (isEditMode) {
        await updateUser(id, formData);
      } else {
        await createUser(formData);
      }
      navigate('/'); // Go back to the user list on success
    } catch (err) {
      console.error(err);
      setErrors({ form: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && isEditMode) return <p className="loading">Loading form...</p>;

  return (
    <div className="container">
      <h1>{isEditMode ? 'Edit User' : 'Add New User'}</h1>
      <form onSubmit={handleSubmit} className="user-form">
        {errors.form && <p className="error">{errors.form}</p>}
        
        <div className="form-group">
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div className="form-group">
          <label>Phone:</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
          {errors.phone && <p className="error">{errors.phone}</p>}
        </div>
        <div className="form-group">
          <label>Company:</label>
          <input type="text" name="company" value={formData.company} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>City:</label>
          <input type="text" name="address.city" value={formData.address.city} onChange={handleChange} />
          {errors.city && <p className="error">{errors.city}</p>}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : isEditMode ? 'Update User' : 'Create User'}
        </button>
      </form>
    </div>
  );
};

export default UserForm;