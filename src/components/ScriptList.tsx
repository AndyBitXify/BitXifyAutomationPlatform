import React from 'react';
import { Play, Trash2, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import type { Script } from '../types';

interface ScriptListProps {
  scripts: Script[];
  onDelete: (id: string) => void;
  onRun: (id: string) => void;
}

const statusIcons = {
  success: <CheckCircle className="w-5 h-5 text-green-500" />,
  failed: <AlertCircle className="w-5 h-5 text-red-500" />,
  running: <Clock className="w-5 h-5 text-blue-500 animate-spin" />,
  idle: null,
};

export function ScriptList({ scripts, onDelete, onRun }: ScriptListProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Run</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {scripts.map((script) => (
            <tr key={script.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{script.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{script.type}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{script.lastRun || 'Never'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {script.status && statusIcons[script.status]}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{script.size}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onRun(script.id)}
                  className="text-blue-600 hover:text-blue-900 mr-4"
                >
                  <Play className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDelete(script.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}