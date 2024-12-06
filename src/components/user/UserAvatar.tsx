import React from 'react';
import { User as UserIcon } from 'lucide-react';
import type { User } from '../../types';

interface UserAvatarProps {
  user: User;
}

export function UserAvatar({ user }: UserAvatarProps) {
  return (
    <div className="bg-blue-100 p-2 rounded-full">
      <UserIcon className="w-6 h-6 text-blue-600" />
    </div>
  );
}