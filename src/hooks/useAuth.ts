import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth/AuthService';
import { storage } from '../utils/storage';
import { logger } from '../services/logger';
import type { LoginCredentials, RegisterData } from '../types/auth';

export function useAuth() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const currentUser = await authService.initialize();
        if (currentUser) {
          logger.info('auth', 'User authenticated from storage', { userId: currentUser.id });
          return currentUser;
        }
        return null;
      } catch (error) {
        logger.error('auth', 'Failed to initialize auth', { error });
        return null;
      }
    },
    retry: false,
    staleTime: Infinity
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const result = await authService.login(credentials);
      return result;
    },
    onSuccess: (data) => {
      storage.setCurrentUser(data.user);
      queryClient.setQueryData(['user'], data.user);
      navigate('/');
    },
    onError: (error) => {
      logger.error('auth', 'Login failed', { error });
      storage.clearCurrentUser();
    }
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterData) => {
      const result = await authService.register(userData);
      return result;
    },
    onSuccess: (data) => {
      storage.setCurrentUser(data.user);
      queryClient.setQueryData(['user'], data.user);
      navigate('/');
    },
    onError: (error) => {
      logger.error('auth', 'Registration failed', { error });
      storage.clearCurrentUser();
    }
  });

  const logout = () => {
    try {
      authService.logout();
      storage.clearCurrentUser();
      queryClient.clear();
      navigate('/login');
    } catch (error) {
      logger.error('auth', 'Logout failed', { error });
    }
  };

  return {
    user,
    isLoading,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
}