import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Log, User } from '../types';

interface LogViewerProps {
  logs: Log[];
  users: User[];
}

const PAGE_SIZE = 50;

export function LogViewer({ logs, users }: LogViewerProps) {
  const [page, setPage] = React.useState(1);
  const paginatedLogs = logs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  
  return (
    <div className="overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Activity Log</h3>
      </div>
      <div className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
        <AnimatePresence>
          {paginatedLogs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 hover:bg-gray-50"
            >
              {/* ... existing log entry content ... */}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {logs.length > PAGE_SIZE && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          <nav className="flex justify-between">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded-md bg-white shadow-sm disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page * PAGE_SIZE >= logs.length}
              className="px-3 py-1 rounded-md bg-white shadow-sm disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}