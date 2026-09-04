import { APP_CONFIG, getApiUrl, isDevelopmentEnv } from './appConfig';

type NetworkInformation = {
  type?: string;
};

type NavigatorWithConnection = Navigator & {
  userAgentData?: { mobile?: boolean };
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
};

export const INITIAL_OFFER_CODE = APP_CONFIG.cgw.initialOfferCode;
export const TOPUP_OFFER_CODE = APP_CONFIG.cgw.topupOfferCode;
export const HE_MOBILE_NUMBER = APP_CONFIG.cgw.heFixedMobileNumber;
export const CGW_BACKEND_CALLBACK_URL = APP_CONFIG.cgw.callbackUrl;
export const CGW_ENV = APP_CONFIG.cgw.env;
export const HE_REDIRECT_URL = APP_CONFIG.cgw.heRedirectUrl;
/** NHE always uses SIT Portal. HE never uses this URL. */
export const CGW_NHE_PORTAL_URL = APP_CONFIG.cgw.nhePortalStaging;

export const FORCE_HE = isDevelopmentEnv() && APP_CONFIG.cgw.forceHe;

export const isMobileDevice = (): boolean => {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') {
    return false;
  }

  const nav = navigator as NavigatorWithConnection;
  if (nav.userAgentData?.mobile === true) {
    return true;
  }

  const ua = navigator.userAgent || '';
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Silk|SamsungBrowser/i.test(
      ua
    )
  ) {
    return true;
  }

  return Boolean(window.matchMedia?.('(max-width: 729px)')?.matches);
};

export const isMobileNetworkCandidate = (): boolean => {
  const nav = navigator as NavigatorWithConnection;
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
  const connectionType = connection?.type?.toLowerCase();
  if (connectionType === 'wifi') {
    return false;
  }

  return isMobileDevice();
};

export const shouldUseHeFlow = (): boolean => FORCE_HE || isMobileNetworkCandidate();

const cleanAbsoluteUrl = (url: string): string =>
  url.replace(/([^:]\/)\/+/g, '$1');

const HE_CALLBACK_BASE = (
  APP_CONFIG.cgw.heCallbackUrl || CGW_BACKEND_CALLBACK_URL
).replace(/\/+$/, '');

const buildHeCallbackUrl = (): string => {
  const callbackUrl = new URL(cleanAbsoluteUrl(HE_CALLBACK_BASE));
  callbackUrl.searchParams.set('flow', 'HE');
  return callbackUrl.toString();
};

export const normalizeGhanaMsisdn = (phoneNumber: string): string => {
  const digits = String(phoneNumber || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('233')) return digits;
  if (digits.startsWith('0')) return `233${digits.slice(1)}`;
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

export const startHeSubscription = (offerCode = INITIAL_OFFER_CODE): void => {
  localStorage.setItem('offerCode', offerCode);
  const params = new URLSearchParams(getHeRedirectParams(offerCode));
  window.location.replace(`${HE_REDIRECT_URL}?${params.toString()}`);
};

/** HE → IP Redirect. NHE → sitcgw Portal. */
export const startCgwByNetwork = (
  msisdn?: string,
  offerCode = INITIAL_OFFER_CODE
): void => {
  if (shouldUseHeFlow()) {
    startHeSubscription(offerCode);
    return;
  }
  if (msisdn) {
    startNheSubscription(msisdn, offerCode);
  }
};

export const startNheSubscription = (
  msisdn: string,
  offerCode = INITIAL_OFFER_CODE
): void => {
  const callbackUrl = new URL(cleanAbsoluteUrl(CGW_BACKEND_CALLBACK_URL));
  callbackUrl.searchParams.set('flow', 'NHE');
  const params = new URLSearchParams({
    OfferCode: offerCode,
    redirectUrl: callbackUrl.toString(),
    mobileNumber: normalizeGhanaMsisdn(msisdn),
  });

  window.location.href = `${CGW_NHE_PORTAL_URL}?${params.toString()}`;
};

export const LOCAL_SUBSCRIPTION_ENABLED =
  isDevelopmentEnv() && !FORCE_HE && APP_CONFIG.cgw.localSubscription;

export type LocalActivationResult = {
  success: boolean;
  token: string;
  offerCode?: string;
  msisdn?: string;
  message?: string;
};

export const activateLocalSubscription = async (
  msisdn: string,
  offerCode = INITIAL_OFFER_CODE
): Promise<LocalActivationResult> => {
  const response = await fetch(getApiUrl(APP_CONFIG.api.endpoints.subscriptionDevActivate), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ msisdn, offerCode }),
  });

  const data = (await response.json().catch(() => ({}))) as LocalActivationResult;
  if (!response.ok || !data?.success || !data?.token) {
    throw new Error(data?.message || 'Local subscription activation failed');
  }

  return data;
};
