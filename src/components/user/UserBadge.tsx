import React from 'react';
import { Shield, Code } from 'lucide-react';
import type { User } from '../../types';

interface UserBadgeProps {
  user: User;
}

export function UserBadge({ user }: UserBadgeProps) {
  const getBadgeIcon = () => {
    switch (user.department) {
      case 'Development':
        return <Code className="w-4 h-4" />;
      case 'Support':
        return <Shield className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getBadgeColor = () => {
    switch (user.department) {
      case 'Development':
        return 'bg-purple-100 text-purple-700';
      case 'Support':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor()}`}>
      {getBadgeIcon()}
      <span className="ml-1">{user.department}</span>
    </div>
  );
}