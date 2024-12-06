export interface Log {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: 'script_upload' | 'script_delete' | 'script_run' | 'script_stop';
  level: 'info' | 'warning' | 'error';
  message: string;
  details?: Record<string, unknown>;
}