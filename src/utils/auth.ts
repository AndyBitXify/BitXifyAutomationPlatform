import { User, LoginCredentials } from '../types';
import { storage } from './storage';
import { hashPassword } from './crypto';

export const auth = {
  register: (user: Omit<User, 'id' | 'createdAt'>): User => {
    const hashedPassword = hashPassword(user.password);
    const newUser: User = {
      id: Date.now().toString(),
      ...user,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    const users = storage.getUsers();
    if (users.some((u) => u.username === user.username)) {
      throw new Error('Username already exists');
    }

    storage.setUsers([...users, newUser]);
    return newUser;
  },

  login: (credentials: LoginCredentials): User => {
    const users = storage.getUsers();
    const hashedPassword = hashPassword(credentials.password);
    const user = users.find(
      (u) => u.username === credentials.username && u.password === hashedPassword
    );

    if (!user) {
      throw new Error('Invalid credentials');
    }

    return user;
  },
};