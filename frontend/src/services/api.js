import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://blockchain-voting-backend-ff3v.onrender.com/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  register: (data) => api.post('/auth/register', data).then(res => res.data),
  login: (data) => api.post('/auth/login', data).then(res => res.data),
  verifyMfa: (data) => api.post('/auth/verify-mfa', data).then(res => res.data),
};

export const electionService = {
  getAll: () => api.get('/elections').then(res => res.data),
  getById: (id) => api.get(`/elections/${id}`).then(res => res.data),
  vote: (id, data) => api.post(`/elections/${id}/vote`, data).then(res => res.data),
  getResults: (id) => api.get(`/elections/${id}/results`).then(res => res.data),
};

export const blockchainService = {
  getChain: () => api.get('/blockchain').then(res => res.data),
  validate: () => api.get('/blockchain/validate').then(res => res.data),
};

export const adminService = {
  seedData: () => api.post('/admin/seed').then(res => res.data),
  createElection: (data) => api.post('/admin/elections', data).then(res => res.data),
  addCandidate: (id, data) => api.post(`/admin/elections/${id}/candidates`, data).then(res => res.data),
  fraudCheck: (id) => api.get(`/admin/elections/${id}/fraud-check`).then(res => res.data),
};
