import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, FileCode, Settings, Activity } from 'lucide-react';

export function Sidebar() {
  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/scripts', icon: FileCode, label: 'Scripts' },
    { to: '/activity', icon: Activity, label: 'Activity' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="w-64 shrink-0">
      <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-4 sticky top-6">
        <div className="space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-gray-600 hover:bg-white hover:shadow-sm'
                }`
              }
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-5 h-5" />
              </motion.div>
              <span className="font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}