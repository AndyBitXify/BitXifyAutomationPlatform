export const CRYPTO_CONFIG = {
    SECRET_KEY: import.meta.env.VITE_CRYPTO_KEY || 'your-secret-key-min-32-chars-long!!',
    TOKEN_LENGTH: 32,
    SALT_LENGTH: 16
  };