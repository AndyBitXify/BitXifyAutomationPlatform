import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';
import { scriptStorage } from '../../services/storage/scriptStorage';

export function DashboardSummary() {
  const scripts = scriptStorage.getScripts();
  const activeScripts = scripts.filter(s => s.status === 'running').length;
  const successRate = scripts.length > 0
    ? Math.round((scripts.filter(s => s.status === 'success').length / scripts.length) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-8 text-white"
    >
      <div className="flex items-center mb-4">
        <Terminal className="w-8 h-8" />
        <h2 className="text-2xl font-bold ml-3">Dashboard Overview</h2>
      </div>
      <p className="text-lg opacity-90">
        {scripts.length > 0 ? (
          <>
            Currently managing <span className="font-semibold">{scripts.length}</span> script{scripts.length !== 1 ? 's' : ''} 
            {activeScripts > 0 && (
              <> with <span className="font-semibold">{activeScripts}</span> active execution{activeScripts !== 1 ? 's' : ''}</>
            )}.
            {' '}Overall success rate: <span className="font-semibold">{successRate}%</span>
          </>
        ) : (
          'No scripts uploaded yet. Get started by uploading your first automation script!'
        )}
      </p>
    </motion.div>
  );
}