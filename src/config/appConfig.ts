/* eslint-disable @typescript-eslint/no-var-requires */
const rawConfig = require('./app.config.js');

export type AppEnvironment = 'development' | 'production';

export const APP_CONFIG = {
  environment: rawConfig.APP_ENV as AppEnvironment,
  useProxy: rawConfig.useProxy,
  api: {
    host: rawConfig.API_HOST,
    backendPath: rawConfig.API_BACKEND_PATH,
    version: rawConfig.API_VERSION,
    baseUrl: rawConfig.apiBaseUrl,
    directBaseUrl: rawConfig.directBaseUrl,
    proxyBaseUrl: rawConfig.proxyBaseUrl,
    endpoints: rawConfig.endpoints,
  },
  cgw: rawConfig.cgw as {
    initialOfferCode: string;
    topupOfferCode: string;
    heFixedMobileNumber: string;
    env: 'staging' | 'production';
    heRedirectUrl: string;
    heCallbackUrl: string;
    nhePortalStaging: string;
    nhePortalProduction: string;
    heBaseUrl: string;
    nonHeBaseUrl: string;
    callbackUrl: string;
    forceHe: boolean;
    localSubscription: boolean;
    localHeMsisdn: string;
  },
} as const;

export const isProductionEnv = (): boolean => APP_CONFIG.environment === 'production';

export const isDevelopmentEnv = (): boolean => APP_CONFIG.environment === 'development';

export const shouldUseProxy = (): boolean => APP_CONFIG.useProxy;

export const getApiBaseUrl = (): string => APP_CONFIG.api.baseUrl;

export const getApiUrl = (endpoint: string): string =>
  `${APP_CONFIG.api.baseUrl}${endpoint}`;

/** @deprecated Use APP_CONFIG / getApiBaseUrl instead */
export const API_CONFIG = {
  baseUrl: APP_CONFIG.api.baseUrl,
  useProxy: APP_CONFIG.useProxy,
  endpoints: APP_CONFIG.api.endpoints,
};
