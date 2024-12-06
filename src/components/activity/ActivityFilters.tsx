import { motion } from 'framer-motion';
import { Filter, Calendar, Activity } from 'lucide-react';
import type { Log } from '../../types/log';

interface ActivityFiltersProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  dateRange: string;
  onDateRangeChange: (range: 'today' | 'week' | 'month' | 'all') => void;
  logs: Log[];
}

export function ActivityFilters({
  selectedFilter,
  onFilterChange,
  dateRange,
  onDateRangeChange,
  logs
}: ActivityFiltersProps) {
  const actionTypes = [
    { id: 'all', label: 'All Activities' },
    { id: 'script', label: 'Script Activities' },
    { id: 'user', label: 'User Activities' },
  ];

  const dateRanges = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'Last 7 Days' },
    { id: 'month', label: 'Last 30 Days' },
    { id: 'all', label: 'All Time' },
  ];

  const getActivityStats = () => {
    return {
      total: logs.length,
      scripts: logs.filter(log => log.action.includes('script')).length,
      users: logs.filter(log => log.action.includes('user')).length,
      errors: logs.filter(log => log.level === 'error').length,
    };
  };

  const stats = getActivityStats();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-gray-500" />
          <h2 className="text-sm font-medium text-gray-900">Filters</h2>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-medium text-gray-500 mb-2">Activity Type</h3>
            <div className="space-y-1">
              {actionTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => onFilterChange(type.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                    selectedFilter === type.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-medium text-gray-500 mb-2">Time Range</h3>
            <div className="space-y-1">
              {dateRanges.map(range => (
                <button
                  key={range.id}
                  onClick={() => onDateRangeChange(range.id as 'today' | 'week' | 'month' | 'all')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                    dateRange === range.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-gray-500" />
          <h2 className="text-sm font-medium text-gray-900">Activity Summary</h2>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Total Activities</span>
            <span className="font-medium text-gray-900">{stats.total}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Script Activities</span>
            <span className="font-medium text-gray-900">{stats.scripts}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">User Activities</span>
            <span className="font-medium text-gray-900">{stats.users}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Errors</span>
            <span className="font-medium text-red-600">{stats.errors}</span>
          </div>
        </div>
      </div>
    </div>
  );
}