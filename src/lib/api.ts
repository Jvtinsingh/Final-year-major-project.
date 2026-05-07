import axios from 'axios';
import { auth } from './firebase';

const api = axios.create({
  baseURL: '/api',
});

// Add a request interceptor to include the Firebase ID token
api.interceptors.request.use(async (config) => {
  // Try to get token from Firebase
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Check for mock user token
      const mockUser = localStorage.getItem('mock_user');
      if (mockUser) {
        const { role } = JSON.parse(mockUser);
        config.headers.Authorization = `Bearer mock-token-${role}`;
      }
    }
  } catch (error) {
    console.error('[API-Interceptor] Error getting token:', error);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
