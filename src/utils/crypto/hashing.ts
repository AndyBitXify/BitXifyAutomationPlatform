import CryptoJS from 'crypto-js';
import { CRYPTO_CONFIG } from './config';

export function hashPassword(password: string): string {
  return CryptoJS.SHA256(password + CRYPTO_CONFIG.SECRET_KEY).toString();
}