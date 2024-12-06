import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  Upload, 
  Trash2, 
  Play, 
  StopCircle,
  AlertCircle,
  CheckCircle,
  Info,
  User
} from 'lucide-react';
import type { Log } from '../../types/log';

interface ActivityTimelineProps {
  logs: Log[];
}

export function ActivityTimeline({ logs }: ActivityTimelineProps) {
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

  const getActionColor = (action: Log['action']) => {
    switch (action) {
      case 'script_upload':
        return 'bg-blue-100 text-blue-700';
      case 'script_delete':
        return 'bg-red-100 text-red-700';
      case 'script_run':
        return 'bg-green-100 text-green-700';
      case 'script_stop':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <Info className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500">No activity logs found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
      {logs.map((log, index) => (
        <motion.div
          key={log.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="p-4 hover:bg-gray-50"
        >
          <div className="flex items-start gap-3">
            <div className="mt-1">{getLevelIcon(log.level)}</div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">{log.message}</p>
              
              <div className="mt-1 flex items-center gap-2 text-xs">
                <span className={`px-2 py-0.5 rounded-full ${getActionColor(log.action)} inline-flex items-center gap-1`}>
                  {getActionIcon(log.action)}
                  <span>{log.action.replace('_', ' ')}</span>
                </span>
                
                <span className="text-gray-500">
                  {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm:ss')}
                </span>

                <span className="flex items-center gap-1 text-gray-500">
                  <User className="w-3 h-3" />
                  <span>{log.userName}</span>
                  <span className="text-gray-400">({log.userRole})</span>
                </span>
              </div>

              {log.details && (
                <div className="mt-2 text-xs text-gray-500">
                  <pre className="whitespace-pre-wrap font-mono bg-gray-50 p-2 rounded-lg">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}