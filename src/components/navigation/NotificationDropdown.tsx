import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Bell, MessageSquare, GitPullRequest, Package, X } from 'lucide-react';
import { useClickAway } from 'react-use';
import { useRef } from 'react';

interface Notification {
  id: string;
  type: 'message' | 'update' | 'mention';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

const notificationIcons = {
  message: MessageSquare,
  update: GitPullRequest,
  mention: Package,
};

export function NotificationDropdown({ isOpen, onClose, notifications, onMarkAsRead }: NotificationDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);
  useClickAway(ref, onClose);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
        >
          <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-gray-500" />
              <h3 className="font-medium text-gray-900">Notifications</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => {
                const Icon = notificationIcons[notification.type];
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                      !notification.read ? 'bg-blue-50/50' : ''
                    }`}
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    <div className="flex gap-3">
                      <div className={`mt-1 ${!notification.read ? 'text-blue-500' : 'text-gray-400'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!notification.read ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {notification.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {format(new Date(notification.timestamp), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="px-4 py-8 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>No new notifications</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}