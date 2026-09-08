import { APP_CONFIG, getApiUrl, isDevelopmentEnv } from './appConfig';
const getConnection = () => {
    if (typeof navigator === 'undefined')
        return undefined;
    const nav = navigator;
    return nav.connection || nav.mozConnection || nav.webkitConnection;
};
const getConnectionType = () => String(getConnection()?.type || '').toLowerCase();
export const INITIAL_OFFER_CODE = APP_CONFIG.cgw.initialOfferCode;
export const TOPUP_OFFER_CODE = APP_CONFIG.cgw.topupOfferCode;
export const HE_MOBILE_NUMBER = APP_CONFIG.cgw.heFixedMobileNumber;
export const CGW_BACKEND_CALLBACK_URL = APP_CONFIG.cgw.callbackUrl;
export const CGW_ENV = APP_CONFIG.cgw.env;
export const HE_REDIRECT_URL = APP_CONFIG.cgw.heRedirectUrl;
/** NHE always uses SIT Portal. HE never uses this URL. */
export const CGW_NHE_PORTAL_URL = APP_CONFIG.cgw.nhePortalStaging;
export const FORCE_HE = isDevelopmentEnv() && APP_CONFIG.cgw.forceHe;
/** WiFi / Ethernet only — phone on WiFi is NHE. Do not treat "other" as WiFi. */
export const isWifiOrLanConnection = () => {
    const connectionType = getConnectionType();
    return connectionType === 'wifi' || connectionType === 'ethernet';
};
export const isMobileDevice = () => {
    if (typeof navigator === 'undefined' || typeof window === 'undefined') {
        return false;
    }
    const nav = navigator;
    if (nav.userAgentData?.mobile === true) {
        return true;
    }
    const ua = navigator.userAgent || '';
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Silk|SamsungBrowser/i.test(ua)) {
        return true;
    }
    return Boolean(window.matchMedia?.('(max-width: 729px)')?.matches);
};
/**
 * HE: cellular / mobile data (or phone when type is unknown).
 * NHE: WiFi / Ethernet / desktop.
 */
export const isMobileNetworkCandidate = () => {
    if (isWifiOrLanConnection()) {
        return false;
    }
    const connectionType = getConnectionType();
    if (connectionType === 'cellular' || connectionType === 'wimax') {
        return true;
    }
    return isMobileDevice();
};
export const shouldUseHeFlow = () => {
    if (FORCE_HE) {
        return true;
    }
    if (isWifiOrLanConnection()) {
        return false;
    }
    return isMobileNetworkCandidate();
};
export const subscribeToNetworkFlowChange = (onChange) => {
    if (typeof window === 'undefined') {
        return () => undefined;
    }
    const connection = getConnection();
    connection?.addEventListener?.('change', onChange);
    window.addEventListener('online', onChange);
    window.addEventListener('offline', onChange);
    return () => {
        connection?.removeEventListener?.('change', onChange);
        window.removeEventListener('online', onChange);
        window.removeEventListener('offline', onChange);
    };
};
const cleanAbsoluteUrl = (url) => url.replace(/([^:]\/)\/+/g, '$1');
const HE_CALLBACK_BASE = (APP_CONFIG.cgw.heCallbackUrl || CGW_BACKEND_CALLBACK_URL).replace(/\/+$/, '');
const buildHeCallbackUrl = () => {
    const callbackUrl = new URL(cleanAbsoluteUrl(HE_CALLBACK_BASE));
    callbackUrl.searchParams.set('flow', 'HE');
    return callbackUrl.toString();
};
export const normalizeGhanaMsisdn = (phoneNumber) => {
    const digits = String(phoneNumber || '').replace(/\D/g, '');
    if (!digits)
        return '';
    if (digits.startsWith('233'))
        return digits;
    if (digits.startsWith('0'))
        return `233${digits.slice(1)}`;
    return `233${digits}`;
};
export const LOCAL_HE_MSISDN = normalizeGhanaMsisdn(APP_CONFIG.cgw.localHeMsisdn);
export const getHeRedirectParams = (offerCode = INITIAL_OFFER_CODE) => {
    const rawMsisdn = isDevelopmentEnv() ? LOCAL_HE_MSISDN : '';
    return {
        OfferCode: offerCode,
        redirectUrl: buildHeCallbackUrl(),
        msisdn: normalizeGhanaMsisdn(rawMsisdn),
    };
};
export const startHeSubscription = (offerCode = INITIAL_OFFER_CODE) => {
    localStorage.setItem('offerCode', offerCode);
    const params = new URLSearchParams(getHeRedirectParams(offerCode));
    const heUrl = `${String(HE_REDIRECT_URL).replace(/\/+$/, '')}?${params.toString()}`;
    window.location.href = heUrl;
};
/** HE → IP Redirect. NHE → sitcgw Portal. */
export const startCgwByNetwork = (msisdn, offerCode = INITIAL_OFFER_CODE) => {
    if (shouldUseHeFlow()) {
        startHeSubscription(offerCode);
        return;
    }
    if (msisdn) {
        startNheSubscription(msisdn, offerCode);
    }
};
export const startNheSubscription = (msisdn, offerCode = INITIAL_OFFER_CODE) => {
    const callbackUrl = new URL(cleanAbsoluteUrl(CGW_BACKEND_CALLBACK_URL));
    callbackUrl.searchParams.set('flow', 'NHE');
    const params = new URLSearchParams({
        OfferCode: offerCode,
        redirectUrl: callbackUrl.toString(),
        mobileNumber: normalizeGhanaMsisdn(msisdn),
    });
    window.location.href = `${CGW_NHE_PORTAL_URL}?${params.toString()}`;
};
export const LOCAL_SUBSCRIPTION_ENABLED = isDevelopmentEnv() && !FORCE_HE && APP_CONFIG.cgw.localSubscription;
export const activateLocalSubscription = async (msisdn, offerCode = INITIAL_OFFER_CODE) => {
    const response = await fetch(getApiUrl(APP_CONFIG.api.endpoints.subscriptionDevActivate), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ msisdn, offerCode }),
    });
    const data = (await response.json().catch(() => ({})));
    if (!response.ok || !data?.success || !data?.token) {
        throw new Error(data?.message || 'Local subscription activation failed');
    }
    return data;
};
