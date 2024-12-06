import React from 'react';
import type { User } from '../../types';

interface UserInfoProps {
  user: User;
}

export function UserInfo({ user }: UserInfoProps) {
  return (
    <div>
      <h3 className="font-medium text-gray-900">{user.name}</h3>
      <div className="flex flex-col">
        <span className="text-sm text-gray-500">{user.department}</span>
        <span className="text-xs text-gray-400">{user.role}</span>
      </div>
    </div>
  );
}