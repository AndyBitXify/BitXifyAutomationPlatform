import { logStorage } from '../storage/logStorage';
import type { User } from '../../types/auth';

export class ScriptExecutionError extends Error {
  constructor(
    message: string,
    public readonly scriptId: string,
    public readonly scriptName: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ScriptExecutionError';
  }
}

export const errorHandler = {
  handleScriptError(error: unknown, user: User, scriptId: string, scriptName: string) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    
    logStorage.addLog({
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      userId: user.id,
      action: 'script_run',
      level: 'error',
      message: `Failed to execute script "${scriptName}": ${errorMessage}`,
      details: {
        scriptId,
        scriptName,
        error: errorMessage,
        ...(error instanceof ScriptExecutionError ? error.details : {})
      }
    });

    return errorMessage;
  },

  handleUploadError(error: unknown, user: User, fileName: string) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    
    logStorage.addLog({
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      userId: user.id,
      action: 'script_upload',
      level: 'error',
      message: `Failed to upload script "${fileName}": ${errorMessage}`,
      details: {
        fileName,
        error: errorMessage
      }
    });

    return errorMessage;
  }
};