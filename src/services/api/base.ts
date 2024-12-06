import axios from 'axios';
import { storage } from '../../utils/storage';

const BASE_URL = 'http://localhost:3000/api';

export const api = {
  async post<T>(url: string, data?: unknown): Promise<{ data: T }> {
    const response = await axios.post(`${BASE_URL}${url}`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...(storage.getToken() && {
          Authorization: `Bearer ${storage.getToken()}`,
        }),
      },
    });
    return response;
  },

  async get<T>(url: string): Promise<{ data: T }> {
    const response = await axios.get(`${BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(storage.getToken() && {
          Authorization: `Bearer ${storage.getToken()}`,
        }),
      },
    });
    return response;
  },

  async delete<T>(url: string): Promise<{ data: T }> {
    const response = await axios.delete(`${BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(storage.getToken() && {
          Authorization: `Bearer ${storage.getToken()}`,
        }),
      },
    });
    return response;
  },

  async put<T>(url: string, data: unknown): Promise<{ data: T }> {
    const response = await axios.put(`${BASE_URL}${url}`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...(storage.getToken() && {
          Authorization: `Bearer ${storage.getToken()}`,
        }),
      },
    });
    return response;
  },
};