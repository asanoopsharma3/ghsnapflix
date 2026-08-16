import axios from 'axios';
import { NOTIFICATION_MESSAGES } from '../constants/notifications';
import { API_CONFIG } from '../config/api';

export const apiClient = axios.create({
  baseURL: API_CONFIG.baseUrl,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30000,
});

export function getAxiosErrorMessage(_error: unknown): string {
  if (axios.isAxiosError(_error)) {
    return NOTIFICATION_MESSAGES.ERROR_GENERIC;
  }

  return NOTIFICATION_MESSAGES.ERROR_GENERIC;
}
