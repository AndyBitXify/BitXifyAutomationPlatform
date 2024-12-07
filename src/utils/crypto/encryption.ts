import CryptoJS from 'crypto-js';
import { CRYPTO_CONFIG } from './config';

export function encrypt(text: string): string {
  return CryptoJS.AES.encrypt(text, CRYPTO_CONFIG.SECRET_KEY).toString();
}

export function decrypt(ciphertext: string): string {
  const bytes = CryptoJS.AES.decrypt(ciphertext, CRYPTO_CONFIG.SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}