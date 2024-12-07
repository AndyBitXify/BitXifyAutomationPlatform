import { logger } from '../services/logger';
import type { User } from '../types/auth';
import type { LogAction } from '../types/log';

const STORAGE_KEYS = {
  USER: 'current_user',
  AUTH_TOKEN: 'auth_token',
} as const;

const STORAGE_ACTION: LogAction = 'storage';

export const storage = {
  getCurrentUser: (): User | null => {
    try {
      const userStr = localStorage.getItem(STORAGE_KEYS.USER);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      logger.error(STORAGE_ACTION, 'Failed to get user from storage', { error });
      return null;
    }
  },

  setCurrentUser: (user: User): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      logger.error(STORAGE_ACTION, 'Failed to set user in storage', { error });
    }
  },

  clearCurrentUser: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      logger.error(STORAGE_ACTION, 'Failed to clear user from storage', { error });
    }
  },

  getToken: (): string | null => {
    try {
      return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      logger.error(STORAGE_ACTION, 'Failed to get token from storage', { error });
      return null;
    }
  },

  setToken: (token: string): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    } catch (error) {
      logger.error(STORAGE_ACTION, 'Failed to set token in storage', { error });
    }
  },

  clearToken: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      logger.error(STORAGE_ACTION, 'Failed to clear token from storage', { error });
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      logger.error(STORAGE_ACTION, 'Failed to clear storage', { error });
    }
  },
};