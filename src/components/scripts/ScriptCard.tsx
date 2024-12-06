import React from 'react';
import { motion } from 'framer-motion';
import { Play, Trash2, FileCode, Clock } from 'lucide-react';
import { ScriptProgress } from './ScriptProgress';
import type { Script } from '../../types';

interface ScriptCardProps {
  script: Script;
  onDelete: (id: string) => void;
  onRun: (id: string) => void;
  onStop: (id: string) => void;
}

export function ScriptCard({ script, onDelete, onRun, onStop }: ScriptCardProps) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'running':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileCode className="w-5 h-5 text-blue-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-900">{script.name}</h3>
            <p className="text-sm text-gray-500">{script.type}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {script.status !== 'running' && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => onRun(script.id)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <Play className="w-5 h-5" />
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => onDelete(script.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <Trash2 className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {script.status === 'running' && (
        <ScriptProgress
          progress={script.progress || 0}
          onStop={() => onStop(script.id)}
          status={script.status}
        />
      )}

      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center text-gray-500">
          <Clock className="w-4 h-4 mr-1" />
          <span>Last run: {script.lastRun || 'Never'}</span>
        </div>
        <span className={`font-medium ${getStatusColor(script.status)}`}>
          {script.status || 'Idle'}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
        <span>Size: {script.size}</span>
        <span>Modified: {script.dateModified}</span>
      </div>
    </motion.div>
  );
}