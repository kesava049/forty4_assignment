// src/services/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:4000/api', // Change this to your backend's URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAllUsers = () => apiClient.get('/users');
export const getUserById = (id) => apiClient.get(`/users/${id}`);
export const createUser = (userData) => apiClient.post('/users', userData);
export const updateUser = (id, userData) => apiClient.put(`/users/${id}`, userData);
export const deleteUser = (id) => apiClient.delete(`/users/${id}`);