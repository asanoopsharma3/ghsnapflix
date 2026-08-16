/**
 * GHSnapflix master configuration (no .env file).
 *
 * Before production deploy, change APP_ENV to 'production'.
 */
const APP_ENV = 'production'; // 'development' | 'production'

const API_HOST = 'https://apiunisol.com';
const API_BACKEND_PATH = '/snapflix_backend';
const API_VERSION = '/api/v1';

const isProduction = APP_ENV === 'production';
const directBaseUrl = `${API_HOST}${API_BACKEND_PATH}${API_VERSION}`;
const proxyBaseUrl = `${API_BACKEND_PATH}${API_VERSION}`;

module.exports = {
  APP_ENV,
  API_HOST,
  API_BACKEND_PATH,
  API_VERSION,
  isProduction,
  useProxy: !isProduction,
  apiBaseUrl: isProduction ? directBaseUrl : proxyBaseUrl,
  directBaseUrl,
  proxyBaseUrl,
  endpoints: {
    sendOtp: '/mtn/otp/send',
    verifyOtp: '/mtn/otp/verify',
    subscribe: '/mtn/subscribe',
  },
};
