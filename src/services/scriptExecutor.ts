import { scriptStorage } from './storage/scriptStorage';
import { logStorage } from './storage/logStorage';
import { scriptsApi } from './api/scripts';
import { authService } from './auth/AuthService';
import { logger } from './logger';
import { io, Socket } from 'socket.io-client';
import type { Script } from '../types/script';

const runningScripts = new Map<string, {
  abortController: AbortController;
  socket?: Socket;
}>();

const socket = io('http://localhost:3000', {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 5
});

socket.on('connect', () => {
  logger.info('script', 'Socket.IO connected');
});

socket.on('connect_error', (error) => {
  logger.error('script', 'Socket.IO connection error', { error });
});

socket.on('scriptStatus', (update) => {
  const script = scriptStorage.getScripts().find(s => s.id === update.scriptId);
  if (script) {
    scriptStorage.updateScript({
      ...script,
      status: update.status as Script['status'],
      progress: update.progress,
      output: update.output
    });
  }
});

export const scriptExecutor = {
  async executeScript(
    script: Script, 
    userId: string, 
    inputValues?: Record<string, string>
  ) {
    logger.info('script', 'Attempting to execute script', {
      scriptId: script.id,
      scriptName: script.name,
      userId
    });

    if (runningScripts.has(script.id)) {
      logger.warning('script', 'Script already running', { scriptId: script.id });
      throw new Error('Script is already running');
    }

    // Validate authentication
    if (!authService.validateAuth()) {
      const error = new Error('User not authenticated');
      logger.error('script', 'Script execution failed - User not authenticated', {
        scriptId: script.id,
        scriptName: script.name,
        userId
      });
      throw error;
    }

    const abortController = new AbortController();
    
    try {
      // Initialize script with empty output
      const updatedScript = {
        ...script,
        status: 'running' as const,
        progress: 0,
        output: '',
        lastRun: new Date().toISOString()
      };
      scriptStorage.updateScript(updatedScript);

      const user = authService.getCurrentUser();
      if (!user) throw new Error('User not found');

      logStorage.addActivityLog(
        'script_run',
        'info',
        `Started execution of script "${script.name}"`,
        user,
        {
          scriptId: script.id,
          scriptName: script.name,
          scriptType: script.type,
        }
      );

      runningScripts.set(script.id, { abortController });

      logger.info('script', 'Executing script via API', {
        scriptId: script.id,
        hasInputs: !!inputValues
      });

      const result = await scriptsApi.execute(script.id, script, inputValues);
      
      runningScripts.delete(script.id);

      // Update script with final output (no concatenation)
      scriptStorage.updateScript({
        ...script,
        status: result.success ? 'success' : 'failed',
        progress: 100,
        lastRun: new Date().toISOString(),
        output: result.output, // Use only the final output
      });

      logStorage.addActivityLog(
        'script_run',
        result.success ? 'info' : 'error',
        `Script "${script.name}" ${result.success ? 'completed successfully' : 'failed'}`,
        user,
        {
          scriptId: script.id,
          scriptName: script.name,
          executionTime: result.executionTime,
        }
      );

      return result;
    } catch (error) {
      const runningScript = runningScripts.get(script.id);
      if (runningScript) {
        runningScripts.delete(script.id);
      }

      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      scriptStorage.updateScript({
        ...script,
        status: 'failed',
        progress: 100,
        lastRun: new Date().toISOString(),
        output: `Error: ${errorMessage}`, // Only show error message
      });

      logger.error('script', 'Script execution failed', {
        scriptId: script.id,
        scriptName: script.name,
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined
      });

      throw error;
    }
  },

  async stopScript(scriptId: string): Promise<boolean> {
    logger.info('script', 'Attempting to stop script', { scriptId });

    if (!authService.validateAuth()) {
      const error = new Error('User not authenticated');
      logger.error('script', 'Script stop failed - User not authenticated', { scriptId });
      throw error;
    }

    const runningScript = runningScripts.get(scriptId);
    if (runningScript) {
      try {
        // Signal abort before clearing interval
        runningScript.abortController.abort();

        // Wait for the API to stop the process
        await scriptsApi.stop(scriptId);

        const script = scriptStorage.getScripts().find(s => s.id === scriptId);
        if (script) {
          const user = authService.getCurrentUser();
          if (!user) throw new Error('User not found');

          // Update script status immediately
          scriptStorage.updateScript({
            ...script,
            status: 'idle',
            progress: 0,
            output: script.output + '\nScript execution stopped by user.',
          });

          logStorage.addActivityLog(
            'script_stop',
            'info',
            `Script "${script.name}" stopped by user`,
            user,
            {
              scriptId: script.id,
              scriptName: script.name
            }
          );
        }

        runningScripts.delete(scriptId);
        return true;
      } catch (error) {
        logger.error('script', 'Failed to stop script', {
          scriptId,
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });
        runningScripts.delete(scriptId);
        return false;
      }
    }
    return false;
  },
};