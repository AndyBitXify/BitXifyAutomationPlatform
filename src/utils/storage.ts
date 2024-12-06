const STORAGE_KEYS = {
  TOKEN: 'auth_token',
} as const;

export const storage = {
  getToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  setToken: (token: string): void => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  },

  clearToken: (): void => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  },

  clear: (): void => {
    localStorage.clear();
  },
};