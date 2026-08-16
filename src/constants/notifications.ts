export const NOTIFICATION_MESSAGES = {
  ERROR_GENERIC: 'There is an error.please try again',
  OTP_SENT_SUCCESS: 'OTP sent successfully',
  OTP_VERIFIED_SUCCESS: 'Verified successfully',
  SUBSCRIBE_ERROR: 'There is an error ,please try again later',
  ALREADY_SUBSCRIBED: 'You are already subscribed',
} as const;

export type NotificationType = 'success' | 'error' | 'info';

export interface AppNotification {
  message: string;
  type: NotificationType;
}
