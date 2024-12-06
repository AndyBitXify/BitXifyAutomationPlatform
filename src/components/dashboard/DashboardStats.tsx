import { Activity, CheckCircle, XCircle, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { scriptStorage } from '../../services/storage/scriptStorage';

export function DashboardStats() {
  const scripts = scriptStorage.getScripts();
  
  const stats = {
    totalScripts: scripts.length,
    activeScripts: scripts.filter(s => s.status === 'running').length,
    failedScripts: scripts.filter(s => s.status === 'failed').length,
    successRate: scripts.length > 0
      ? Math.round((scripts.filter(s => s.status === 'success').length / scripts.length) * 100)
      : 0
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <div className="flex items-center">
          <div className="p-3 rounded-lg bg-blue-100">
            <Activity className="w-6 h-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Scripts</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.totalScripts}</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <div className="flex items-center">
          <div className="p-3 rounded-lg bg-green-100">
            <PlayCircle className="w-6 h-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Active Scripts</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.activeScripts}</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <div className="flex items-center">
          <div className="p-3 rounded-lg bg-red-100">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Failed Scripts</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.failedScripts}</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <div className="flex items-center">
          <div className="p-3 rounded-lg bg-indigo-100">
            <CheckCircle className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Success Rate</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.successRate}%</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}