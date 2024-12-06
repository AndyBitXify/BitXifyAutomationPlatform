export type Department = 'Development' | 'Support';

export interface User {
  id: string;
  name: string;
  username: string;
  password: string;
  department: Department;
  role: string;
  createdAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface Script {
  id: string;
  name: string;
  type: string;
  lastRun?: string;
  status?: 'success' | 'failed' | 'running' | 'idle';
  progress?: number;
  size: string;
  dateModified: string;
  category: string;
  createdBy: string;
}

export interface Log {
  id: string;
  scriptId?: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  userId: string;
  action: 'script_upload' | 'script_delete' | 'script_run' | 'script_stop' | 'user_login' | 'user_logout' | 'user_register' | 'script_progress';
  details?: Record<string, unknown>;
}

export interface DashboardStats {
  totalScripts: number;
  activeScripts: number;
  failedScripts: number;
  successRate: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}