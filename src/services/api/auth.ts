import { api } from './base';
import type { LoginCredentials, RegisterData, AuthResponse } from '../../types/auth';

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