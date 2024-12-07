import type { Log } from '../../types/log';
import type { User } from '../../types/auth';

const LOGS_KEY = 'bitxify_logs';

export const logStorage = {
  getLogs: (): Log[] => {
    const logs = localStorage.getItem(LOGS_KEY);
    return logs ? JSON.parse(logs) : [];
  },

  addLog: (log: Log) => {
    const logs = logStorage.getLogs();
    logs.push(log);
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  },

  addActivityLog: (
    action: Log['action'],
    level: Log['level'],
    message: string,
    user: User,
    details?: Record<string, unknown>
  ) => {
    const log: Log = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action,
      level,
      message,
      details: {
        ...details,
        performedBy: {
          id: user.id,
          name: user.name,
          role: user.role,
          department: user.department
        }
      }
    };

    logStorage.addLog(log);
    return log;
  }
};