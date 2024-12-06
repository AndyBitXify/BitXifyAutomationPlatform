import { api } from './base';
import type { DashboardStats } from '../../types/dashboard';

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    try {
      const { data } = await api.get<DashboardStats>('/dashboard/stats');
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch dashboard stats: ${error.message}`);
      }
      throw error;
    }
  },
};