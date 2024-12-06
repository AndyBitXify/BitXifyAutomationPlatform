import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Upload, Trash2, Play, StopCircle, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { logStorage } from '../../services/storage/logStorage';

export function RecentActivity() {
  const logs = logStorage.getLogs()
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'script_upload':
        return <Upload className="w-4 h-4 text-blue-500" />;
      case 'script_delete':
        return <Trash2 className="w-4 h-4 text-red-500" />;
      case 'script_run':
        return <Play className="w-4 h-4 text-green-500" />;
      case 'script_stop':
        return <StopCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <Activity className="w-4 h-4 text-yellow-500" />;
      case 'info':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm"
    >
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
      </div>
      
      <div className="divide-y divide-gray-200">
        <AnimatePresence>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="px-6 py-4 flex items-start space-x-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0">
                {getLevelIcon(log.level)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{log.message}</p>
                <div className="mt-1 flex items-center space-x-2">
                  <span className="flex items-center text-xs text-gray-500">
                    {getActionIcon(log.action)}
                    <span className="ml-1 capitalize">{log.action.replace('_', ' ')}</span>
                  </span>
                  <span className="text-xs text-gray-500">
                    {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm:ss')}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {logs.length === 0 && (
          <div className="px-6 py-8 text-center text-gray-500">
            No activity logs found
          </div>
        )}
      </div>
    </motion.div>
  );
}