export type CgwNoticeType = 'success' | 'error' | 'info';

export type CgwStatusMapping = {
  success: boolean;
  message: string;
  type: CgwNoticeType;
};

const LOW_BALANCE = 'Low balance. Please recharge and try again.';
const ACTIVATION_FAILED = 'Activation failed. Please try again.';
const INVALID_OTP = 'Invalid OTP. Please try again.';
const GENERIC_FAIL = 'We could not complete your subscription. Please try again.';

const STATUS_MAP: Record<string, CgwStatusMapping> = {
  '200': { success: true, message: 'Success', type: 'success' },
  '0': { success: true, message: 'Success', type: 'success' },
  '00': { success: true, message: 'Success', type: 'success' },
  ok: { success: true, message: 'Success', type: 'success' },
  active: { success: true, message: 'Success', type: 'success' },
  activated: { success: true, message: 'Success', type: 'success' },
  success: { success: true, message: 'Success', type: 'success' },
  successful: { success: true, message: 'Success', type: 'success' },
  succuss: { success: true, message: 'Success', type: 'success' },
  '1': { success: false, message: ACTIVATION_FAILED, type: 'error' },
  '112': {
    success: false,
    message: 'Subscription in progress. Please wait a moment.',
    type: 'info',
  },
  '11': { success: false, message: 'No consent. Please accept and try again.', type: 'error' },
  '12': { success: false, message: 'Invalid consent. Please try again.', type: 'error' },
  '13': { success: false, message: 'Consent error. Please try again.', type: 'error' },
  '2': { success: false, message: LOW_BALANCE, type: 'error' },
  '63': { success: false, message: LOW_BALANCE, type: 'error' },
  '29': { success: false, message: LOW_BALANCE, type: 'error' },
  '26': { success: false, message: LOW_BALANCE, type: 'error' },
  '55': { success: false, message: LOW_BALANCE, type: 'error' },
  '111': { success: false, message: LOW_BALANCE, type: 'error' },
  '9': { success: true, message: 'You are already subscribed.', type: 'info' },
  '115': { success: true, message: 'You are already subscribed.', type: 'info' },
  '644': {
    success: false,
    message: 'Duplicate subscription. Please try again later.',
    type: 'error',
  },
  '91': { success: false, message: INVALID_OTP, type: 'error' },
  '186': { success: false, message: INVALID_OTP, type: 'error' },
};

const KNOWN_MESSAGES = new Set(
  Object.values(STATUS_MAP).map((item) => item.message.toLowerCase())
);

const looksLikeRawCode = (value: string): boolean =>
  /^\d+$/.test(value) || /^unknown status(?: code)?:?\s*/i.test(value);

const extractCode = (value: string): string =>
  value
    .trim()
    .replace(/^unknown status(?: code)?:?\s*/i, '')
    .toLowerCase();

export const mapCgwStatus = (statusCode: unknown): CgwStatusMapping => {
  const normalized = extractCode(String(statusCode ?? ''));
  if (STATUS_MAP[normalized]) {
    return STATUS_MAP[normalized];
  }

  return {
    success: false,
    message: GENERIC_FAIL,
    type: 'error',
  };
};

export const resolveCgwCallbackNotice = (params: URLSearchParams): CgwStatusMapping => {
  const status = params.get('status') || '';
  const reason = params.get('reason') || params.get('message') || '';
  const isFlaggedSuccess =
    status.toLowerCase() === 'success' ||
    status.toLowerCase() === 'successful' ||
    params.get('success') === 'true' ||
    params.get('subscribed') === 'true';

  const fromStatus = status ? mapCgwStatus(status) : null;
  const fromReasonCode = reason && looksLikeRawCode(reason) ? mapCgwStatus(reason) : null;

  if (fromReasonCode && !fromReasonCode.success) {
    return fromReasonCode;
  }

  if (fromStatus && STATUS_MAP[extractCode(status)]) {
    if (fromStatus.success && isFlaggedSuccess) {
      return fromStatus;
    }
    if (!fromStatus.success) {
      return fromStatus;
    }
  }

  const reasonText = reason.trim();
  if (reasonText && !looksLikeRawCode(reasonText)) {
    const type: CgwNoticeType = /already subscribed/i.test(reasonText)
      ? 'info'
      : /progress/i.test(reasonText)
        ? 'info'
        : 'error';
    if (KNOWN_MESSAGES.has(reasonText.toLowerCase()) || !/^\d+$/.test(reasonText)) {
      return {
        success: isFlaggedSuccess,
        message: reasonText,
        type: isFlaggedSuccess ? 'success' : type,
      };
    }
  }

  if (isFlaggedSuccess) {
    return { success: true, message: 'Success', type: 'success' };
  }

  return { success: false, message: GENERIC_FAIL, type: 'error' };
};
