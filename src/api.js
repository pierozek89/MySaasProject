// Central place for Axios requests, so you can change the base URL easily
import axios from 'axios';

// If your backend runs on http://localhost:8000
const API = axios.create({
  baseURL: 'http://localhost:8001',
});

// Example interceptors if you need auth headers in the future
// API.interceptors.request.use((config) => {
//   config.headers.Authorization = `Bearer <token>`;
//   return config;
// });

export default API;
