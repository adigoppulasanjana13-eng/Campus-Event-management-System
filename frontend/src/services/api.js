import axios from 'axios';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
const baseURL = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});


// Request interceptor: Attach JWT token if stored
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cems_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 unauthorized errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or invalid
      localStorage.removeItem('cems_token');
      localStorage.removeItem('cems_user');
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
  getCurrentUser: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
};

export const eventService = {
  getAll: async (category = '', search = '') => {
    const params = {};
    if (category && category !== 'All') params.category = category;
    if (search) params.search = search;
    const res = await api.get('/events', { params });
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/events/${id}`);
    return res.data;
  },
  getCategories: async () => {
    const res = await api.get('/events/categories');
    return res.data;
  },
  create: async (eventData) => {
    const res = await api.post('/events', eventData);
    return res.data;
  },
  update: async (id, eventData) => {
    const res = await api.put(`/events/${id}`, eventData);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/events/${id}`);
    return res.data;
  },
};

export const registrationService = {
  register: async (eventId, userId = null) => {
    const payload = { eventId };
    if (userId) payload.userId = userId;
    const res = await api.post('/registrations', payload);
    return res.data;
  },
  getMyRegistrations: async () => {
    const res = await api.get('/registrations/my-registrations');
    return res.data;
  },
  getEventRegistrations: async (eventId) => {
    const res = await api.get(`/registrations/event/${eventId}`);
    return res.data;
  },
  cancel: async (registrationId) => {
    const res = await api.delete(`/registrations/${registrationId}`);
    return res.data;
  },
};

export default api;
