export interface DashboardStats {
  totalScripts: number;
  activeScripts: number;
  failedScripts: number;
  successRate: number;
  recentExecutions: {
    date: string;
    count: number;
  }[];
}