import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Token ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/users/login/', credentials),

  profile: () =>
    api.get('/users/profile/'),

  logout: () =>
    api.post('/users/logout/'),
};

export const eventsAPI = {
  list: () =>
    api.get('/events/'),

  create: (eventData: any) =>
    api.post('/events/', eventData),

  get: (id: string) =>
    api.get(`/events/${id}/`),

  update: (id: string, eventData: any) =>
    api.put(`/events/${id}/`, eventData),

  delete: (id: string) =>
    api.delete(`/events/${id}/`),
};

export const companiesAPI = {
  list: () =>
    api.get('/companies/'),

  create: (companyData: any) =>
    api.post('/companies/', companyData),

  get: (id: string) =>
    api.get(`/companies/${id}/`),

  update: (id: string, companyData: any) =>
    api.put(`/companies/${id}/`, companyData),
};

export const usersAPI = {
  list: () =>
    api.get('/users/'),

  create: (userData: any) =>
    api.post('/users/', userData),

  get: (id: string) =>
    api.get(`/users/${id}/`),

  update: (id: string, userData: any) =>
    api.put(`/users/${id}/`, userData),
};

export const menuAPI = {
  list: () =>
    api.get('/menu-items/'),

  create: (menuData: any) =>
    api.post('/menu-items/', menuData),

  get: (id: string) =>
    api.get(`/menu-items/${id}/`),

  update: (id: string, menuData: any) =>
    api.put(`/menu-items/${id}/`, menuData),

  delete: (id: string) =>
    api.delete(`/menu-items/${id}/`),
};

export const financialsAPI = {
  dashboard: () =>
    api.get('/financials/dashboard/'),

  eventCosts: (eventId: string) =>
    api.get(`/financials/event-costs/${eventId}/`),

  quotes: () =>
    api.get('/financials/quotes/'),
};

export default api;