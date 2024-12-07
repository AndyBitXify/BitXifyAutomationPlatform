import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../../utils/storage';
import { encrypt, decrypt } from '../../utils/crypto';
import { loginSchema, registerSchema } from '../../utils/validation';
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = storage.getToken();
        if (token) {
          const decryptedToken = decrypt(token);
          const userData = await validateToken(decryptedToken);
          setUser(userData);
        }
      } catch (error) {
        logger.error('auth', 'Failed to initialize auth', { error });
        storage.clearToken();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      loginSchema.parse(credentials);
      setIsLoading(true);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const { user: userData, token } = await response.json();
      storage.setToken(encrypt(token));
      setUser(userData);
      
      logger.info('auth', 'User logged in successfully', {
        userId: userData.id,
        username: userData.username
      });
      
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
      registerSchema.parse(data);
      setIsLoading(true);
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const { user: userData, token } = await response.json();
      storage.setToken(encrypt(token));
      setUser(userData);
      
      logger.info('auth', 'User registered successfully', {
        userId: userData.id,
        username: userData.username
      });
      
      navigate('/');
    } catch (error) {
      logger.error('auth', 'Registration failed', { error });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    storage.clearToken();
    setUser(null);
    logger.info('auth', 'User logged out');
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

async function validateToken(token: string): Promise<User> {
  const response = await fetch('/api/auth/validate', {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  if (!response.ok) {
    throw new Error('Invalid token');
  }
  
  return response.json();
}