import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Play, Trash2, StopCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useScriptExecution } from '../../hooks/useScriptExecution';
import { scriptStorage } from '../../services/storage/scriptStorage';
import { logStorage } from '../../services/storage/logStorage';
import { ScriptProgress } from './ScriptProgress';
import type { Script } from '../../types/script';

interface ScriptListProps {
  scripts: Script[];
  onScriptDeleted: () => void;
}

export function ScriptList({ scripts, onScriptDeleted }: ScriptListProps) {
  const { user } = useAuth();
  const { executeScript, stopScript, isExecuting } = useScriptExecution();
  const [localScripts, setLocalScripts] = useState<Script[]>(scripts);
  const [showProgress, setShowProgress] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setLocalScripts(scripts);
  }, [scripts]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLocalScripts(scriptStorage.getScripts());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleDelete = (script: Script) => {
    if (!user || !window.confirm('Are you sure you want to delete this script?')) return;
    
    if (script.status === 'running') {
      alert('Cannot delete a running script. Please stop it first.');
      return;
    }

    scriptStorage.deleteScript(script.id);
    
    logStorage.addActivityLog(
      'script_delete',
      'info',
      `Script "${script.name}" deleted`,
      user,
      {
        scriptId: script.id,
        scriptName: script.name
      }
    );

    onScriptDeleted();
  };

  const handleRun = async (script: Script) => {
    if (!user) return;
    setShowProgress({ ...showProgress, [script.id]: true });
    try {
      await executeScript(script, user.id);
      onScriptDeleted();
    } catch (error) {
      console.error('Failed to execute script:', error);
      alert(error instanceof Error ? error.message : 'Failed to execute script');
    }
  };

  const handleStop = async (script: Script) => {
    if (!user) return;
    const stopped = await stopScript(script.id);
    if (!stopped) {
      console.warn('Failed to stop script - no running instance found');
    }
    onScriptDeleted();
  };

  const handleCloseProgress = (scriptId: string) => {
    setShowProgress({ ...showProgress, [scriptId]: false });
  };

  const formatLastRun = (script: Script) => {
    if (script.lastRun) {
      return format(new Date(script.lastRun), 'MMM d, yyyy HH:mm');
    }
    if (script.status === 'running') {
      return 'Running...';
    }
    return 'Never';
  };

  const getStatusBadgeClass = (status: Script['status']) => {
    switch (status) {
      case 'running':
        return 'bg-blue-100 text-blue-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (localScripts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <p className="text-gray-500">No scripts found. Upload a script to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="w-full">
        <table className="min-w-full divide-y divide-gray-200">
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
          <tbody className="bg-white divide-y divide-gray-200">
            {localScripts.map((script) => [
              <tr key={`${script.id}-main`} className="hover:bg-gray-50">
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
                  {formatLastRun(script)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(script.status)}`}>
                    {script.status || 'idle'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {isExecuting(script.id) || script.status === 'running' ? (
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
                      >
                        <Play className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(script)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Script"
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
                      onStop={() => handleStop(script)}
                      onClose={script.status !== 'running' ? () => handleCloseProgress(script.id) : undefined}
                    />
                  </td>
                </tr>
              )
            ]).flat()}
          </tbody>
        </table>
      </div>
    </div>
  );
}