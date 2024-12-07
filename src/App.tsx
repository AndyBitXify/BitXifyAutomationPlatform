import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './services/auth/AuthProvider';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Dashboard } from './components/dashboard/Dashboard';
import { LoginForm } from './components/auth/LoginForm';
import { ProfileSetup } from './components/auth/ProfileSetup';
import { ScriptManager } from './components/scripts/ScriptManager';
import { ActivityPage } from './components/activity/ActivityPage';
import { UserSettings } from './components/user/UserSettings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<ProfileSetup />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/scripts" element={<ScriptManager />} />
                <Route path="/activity" element={<ActivityPage />} />
                <Route path="/settings" element={<UserSettings />} />
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;