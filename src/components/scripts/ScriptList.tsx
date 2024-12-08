import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Play, Trash2, StopCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useScriptExecution } from '../../hooks/useScriptExecution';
import { scriptStorage } from '../../services/storage/scriptStorage';
import { logStorage } from '../../services/storage/logStorage';
import { ScriptProgress } from './ScriptProgress';
import { ScriptInputDialog } from './ScriptInputDialog';
import { logger } from '../../services/logger';
import type { Script, ScriptInput } from '../../types/script';
import type { User } from '../../types/auth';

interface ScriptListProps {
  scripts: Script[];
  onScriptDeleted: () => void;
}

export function ScriptList({ scripts, onScriptDeleted }: ScriptListProps) {
  const { user } = useAuth();
  const { executeScript, stopScript, isExecuting, executingScripts } = useScriptExecution();
  const [localScripts, setLocalScripts] = useState<Script[]>(scripts);
  const [showProgress, setShowProgress] = useState<Record<string, boolean>>({});
  const [scriptErrors, setScriptErrors] = useState<Record<string, string>>({});
  const [pendingInputs, setPendingInputs] = useState<{
    script: Script;
    inputs: ScriptInput[];
  } | null>(null);

  // Ensure user is properly typed
  const authenticatedUser = user as User;

  useEffect(() => {
    setLocalScripts(scripts);
  }, [scripts]);

  useEffect(() => {
    const interval = setInterval(() => {
      const scripts = scriptStorage.getScripts();
      setLocalScripts(scripts);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (script: Script) => {
    if (!authenticatedUser) {
      logger.error('script', 'Delete failed - User not authenticated', { scriptId: script.id });
      return;
    }

    if (!window.confirm('Are you sure you want to delete this script?')) {
      return;
    }
    
    if (script.status === 'running') {
      const error = 'Cannot delete a running script. Please stop it first.';
      setScriptErrors({ ...scriptErrors, [script.id]: error });
      logger.warning('script', error, { scriptId: script.id });
      return;
    }

    try {
      scriptStorage.deleteScript(script.id);
      
      logStorage.addActivityLog(
        'script_delete',
        'info',
        `Script "${script.name}" deleted`,
        authenticatedUser,
        {
          scriptId: script.id,
          scriptName: script.name
        }
      );

      onScriptDeleted();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete script';
      setScriptErrors({ ...scriptErrors, [script.id]: errorMessage });
      logger.error('script', 'Delete failed', { scriptId: script.id, error });
    }
  };

  const handleRun = async (script: Script) => {
    if (!authenticatedUser) {
      const error = 'User not authenticated';
      setScriptErrors({ ...scriptErrors, [script.id]: error });
      logger.error('script', 'Execution failed - User not authenticated', { scriptId: script.id });
      return;
    }

    // Update script status immediately to show it's running
    const updatedScript = {
      ...script,
      status: 'running' as const,
      progress: 0,
      output: '',
      lastRun: new Date().toISOString()
    };
    scriptStorage.updateScript(updatedScript);
    setLocalScripts(prevScripts => 
      prevScripts.map(s => s.id === script.id ? updatedScript : s)
    );

    setShowProgress({ ...showProgress, [script.id]: true });
    setScriptErrors({ ...scriptErrors, [script.id]: '' }); // Clear previous errors
    
    try {
      const result = await executeScript(script, authenticatedUser.id);
      if (result?.requiresInput && result.inputs) {
        setPendingInputs({ script, inputs: result.inputs });
      }
      onScriptDeleted();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to execute script';
      setScriptErrors({ ...scriptErrors, [script.id]: errorMessage });
      logger.error('script', 'Execution failed', { 
        scriptId: script.id,
        scriptName: script.name,
        error: errorMessage
      });
    }
  };

  const handleInputSubmit = async (values: Record<string, string>) => {
    if (!pendingInputs || !authenticatedUser) {
      logger.error('script', 'Input submission failed - Invalid state');
      return;
    }
    
    try {
      await executeScript(pendingInputs.script, authenticatedUser.id, values);
      setPendingInputs(null);
      onScriptDeleted();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to execute script with inputs';
      setScriptErrors({ ...scriptErrors, [pendingInputs.script.id]: errorMessage });
      logger.error('script', 'Input execution failed', {
        scriptId: pendingInputs.script.id,
        scriptName: pendingInputs.script.name,
        error: errorMessage
      });
    }
  };

  const handleStop = async (script: Script) => {
    if (!authenticatedUser) {
      const error = 'User not authenticated';
      setScriptErrors({ ...scriptErrors, [script.id]: error });
      logger.error('script', 'Stop failed - User not authenticated', { scriptId: script.id });
      return;
    }

    try {
      const stopped = await stopScript(script.id);
      if (!stopped) {
        throw new Error('Failed to stop script - no running instance found');
      }
      onScriptDeleted();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to stop script';
      setScriptErrors({ ...scriptErrors, [script.id]: errorMessage });
      logger.error('script', 'Stop failed', {
        scriptId: script.id,
        scriptName: script.name,
        error: errorMessage
      });
    }
  };

  const handleCloseProgress = (scriptId: string) => {
    setShowProgress({ ...showProgress, [scriptId]: false });
    setScriptErrors({ ...scriptErrors, [scriptId]: '' }); // Clear error on close
  };

  if (localScripts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <p className="text-gray-500">No scripts found. Upload a script to get started.</p>
      </div>
    );
  }

  return (
    <>
      <table className="min-w-full bg-white rounded-xl shadow-sm">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Run
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {localScripts.map((script) => [
            <tr key={script.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{script.name}</div>
                {script.description && (
                  <div className="text-sm text-gray-500">{script.description}</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {script.type}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {script.category}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {script.lastRun ? format(new Date(script.lastRun), 'MMM d, yyyy HH:mm') : 'Never'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  script.status === 'running' ? 'bg-blue-100 text-blue-800' :
                  script.status === 'success' ? 'bg-green-100 text-green-800' :
                  script.status === 'failed' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {script.status || 'idle'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {script.status === 'running' ? (
                  <button
                    onClick={() => handleStop(script)}
                    className="text-red-600 hover:text-red-900"
                    title="Stop Execution"
                  >
                    <StopCircle className="w-5 h-5" />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleRun(script)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                      title="Run Script"
                      disabled={executingScripts.has(script.id)}
                    >
                      <Play className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(script)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete Script"
                      disabled={executingScripts.has(script.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </>
                )}
              </td>
            </tr>,
            (showProgress[script.id] || isExecuting(script.id) || script.status === 'running') && (
              <tr key={`${script.id}-progress`} className="bg-gray-50">
                <td colSpan={6} className="px-6 py-4">
                  <ScriptProgress
                    progress={script.progress || 0}
                    status={script.status}
                    output={script.output || ''}
                    error={scriptErrors[script.id]}
                    onStop={() => handleStop(script)}
                    onClose={script.status !== 'running' ? () => handleCloseProgress(script.id) : undefined}
                  />
                </td>
              </tr>
            )
          ]).flat()}
        </tbody>
      </table>

      {pendingInputs && (
        <ScriptInputDialog
          inputs={pendingInputs.inputs}
          onSubmit={handleInputSubmit}
          onCancel={() => setPendingInputs(null)}
        />
      )}
    </>
  );
}