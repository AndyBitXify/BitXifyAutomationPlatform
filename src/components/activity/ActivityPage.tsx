import { motion } from 'framer-motion';
import { Activity, Clock, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { logStorage } from '../../services/storage/logStorage';
import { ActivityTimeline } from './ActivityTimeline';
import { ActivityFilters } from './ActivityFilters';
import type { Log } from '../../types/log';

export function ActivityPage() {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('all');
  
  const logs = logStorage.getLogs().sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const filteredLogs = logs.filter(log => {
    if (selectedFilter !== 'all' && !log.action.includes(selectedFilter)) {
      return false;
    }

    if (dateRange !== 'all') {
      const logDate = new Date(log.timestamp);
      const now = new Date();
      switch (dateRange) {
        case 'today':
          return logDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.setDate(now.getDate() - 7));
          return logDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
          return logDate >= monthAgo;
      }
    }

    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Activity Log</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track and monitor all automation activities
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Last updated: {format(new Date(), 'MMM d, yyyy HH:mm')}</span>
          </div>
          
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[240px_1fr] gap-6">
        <ActivityFilters
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          logs={logs}
        />

        <ActivityTimeline logs={filteredLogs} />
      </div>
    </div>
  );
}