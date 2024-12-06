import React from 'react';
import { User as UserIcon, LogOut } from 'lucide-react';
import type { User } from '../types';

interface UserProfileProps {
  user: User;
  onLogout: () => void;
}

export function UserProfile({ user, onLogout }: UserProfileProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <UserIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.department}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="text-gray-500 hover:text-gray-700"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-sm">
          <p className="text-gray-500">Role</p>
          <p className="font-medium">{user.role}</p>
        </div>
      </div>
    </div>
  );
}