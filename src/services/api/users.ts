import { api } from './base';
import type { User, UpdateProfileData } from '../../types/auth';

export const usersApi = {
  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    try {
      const { data: response } = await api.patch<User>('/users/profile', data);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update profile: ${error.message}`);
      }
      throw error;
    }
  },

  getUsers: async (): Promise<User[]> => {
    try {
      const { data } = await api.get<User[]>('/users');
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch users: ${error.message}`);
      }
      throw error;
    }
  },

  getUserById: async (id: string): Promise<User> => {
    try {
      const { data } = await api.get<User>(`/users/${id}`);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch user: ${error.message}`);
      }
      throw error;
    }
  },
};