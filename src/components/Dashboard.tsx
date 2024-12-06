import React from 'react';
import { Activity, CheckCircle, XCircle, PlayCircle } from 'lucide-react';
import type { DashboardStats } from '../types';

interface DashboardProps {
  stats: DashboardStats;
}

export function Dashboard({ stats }: DashboardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <Activity className="w-8 h-8 text-blue-500 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-600">Total Scripts</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.totalScripts}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <PlayCircle className="w-8 h-8 text-green-500 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-600">Active Scripts</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.activeScripts}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <XCircle className="w-8 h-8 text-red-500 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-600">Failed Scripts</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.failedScripts}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <CheckCircle className="w-8 h-8 text-indigo-500 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-600">Success Rate</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.successRate}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}