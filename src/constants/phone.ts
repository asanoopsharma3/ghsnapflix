export const COUNTRY_CODE = '233';
export const PHONE_INPUT_MAX_LENGTH = 9;

export const buildMsisdn = (localNumber: string): string =>
  `${COUNTRY_CODE}${localNumber}`;

export const formatMsisdnForDisplay = (msisdn: string): string => {
  if (msisdn.startsWith(COUNTRY_CODE)) {
    return `+${COUNTRY_CODE} ${msisdn.slice(COUNTRY_CODE.length)}`;
  }

  return `+${msisdn}`;
};

export const sanitizeLocalPhoneInput = (value: string): string =>
  value.replace(/\D/g, '').slice(0, PHONE_INPUT_MAX_LENGTH);

export const isValidLocalPhoneInput = (value: string): boolean =>
  value.length === PHONE_INPUT_MAX_LENGTH && /^\d+$/.test(value);
