import { storage } from '../../utils/storage';
import { logger } from '../logger';
import { generateSecureToken } from '../../utils/crypto';
import type { LoginCredentials, RegisterData, User } from '../../types/auth';

// Mock user for development
const MOCK_USER: User = {
  id: '1',
  name: 'Test User',
  username: 'test',
  password: 'test', // In production, this would be hashed
  department: 'Development',
  role: 'Developer',
  createdAt: new Date().toISOString()
};

class AuthService {
  private static instance: AuthService;
  private initialized = false;
  private currentUser: User | null = null;
  private currentToken: string | null = null;

  private constructor() {
    logger.info('auth', 'Initializing AuthService');
    this.initializeFromStorage();
  }

  private initializeFromStorage() {
    try {
      const storedUser = localStorage.getItem('current_user');
      const token = localStorage.getItem('auth_token');

      if (storedUser && token) {
        logger.info('auth', 'Found stored user and token');
        this.currentUser = JSON.parse(storedUser);
        this.currentToken = token;
      } else {
        logger.info('auth', 'No stored auth state found');
        this.clearAuth();
      }
    } catch (error) {
      logger.error('auth', 'Error during storage initialization', { error });
      this.clearAuth();
    } finally {
      this.initialized = true;
    }
  }

  private clearAuth() {
    this.currentUser = null;
    this.currentToken = null;
    localStorage.removeItem('current_user');
    localStorage.removeItem('auth_token');
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async initialize(): Promise<User | null> {
    logger.info('auth', 'Initializing auth state');
    
    if (!this.initialized) {
      this.initializeFromStorage();
    }

    if (this.currentUser && this.currentToken) {
      logger.info('auth', 'User authenticated', { userId: this.currentUser.id });
      return this.currentUser;
    }

    logger.info('auth', 'No authenticated user');
    this.clearAuth();
    return null;
  }

  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    logger.info('auth', 'Attempting login', { username: credentials.username });
    
    try {
      if (credentials.username === MOCK_USER.username && credentials.password === MOCK_USER.password) {
        const token = generateSecureToken();
        this.currentUser = MOCK_USER;
        this.currentToken = token;
        
        localStorage.setItem('current_user', JSON.stringify(MOCK_USER));
        localStorage.setItem('auth_token', token);

        logger.info('auth', 'Login successful', {
          userId: MOCK_USER.id,
          username: MOCK_USER.username
        });

        return { user: MOCK_USER, token };
      }

      logger.error('auth', 'Invalid credentials', { username: credentials.username });
      throw new Error('Invalid credentials');
    } catch (error) {
      logger.error('auth', 'Login failed', { error, username: credentials.username });
      this.clearAuth();
      throw new Error('Invalid username or password');
    }
  }

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    logger.info('auth', 'Attempting registration', { username: data.username });
    
    try {
      const newUser: User = {
        id: crypto.randomUUID(),
        ...data,
        createdAt: new Date().toISOString()
      };
      
      const token = generateSecureToken();
      this.currentUser = newUser;
      this.currentToken = token;
      
      localStorage.setItem('current_user', JSON.stringify(newUser));
      localStorage.setItem('auth_token', token);

      logger.info('auth', 'Registration successful', {
        userId: newUser.id,
        username: newUser.username
      });

      return { user: newUser, token };
    } catch (error) {
      logger.error('auth', 'Registration failed', { error });
      this.clearAuth();
      throw new Error('Registration failed. Please try again.');
    }
  }

  getCurrentUser(): User | null {
    if (!this.initialized) {
      logger.warning('auth', 'Attempted to get current user before initialization');
      this.initializeFromStorage();
    }
    return this.currentUser;
  }

  getToken(): string | null {
    return this.currentToken;
  }

  validateAuth(): boolean {
    return !!this.currentUser && !!this.currentToken;
  }

  logout(): void {
    logger.info('auth', 'Logging out user', { 
      userId: this.currentUser?.id 
    });
    this.clearAuth();
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

export const authService = AuthService.getInstance();