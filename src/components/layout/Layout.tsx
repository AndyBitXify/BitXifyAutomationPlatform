import { Header } from './Header';
import { Sidebar } from '../navigation/Sidebar';
import { useAuth } from '../../hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header user={user!} onLogout={logout} />
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          <Sidebar />
          <main className="flex-1 min-w-0">
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-8 min-h-[calc(100vh-7rem)]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}