import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById, createUser, updateUser } from '../services/api';

const UserForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: { street: '', city: '', zipcode: '', lat: '', lng: '' },
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      const fetchUser = async () => {
        setLoading(true);
        try {
          const response = await getUserById(id);
          // Ensure address object exists to avoid errors on undefined
          setFormData({ ...response.data, address: response.data.address || { street: '', city: '', zipcode: '', lat: '', lng: '' } });
        } catch (err) {
          setFormError('Failed to fetch user data.');
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [field]: value }
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setFormError('');

    try {
      if (isEditMode) {
        await updateUser(id, formData);
      } else {
        await createUser(formData);
      }
      navigate('/');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'An unexpected error occurred.';
      setFormError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && isEditMode) return <p className="loading">Loading form...</p>;

  return (
    <div className="container">
      <h1>{isEditMode ? 'Edit User' : 'Add New User'}</h1>
      {formError && <p className="error-message">{formError}</p>}
      <form onSubmit={handleSubmit} className="user-form">
        {/* Basic Info */}
        <div className="form-group">
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
          {errors.name && <p className="error-text">{errors.name}</p>}
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>
        <div className="form-group">
          <label>Phone:</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Company:</label>
          <input type="text" name="company" value={formData.company} onChange={handleChange} />
        </div>

        {/* Address Fields */}
        <h3 className="form-section-header">Address</h3>
        <div className="form-group">
          <label>Street:</label>
          <input type="text" name="address.street" value={formData.address.street} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>City:</label>
          <input type="text" name="address.city" value={formData.address.city} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Zipcode:</label>
          <input type="text" name="address.zipcode" value={formData.address.zipcode} onChange={handleChange} />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : isEditMode ? 'Update User' : 'Create User'}
        </button>
      </form>
    </div>
  );
};

export default UserForm;