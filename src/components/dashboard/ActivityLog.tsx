import { format } from 'date-fns';
import { AlertCircle, CheckCircle, Info, Upload, Trash2, Play, StopCircle } from 'lucide-react';
import { logStorage } from '../../services/storage/logStorage';
import type { Log } from '../../types/log';

export function ActivityLog() {
  const logs = logStorage.getLogs().sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const getActionIcon = (action: Log['action']) => {
    switch (action) {
      case 'script_upload':
        return <Upload className="w-4 h-4" />;
      case 'script_delete':
        return <Trash2 className="w-4 h-4" />;
      case 'script_run':
        return <Play className="w-4 h-4" />;
      case 'script_stop':
        return <StopCircle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getLevelIcon = (level: Log['level']) => {
    switch (level) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'info':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm h-full">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {logs.map((log) => (
          <div key={log.id} className="px-6 py-4 flex items-start space-x-4">
            <div className="flex-shrink-0">
              {getLevelIcon(log.level)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">{log.message}</p>
              <div className="mt-1 flex items-center space-x-2">
                <span className="flex items-center text-xs text-gray-500">
                  {getActionIcon(log.action)}
                  <span className="ml-1">{log.action.replace('_', ' ')}</span>
                </span>
                <span className="text-xs text-gray-500">
                  {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm:ss')}
                </span>
              </div>
            </div>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="px-6 py-4 text-center text-gray-500">
            No activity logs found
          </div>
        )}
      </div>
    </div>
  );
}