import { motion } from 'framer-motion';
import { DashboardStats } from './DashboardStats';
import { DashboardChart } from './DashboardChart';
import { DashboardSummary } from './DashboardSummary';
import { RecentActivity } from './RecentActivity';

export function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <DashboardSummary />
      <DashboardStats />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardChart />
        <RecentActivity />
      </div>
    </motion.div>
  );
}