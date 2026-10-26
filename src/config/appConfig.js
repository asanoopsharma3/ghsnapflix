const getEnvVar = (viteKey, craKey, fallback = '') => {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
        const val = import.meta.env[viteKey];
        if (val !== undefined && val !== '')
            return String(val);
    }
    if (typeof process !== 'undefined' && process.env) {
        const val = process.env[craKey] || process.env[viteKey];
        if (val !== undefined && val !== '')
            return String(val);
    }
    return fallback;
};
const trimTrailingSlash = (url) => String(url || '').replace(/\/+$/, '');
const NODE_ENV = getEnvVar('MODE', 'NODE_ENV') === 'production' ? 'production' : 'development';
const isProduction = NODE_ENV === 'production';
const SITE_URL = trimTrailingSlash(getEnvVar('VITE_SITE_URL', 'REACT_APP_SITE_URL', isProduction ? 'https://www.ghsnapflix.buzz' : 'http://localhost:3000'));
const API_BASE_URL = trimTrailingSlash(getEnvVar('VITE_API_BASE_URL', 'REACT_APP_API_BASE_URL', `${SITE_URL}/api`));
const API_VERSION = '/v1';
const apiBaseUrl = `${API_BASE_URL}${API_VERSION}`;
const API_HOST = SITE_URL;
const API_BACKEND_PATH = '';
const CGW_ENV = getEnvVar('VITE_CGW_ENV', 'REACT_APP_CGW_ENV', 'staging').toLowerCase() === 'production'
    ? 'production'
    : 'staging';
const HE_REDIRECT_URL = getEnvVar('VITE_HE_REDIRECT_URL', 'REACT_APP_HE_REDIRECT_URL', 'http://98.71.49.187/Redirect');
const API_CALLBACK_URL = trimTrailingSlash(getEnvVar('VITE_HE_CALLBACK_URL', 'REACT_APP_HE_CALLBACK_URL', `${API_BASE_URL}/callback`));
const INITIAL_OFFER_CODE = getEnvVar('VITE_OFFER_CODE', 'REACT_APP_OFFER_CODE', '9916310061');
const TOPUP_OFFER_CODE = '9923310009';
const FORCE_HE = getEnvVar('VITE_FORCE_HE', 'REACT_APP_FORCE_HE') === 'true';
const LOCAL_SUBSCRIPTION = getEnvVar('VITE_LOCAL_SUBSCRIPTION', 'REACT_APP_LOCAL_SUBSCRIPTION') === 'true';
const LOCAL_HE_MSISDN = getEnvVar('VITE_LOCAL_HE_MSISDN', 'REACT_APP_LOCAL_HE_MSISDN', '233257294199');
export const APP_CONFIG = {
    environment: NODE_ENV,
    useProxy: !isProduction && Boolean(API_BACKEND_PATH),
    api: {
        host: API_HOST,
        backendPath: API_BACKEND_PATH,
        version: API_VERSION,
        baseUrl: apiBaseUrl,
        directBaseUrl: apiBaseUrl,
        proxyBaseUrl: apiBaseUrl,
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
        nonHeBaseUrl: CGW_ENV === 'staging'
            ? 'https://sitcgw.mtn.com.gh/Portal'
            : 'https://cg.mtn.com.gh/Portal',
        callbackUrl: API_CALLBACK_URL,
        forceHe: FORCE_HE,
        localSubscription: LOCAL_SUBSCRIPTION,
        localHeMsisdn: LOCAL_HE_MSISDN,
    },
};
export const isProductionEnv = () => APP_CONFIG.environment === 'production';
export const isDevelopmentEnv = () => APP_CONFIG.environment === 'development';
export const shouldUseProxy = () => APP_CONFIG.useProxy;
export const getApiBaseUrl = () => APP_CONFIG.api.baseUrl;
export const getApiUrl = (endpoint) => `${APP_CONFIG.api.baseUrl}${endpoint}`;
/** @deprecated Use APP_CONFIG / getApiBaseUrl instead */
export const API_CONFIG = {
    baseUrl: APP_CONFIG.api.baseUrl,
    useProxy: APP_CONFIG.useProxy,
    endpoints: APP_CONFIG.api.endpoints,
};
