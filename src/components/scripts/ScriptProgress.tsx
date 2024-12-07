import { motion } from 'framer-motion';
import { StopCircle, X, AlertCircle } from 'lucide-react';
import type { Script } from '../../types/script';

interface ScriptProgressProps {
  progress: number;
  onStop: () => void;
  onClose?: () => void;
  status: Script['status'];
  output?: string;
  error?: string;
}

export function ScriptProgress({ 
  progress, 
  onStop, 
  onClose, 
  status, 
  output,
  error
}: ScriptProgressProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'running':
        return 'bg-blue-600';
      case 'success':
        return 'bg-green-600';
      case 'failed':
        return 'bg-red-600';
      default:
        return 'bg-gray-200';
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="ml-2 text-sm text-gray-500">{Math.round(progress)}%</span>
          </div>
          <div className="flex items-center space-x-2">
            {status === 'running' ? (
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={onStop}
                className="p-1 text-red-600 hover:bg-red-50 rounded-lg"
                title="Stop Execution"
              >
                <StopCircle className="w-5 h-5" />
              </motion.button>
            ) : onClose && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={onClose}
                className="p-1 text-gray-600 hover:bg-gray-50 rounded-lg"
                title="Close"
              >
                <X className="w-5 h-5" />
              </motion.button>
            )}
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className={`h-full ${getStatusColor()}`}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-2" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-red-800 mb-1">Error</h4>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {output && (
        <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm max-h-60 overflow-y-auto">
          <pre className="text-gray-100 whitespace-pre-wrap">{output}</pre>
        </div>
      )}
    </div>
  );
}