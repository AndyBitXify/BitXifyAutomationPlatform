import type { AuthResponse, LoginCredentials, RegisterData, User } from '../types/auth';
import type { DashboardStats } from '../types/dashboard';

// In-memory storage
let users: User[] = [];

// Helper to create a simple token
const createToken = (userId: string): string => {
  return btoa(JSON.stringify({ userId, exp: Date.now() + 24 * 60 * 60 * 1000 }));
};

// Initialize with a test user
const initializeTestUser = () => {
  if (users.length === 0) {
    users.push({
      id: '1',
      name: 'Test User',
      username: 'test',
      password: 'test',
      department: 'Development',
      role: 'Developer',
      createdAt: new Date().toISOString(),
    });
  }
};

initializeTestUser();

// Mock dashboard stats
const mockDashboardStats: DashboardStats = {
  totalScripts: 12,
  activeScripts: 3,
  failedScripts: 2,
  successRate: 75,
  recentExecutions: Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    count: Math.floor(Math.random() * 10),
  })).reverse(),
};

export const mockBackend = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = users.find(u => u.username === credentials.username);
    if (!user || user.password !== credentials.password) {
      throw new Error('Invalid username or password');
    }

    const { password, ...userWithoutPassword } = user;
    const token = createToken(user.id);
    
    return { token, user: userWithoutPassword };
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (users.some(u => u.username === data.username)) {
      throw new Error('Username already exists');
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    const { password, ...userWithoutPassword } = newUser;
    const token = createToken(newUser.id);

    return { token, user: userWithoutPassword };
  },

  getProfile: async (token: string): Promise<Omit<User, 'password'>> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      const { userId } = JSON.parse(atob(token));
      const user = users.find(u => u.id === userId);
      if (!user) {
        throw new Error('User not found');
      }

      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch {
      throw new Error('Invalid token');
    }
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockDashboardStats;
  },
};