import type { Log, User } from '../types';
import { storage } from '../utils/storage';

export const logger = {
  log(
    level: Log['level'],
    action: Log['action'],
    message: string,
    user: User,
    scriptId?: string,
    details?: Record<string, unknown>
  ): Log {
    const newLog: Log = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      level,
      action,
      message,
      userId: user.id,
      scriptId,
      details,
    };

    const logs = storage.getLogs();
    storage.setLogs([...logs, newLog]);
    return newLog;
  },

  info(
    action: Log['action'],
    message: string,
    user: User,
    scriptId?: string,
    details?: Record<string, unknown>
  ): Log {
    return this.log('info', action, message, user, scriptId, details);
  },

  warning(
    action: Log['action'],
    message: string,
    user: User,
    scriptId?: string,
    details?: Record<string, unknown>
  ): Log {
    return this.log('warning', action, message, user, scriptId, details);
  },

  error(
    action: Log['action'],
    message: string,
    user: User,
    scriptId?: string,
    details?: Record<string, unknown>
  ): Log {
    return this.log('error', action, message, user, scriptId, details);
  },
};