import type { LogLevel, LogAction } from '../types/log';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  action: LogAction;
  message: string;
  details?: Record<string, unknown>;
}

class Logger {
  private logs: LogEntry[] = [];
  private readonly MAX_LOGS = 1000;

  private createLog(
    level: LogLevel,
    action: LogAction,
    message: string,
    details?: Record<string, unknown>
  ): LogEntry {
    const log: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      action,
      message,
      details
    };

    this.logs.push(log);
    if (this.logs.length > this.MAX_LOGS) {
      this.logs.shift();
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      const consoleMethod = level === 'error' ? console.error :
        level === 'warning' ? console.warn : console.log;
      consoleMethod(`[${log.timestamp}] ${level.toUpperCase()}: ${message}`, details);
    }

    return log;
  }

  info(action: LogAction, message: string, details?: Record<string, unknown>) {
    return this.createLog('info', action, message, details);
  }

  warning(action: LogAction, message: string, details?: Record<string, unknown>) {
    return this.createLog('warning', action, message, details);
  }

  error(action: LogAction, message: string, details?: Record<string, unknown>) {
    return this.createLog('error', action, message, details);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = new Logger();