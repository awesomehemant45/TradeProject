import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData: { username: string; email: string; password: string }) =>
    api.post('/auth/register', userData),
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
};

export const stockAPI = {
  getAll: () => api.get('/stocks'),
  getBySymbol: (symbol: string) => api.get(`/stocks/${symbol}`),
  getHistory: (symbol: string) => api.get(`/stocks/${symbol}/history`),
};

export const portfolioAPI = {
  get: () => api.get('/portfolio'),
  getSummary: () => api.get('/portfolio/summary'),
};

export const transactionAPI = {
  getAll: (page = 1, limit = 50) => api.get(`/transactions?page=${page}&limit=${limit}`),
  executeTrade: (tradeData: {
    symbol: string;
    type: 'buy' | 'sell';
    quantity: number;
    orderType?: 'market' | 'limit';
    limitPrice?: number;
  }) => api.post('/transactions/trade', tradeData),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateBalance: (amount: number) => api.patch('/users/balance', { amount }),
};

export default api;