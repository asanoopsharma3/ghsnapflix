import axios from 'axios';
import { NOTIFICATION_MESSAGES } from '../constants/notifications';
import { API_CONFIG } from '../config/api';

export const AUTH_EXPIRED_EVENT = 'ghsnapflix:unauthorized';

export const apiClient = axios.create({
  baseURL: API_CONFIG.baseUrl,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }
    return Promise.reject(error);
  }
);

export function getAxiosErrorMessage(_error: unknown): string {
  if (axios.isAxiosError(_error)) {
    return NOTIFICATION_MESSAGES.ERROR_GENERIC;
  }

  return NOTIFICATION_MESSAGES.ERROR_GENERIC;
}
