/**
 * Superwinnings-style env: VITE_* in .env files, REACT_APP_* for CRA browser inject.
 * HE uses VITE_HE_REDIRECT_URL / REACT_APP_HE_REDIRECT_URL (SIT IP Redirect).
 */
const trimTrailingSlash = (url) => String(url || '').replace(/\/+$/, '');

const NODE_ENV = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const APP_ENV = NODE_ENV;
const isProduction = APP_ENV === 'production';

const SITE_URL = trimTrailingSlash(
  process.env.REACT_APP_SITE_URL ||
    process.env.VITE_SITE_URL ||
    (isProduction ? 'https://www.ghsnapflix.buzz' : 'http://localhost:3000')
);

const API_BASE_URL = trimTrailingSlash(
  process.env.REACT_APP_API_BASE_URL ||
    process.env.VITE_API_BASE_URL ||
    `${SITE_URL}/api`
);

const API_VERSION = '/v1';
const apiBaseUrl = `${API_BASE_URL}${API_VERSION}`;
const API_HOST = SITE_URL;
const API_BACKEND_PATH = '';
const directBaseUrl = apiBaseUrl;
const proxyBaseUrl = apiBaseUrl;

const CGW_ENV =
  String(
    process.env.REACT_APP_CGW_ENV || process.env.VITE_CGW_ENV || 'production'
  ).toLowerCase() === 'staging'
    ? 'staging'
    : 'production';

const HE_REDIRECT_URL =
  process.env.REACT_APP_HE_REDIRECT_URL ||
  process.env.VITE_HE_REDIRECT_URL ||
  'http://98.71.49.187/Redirect';

const API_CALLBACK_URL = trimTrailingSlash(
  process.env.REACT_APP_HE_CALLBACK_URL ||
    process.env.VITE_HE_CALLBACK_URL ||
    `${API_BASE_URL}/callback`
);

const INITIAL_OFFER_CODE =
  process.env.REACT_APP_OFFER_CODE ||
  process.env.VITE_OFFER_CODE ||
  '9916310061';
const TOPUP_OFFER_CODE = '9923310009';

const FORCE_HE =
  (process.env.REACT_APP_FORCE_HE || process.env.VITE_FORCE_HE) === 'true';
const LOCAL_SUBSCRIPTION =
  (process.env.REACT_APP_LOCAL_SUBSCRIPTION ||
    process.env.VITE_LOCAL_SUBSCRIPTION) === 'true';
const LOCAL_HE_MSISDN =
  process.env.REACT_APP_LOCAL_HE_MSISDN ||
  process.env.VITE_LOCAL_HE_MSISDN ||
  '233257294199';

module.exports = {
  APP_ENV,
  SITE_URL,
  API_HOST,
  API_BACKEND_PATH,
  API_VERSION,
  API_BASE_URL,
  isProduction,
  useProxy: !isProduction && Boolean(API_BACKEND_PATH),
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
    env: CGW_ENV,
    heRedirectUrl: HE_REDIRECT_URL,
    heCallbackUrl: API_CALLBACK_URL,
    nhePortalStaging: 'https://sitcgw.mtn.com.gh/Portal',
    nhePortalProduction: 'https://cg.mtn.com.gh/Portal',
    heBaseUrl: HE_REDIRECT_URL,
    nonHeBaseUrl:
      CGW_ENV === 'staging'
        ? 'https://sitcgw.mtn.com.gh/Portal'
        : 'https://cg.mtn.com.gh/Portal',
    callbackUrl: API_CALLBACK_URL,
    forceHe: FORCE_HE,
    localSubscription: LOCAL_SUBSCRIPTION,
    localHeMsisdn: LOCAL_HE_MSISDN,
  },
};
