export type LogLevel = 'info' | 'warning' | 'error';
export type LogAction = 'auth' | 'script' | 'user' | 'error_boundary' | 'security' | 'storage' | 'script_upload' | 'script_delete' | 'script_run' | 'script_stop';

export interface Log {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: LogAction;
  level: LogLevel;
  message: string;
  details?: Record<string, unknown>;
}