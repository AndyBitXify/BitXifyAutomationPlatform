import { motion, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';
import { useClickAway } from 'react-use';
import {
  User as UserIcon,
  Settings,
  LogOut,
  Bell,
  Moon,
  Sun,
  Laptop,
} from 'lucide-react';
import type { User } from '../../types';

interface ProfileDropdownProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
  currentTheme: 'light' | 'dark' | 'system';
}

export function ProfileDropdown({
  user,
  isOpen,
  onClose,
  onLogout,
  onThemeChange,
  currentTheme,
}: ProfileDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);
  useClickAway(ref, onClose);

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Laptop },
  ] as const;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
        >
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-2 rounded-lg">
                <UserIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">{user.department}</p>
              </div>
            </div>
          </div>

          <div className="px-2 py-2">
            <button className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
              <Settings className="w-4 h-4" />
              <span className="text-sm">Account Settings</span>
            </button>

            <button className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
              <Bell className="w-4 h-4" />
              <span className="text-sm">Notification Preferences</span>
            </button>
          </div>

          <div className="px-4 py-2 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-500 mb-2">Theme</p>
            <div className="space-y-1">
              {themeOptions.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => onThemeChange(value)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    currentTheme === value
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="px-2 py-2 border-t border-gray-100">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}