import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from './AuthService';
import { storage } from '../../utils/storage';
import { logger } from '../logger';
import type { User, LoginCredentials, RegisterData } from '../../types/auth';

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize from storage
    const storedUser = storage.getCurrentUser();
    return storedUser || authService.getCurrentUser();
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const userData = await authService.initialize();
        if (userData) {
          setUser(userData);
          storage.setCurrentUser(userData);
        }
      } catch (error) {
        logger.error('auth', 'Failed to initialize auth', { error });
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const { user: userData } = await authService.login(credentials);
      setUser(userData);
      storage.setCurrentUser(userData);
      navigate('/');
    } catch (error) {
      logger.error('auth', 'Login failed', { error });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      const { user: userData } = await authService.register(data);
      setUser(userData);
      storage.setCurrentUser(userData);
      navigate('/');
    } catch (error) {
      logger.error('auth', 'Registration failed', { error });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}