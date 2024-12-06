import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import { scriptStorage } from '../../services/storage/scriptStorage';
import { logStorage } from '../../services/storage/logStorage';
import { format, subDays } from 'date-fns';

export function DashboardChart() {
  const logs = logStorage.getLogs();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    return format(date, 'MMM dd');
  }).reverse();

  const executionData = last7Days.map(day => {
    return logs.filter(log => 
      log.action === 'script_run' && 
      format(new Date(log.timestamp), 'MMM dd') === day
    ).length;
  });

  const maxExecutions = Math.max(...executionData, 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BarChart3 className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-medium text-gray-900 ml-2">Execution History</h3>
        </div>
        <span className="text-sm text-gray-500">Last 7 days</span>
      </div>

      <div className="h-64">
        <div className="flex h-full items-end justify-between gap-2">
          {executionData.map((count, index) => (
            <div key={last7Days[index]} className="flex-1 flex flex-col items-center">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(count / maxExecutions) * 100}%` }}
                className="w-full bg-blue-500 rounded-t-lg opacity-80 hover:opacity-100 transition-opacity"
                style={{ minHeight: count > 0 ? '20px' : '4px' }}
              />
              <div className="mt-2 text-xs text-gray-600 flex flex-col items-center">
                <span className="font-medium">{count}</span>
                <span>{last7Days[index]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}