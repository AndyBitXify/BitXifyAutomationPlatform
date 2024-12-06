import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api/auth';
import { storage } from '../utils/storage';
import type { LoginCredentials, RegisterData } from '../types/auth';

export function useAuth() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: authApi.getProfile,
    retry: false,
    enabled: !!storage.getToken(),
  });

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data) => {
      storage.setToken(data.token);
      queryClient.setQueryData(['user'], data.user);
      navigate('/');
    },
  });

  const registerMutation = useMutation({
    mutationFn: (userData: RegisterData) => authApi.register(userData),
    onSuccess: (data) => {
      storage.setToken(data.token);
      queryClient.setQueryData(['user'], data.user);
      navigate('/');
    },
  });

  const logout = () => {
    storage.clearToken();
    queryClient.clear();
    navigate('/login');
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