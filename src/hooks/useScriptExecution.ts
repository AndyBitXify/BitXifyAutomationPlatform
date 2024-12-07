import { useState, useCallback } from 'react';
import { scriptStorage } from '../services/storage/scriptStorage';
import { scriptExecutor } from '../services/scriptExecutor';
import type { Script } from '../types/script';

export function useScriptExecution() {
  const [executingScripts, setExecutingScripts] = useState<Set<string>>(new Set());

  const executeScript = useCallback(async (
    script: Script, 
    userId: string,
    inputValues?: Record<string, string>
  ) => {
    setExecutingScripts(prev => new Set(prev).add(script.id));
    
    try {
      const result = await scriptExecutor.executeScript(script, userId, inputValues);
      return result;
    } finally {
      setExecutingScripts(prev => {
        const next = new Set(prev);
        next.delete(script.id);
        return next;
      });
    }
  }, []);

  const stopScript = useCallback(async (scriptId: string): Promise<boolean> => {
    const success = await scriptExecutor.stopScript(scriptId);
    if (success) {
      setExecutingScripts(prev => {
        const next = new Set(prev);
        next.delete(scriptId);
        return next;
      });
    }
    return success;
  }, []);

  return {
    executingScripts,
    executeScript,
    stopScript,
    isExecuting: (scriptId: string) => executingScripts.has(scriptId)
  };
}