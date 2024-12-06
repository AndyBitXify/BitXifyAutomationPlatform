import { scriptStorage } from './storage/scriptStorage';
import { logStorage } from './storage/logStorage';
import { scriptsApi } from './api/scripts';
import type { Script } from '../types/script';

// Track running scripts and their intervals
const runningScripts = new Map<string, {
  intervalId: NodeJS.Timeout;
  abortController: AbortController;
}>();

export const scriptExecutor = {
  async executeScript(script: Script, userId: string) {
    if (runningScripts.has(script.id)) {
      throw new Error('Script is already running');
    }

    const abortController = new AbortController();
    let progress = 0;
    
    try {
      // Update initial script status
      const updatedScript = {
        ...script,
        status: 'running' as const,
        progress: 0,
        lastRun: new Date().toISOString(),
        output: `[${new Date().toISOString()}] Starting script execution...\n`,
      };
      scriptStorage.updateScript(updatedScript);

      // Log the script run action
      logStorage.addLog({
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        userId,
        action: 'script_run',
        level: 'info',
        message: `Started execution of script "${script.name}"`,
        details: {
          scriptId: script.id,
          scriptName: script.name,
          scriptType: script.type,
        },
      });

      // Start progress simulation
      const intervalId = setInterval(() => {
        if (progress < 90) {
          progress += Math.random() * 10;
          scriptStorage.updateScript({
            ...script,
            status: 'running',
            progress: Math.min(Math.round(progress), 90),
          });
        }
      }, 1000);

      // Store running script info
      runningScripts.set(script.id, { intervalId, abortController });

      // Execute the script
      const result = await scriptsApi.execute(script.id, script);

      // Clear interval and update final status
      clearInterval(intervalId);
      runningScripts.delete(script.id);

      // Update final script status
      scriptStorage.updateScript({
        ...script,
        status: result.success ? 'success' : 'failed',
        progress: 100,
        lastRun: new Date().toISOString(),
        output: `${script.output || ''}\n${result.output}`,
      });

      // Log completion
      logStorage.addLog({
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        userId,
        action: 'script_run',
        level: result.success ? 'info' : 'error',
        message: `Script "${script.name}" ${result.success ? 'completed successfully' : 'failed'}`,
        details: {
          scriptId: script.id,
          scriptName: script.name,
          executionTime: result.executionTime,
        },
      });

    } catch (error) {
      // Clean up on error
      const runningScript = runningScripts.get(script.id);
      if (runningScript) {
        clearInterval(runningScript.intervalId);
        runningScripts.delete(script.id);
      }

      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      const finalOutput = `Error: ${errorMessage}\n${script.output || ''}`;

      scriptStorage.updateScript({
        ...script,
        status: 'failed',
        progress: 100,
        lastRun: new Date().toISOString(),
        output: finalOutput,
      });

      throw error;
    }
  },

  async stopScript(scriptId: string): Promise<boolean> {
    const runningScript = runningScripts.get(scriptId);
    if (runningScript) {
      try {
        // Stop progress updates
        clearInterval(runningScript.intervalId);
        
        // Abort the script execution
        runningScript.abortController.abort();
        
        // Request the server to stop the script
        await scriptsApi.stop(scriptId);
        
        // Update script status
        const script = scriptStorage.getScripts().find(s => s.id === scriptId);
        if (script) {
          scriptStorage.updateScript({
            ...script,
            status: 'idle',
            progress: 0,
            output: `${script.output || ''}\n[${new Date().toISOString()}] Script execution stopped by user.`,
          });
        }

        runningScripts.delete(scriptId);
        return true;
      } catch (error) {
        console.error('Error stopping script:', error);
        return false;
      }
    }
    return false;
  },
};