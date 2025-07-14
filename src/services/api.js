import axios from 'axios';

const API_BASE_URL = 'http://10.0.2.2:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const authApi = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  signup: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  verifyToken: async (token) => {
    const response = await api.post('/auth/verify', { token });
    return response.data;
  }
};