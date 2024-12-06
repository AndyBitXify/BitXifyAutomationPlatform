import { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Bell, Search } from 'lucide-react';
import { UserProfile } from '../user/UserProfile';
import { NotificationDropdown } from '../navigation/NotificationDropdown';
import { useLocalStorage } from 'react-use';
import { useNavigate } from 'react-router-dom';
import { scriptStorage } from '../../services/storage/scriptStorage';
import type { User } from '../../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

const mockNotifications = [
  {
    id: '1',
    type: 'message' as const,
    title: 'New Script Added',
    description: 'A new automation script has been added to your workspace.',
    timestamp: new Date().toISOString(),
    read: false,
  },
  {
    id: '2',
    type: 'update' as const,
    title: 'Script Execution Complete',
    description: 'The database backup script completed successfully.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: true,
  },
];

export function Header({ user, onLogout }: HeaderProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useLocalStorage('notifications', mockNotifications);

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications?.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim()) {
      const scripts = scriptStorage.getScripts();
      const filteredScripts = scripts.filter(script => 
        script.name.toLowerCase().includes(query.toLowerCase()) ||
        script.description?.toLowerCase().includes(query.toLowerCase())
      );
      
      navigate('/scripts', { state: { searchResults: filteredScripts } });
    }
  };

  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;

  return (
    <header className="sticky top-0 z-30">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-8xl mx-auto">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            <div className="flex items-center gap-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2"
              >
                <Terminal className="w-8 h-8 text-blue-600" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                  BitXify Automation Platform
                </span>
              </motion.div>
              
              <div className="hidden md:flex relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Search scripts..."
                  className="pl-10 pr-4 py-2 w-64 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative p-2 text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full" />
                  )}
                </motion.button>

                <NotificationDropdown
                  isOpen={isNotificationsOpen}
                  onClose={() => setIsNotificationsOpen(false)}
                  notifications={notifications ?? []}
                  onMarkAsRead={handleMarkAsRead}
                />
              </div>
              
              <div className="h-6 w-px bg-gray-200" />
              
              <UserProfile user={user} onLogout={onLogout} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}