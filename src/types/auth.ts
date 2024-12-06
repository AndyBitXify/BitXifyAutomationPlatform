export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  name: string;
  username: string;
  password: string;
  department: 'Development' | 'Support';
  role: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  password: string;
  department: 'Development' | 'Support';
  role: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: Omit<User, 'password'>;
}