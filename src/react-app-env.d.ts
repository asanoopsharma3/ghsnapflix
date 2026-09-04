/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly REACT_APP_SITE_URL?: string;
    readonly REACT_APP_API_BASE_URL?: string;
    readonly REACT_APP_CGW_ENV?: string;
    readonly REACT_APP_HE_REDIRECT_URL?: string;
    readonly REACT_APP_HE_CALLBACK_URL?: string;
    readonly REACT_APP_FORCE_HE?: string;
    readonly REACT_APP_LOCAL_SUBSCRIPTION?: string;
    readonly REACT_APP_LOCAL_HE_MSISDN?: string;
    readonly REACT_APP_OFFER_CODE?: string;
    readonly VITE_SITE_URL?: string;
    readonly VITE_API_BASE_URL?: string;
    readonly VITE_CGW_ENV?: string;
    readonly VITE_HE_REDIRECT_URL?: string;
    readonly VITE_HE_CALLBACK_URL?: string;
    readonly VITE_FORCE_HE?: string;
    readonly VITE_LOCAL_SUBSCRIPTION?: string;
    readonly VITE_LOCAL_HE_MSISDN?: string;
    readonly VITE_OFFER_CODE?: string;
  }
}

