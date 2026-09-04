/**
 * GHSnapflix master configuration (no .env file).
 *
 * Before production deploy, change APP_ENV to 'production'.
 */
const APP_ENV = 'production'; // 'development' | 'production'

const trimTrailingSlash = (url) => String(url || '').replace(/\/+$/, '');

/** Public backend origin — no trailing slash (avoids //api in CGW redirectUrl). */
const API_HOST = trimTrailingSlash('https://ghsnapflix.buzz');
const API_BACKEND_PATH = '';
const API_VERSION = '/api/v1';

const isProduction = APP_ENV === 'production';
const directBaseUrl = `${API_HOST}${API_BACKEND_PATH}${API_VERSION}`;
const proxyBaseUrl = `${API_BACKEND_PATH}${API_VERSION}`;
const apiBaseUrl = isProduction ? directBaseUrl : proxyBaseUrl;

const INITIAL_OFFER_CODE = '9916310061';
const TOPUP_OFFER_CODE = '9923310009';

/** MTN whitelist: https://www.ghsnapflix.buzz/api/callback (no /api/v1/cgw). */
const API_CALLBACK_URL = 'https://www.ghsnapflix.buzz/api/callback';

module.exports = {
  APP_ENV,
  API_HOST,
  API_BACKEND_PATH,
  API_VERSION,
  isProduction,
  useProxy: !isProduction,
  apiBaseUrl,
  directBaseUrl,
  proxyBaseUrl,
  endpoints: {
    sendOtp: '/mtn/otp/send',
    verifyOtp: '/mtn/otp/verify',
    subscribe: '/mtn/subscribe',
    subscriptionStatus: '/subscription/status',
    subscriptionDevActivate: '/subscription/dev-activate',
    cgwHe: '/cgw/he',
    cgwNhe: '/cgw/nhe',
    cgwCallback: '/callback',
  },
  cgw: {
    initialOfferCode: INITIAL_OFFER_CODE,
    topupOfferCode: TOPUP_OFFER_CODE,
    heFixedMobileNumber: '99999999999',
    env: 'production',
    heRedirectUrl: 'http://102.133.198.92/Redirect',
    heCallbackUrl: API_CALLBACK_URL,
    nhePortalStaging: 'https://sitcgw.mtn.com.gh/Portal',
    nhePortalProduction: 'https://cg.mtn.com.gh/Portal',
    heBaseUrl: 'http://102.133.198.92/Redirect',
    nonHeBaseUrl: 'https://cg.mtn.com.gh/Portal',
    callbackUrl: API_CALLBACK_URL,
    forceHe: false,
    localSubscription: false,
    localHeMsisdn: '233257294199',
  },
};
