import axios from 'axios';
import { storage } from '../utils/storage';
import type { LoginCredentials, RegisterData, AuthResponse, UpdateProfileData } from '../types/auth';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = storage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors and network issues
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network error
      throw new Error('Unable to connect to the server. Please check your internet connection.');
    }

    if (error.response.status === 401) {
      storage.clearToken();
      window.location.href = '/login';
    }

    // Extract error message from response
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    throw new Error(message);
  }
);

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const { data } = await api.post<AuthResponse>('/auth/login', credentials);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Login failed: ${error.message}`);
      }
      throw error;
    }
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      const { data } = await api.post<AuthResponse>('/auth/register', userData);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Registration failed: ${error.message}`);
      }
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const { data } = await api.get('/auth/profile');
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch profile: ${error.message}`);
      }
      throw error;
    }
  },
};

export const scriptsApi = {
  getAll: async () => {
    const { data } = await api.get('/scripts');
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/scripts/${id}`);
    return data;
  },

  create: async (scriptData: CreateScriptData) => {
    const { data } = await api.post('/scripts', scriptData);
    return data;
  },

  update: async (id: string, scriptData: UpdateScriptData) => {
    const { data } = await api.put(`/scripts/${id}`, scriptData);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete(`/scripts/${id}`);
    return data;
  },

  run: async (id: string) => {
    const { data } = await api.post(`/scripts/${id}/run`);
    return data;
  },
};

export default api;