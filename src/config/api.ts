/**
 * API configuration — reads from app.config.js via appConfig.ts
 */
export {
  APP_CONFIG,
  API_CONFIG,
  getApiBaseUrl,
  getApiUrl,
  isDevelopmentEnv,
  isProductionEnv,
  shouldUseProxy,
} from './appConfig';

export type { AppEnvironment } from './appConfig';
