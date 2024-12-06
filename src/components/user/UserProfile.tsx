import { motion } from 'framer-motion';
import { useState } from 'react';
import { User as UserIcon, ChevronDown } from 'lucide-react';
import { ProfileDropdown } from './ProfileDropdown';
import { useLocalStorage } from 'react-use';
import type { User } from '../../types';

interface UserProfileProps {
  user: User;
  onLogout: () => void;
}

export function UserProfile({ user, onLogout }: UserProfileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useLocalStorage<'light' | 'dark' | 'system'>(
    'theme',
    'system'
  );

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    // Apply theme changes here
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
      >
        <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-2 rounded-lg shadow-lg">
          <UserIcon className="w-4 h-4 text-white" />
        </div>
        <div className="text-left">
          <p className="text-sm font-medium text-gray-900">{user.name}</p>
          <p className="text-xs text-gray-500">{user.role}</p>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </motion.button>

      <ProfileDropdown
        user={user}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onLogout={onLogout}
        onThemeChange={handleThemeChange}
        currentTheme={theme ?? 'system'}
      />
    </div>
  );
}