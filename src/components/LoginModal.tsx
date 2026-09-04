import React, { useState } from 'react';
import './LoginModal.css';
import { useTranslation } from '../contexts/TranslationContext';
import { NOTIFICATION_MESSAGES, NotificationType } from '../constants/notifications';
import {
  buildMsisdn,
  COUNTRY_CODE,
  isValidLocalPhoneInput,
  PHONE_INPUT_MAX_LENGTH,
  sanitizeLocalPhoneInput,
} from '../constants/phone';

interface LoginModalProps {
  hidePhoneInput?: boolean;
  onSubmit: (msisdn: string) => void | Promise<void>;
  onNotify: (message: string, type: NotificationType) => void;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  hidePhoneInput = false,
  onSubmit,
  onNotify,
  onClose,
}) => {
  const { t } = useTranslation();
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(sanitizeLocalPhoneInput(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hidePhoneInput && !isValidLocalPhoneInput(phone)) {
      return;
    }

    const msisdn = hidePhoneInput ? '' : buildMsisdn(phone);
    setIsLoading(true);

    try {
      await onSubmit(msisdn);
    } catch {
      onNotify(NOTIFICATION_MESSAGES.ERROR_GENERIC, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitDisabled = isLoading || (!hidePhoneInput && !isValidLocalPhoneInput(phone));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose} type="button">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        <div className="modal-header">
          <div className="modal-logo-custom">
            <div className="modal-play-icon">
              <svg viewBox="0 0 100 100" className="modal-play-svg">
                <defs>
                  <radialGradient id="modalGHSnapflixGradient" cx="32%" cy="26%" r="78%">
                    <stop offset="0%" stopColor="#fff6c2" />
                    <stop offset="28%" stopColor="#7ee8d4" />
                    <stop offset="62%" stopColor="#2dd4bf" />
                    <stop offset="100%" stopColor="#0f766e" />
                  </radialGradient>
                  <radialGradient id="modalGHSnapflixHighlight" cx="30%" cy="24%" r="42%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.75)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                  </radialGradient>
                </defs>
                <circle cx="50" cy="50" r="45" fill="url(#modalGHSnapflixGradient)" className="modal-play-circle" />
                <ellipse cx="38" cy="34" rx="20" ry="14" fill="url(#modalGHSnapflixHighlight)" />
                <path d="M 40 30 L 40 70 L 65 50 Z" fill="white" className="modal-play-triangle" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" className="modal-play-ring" />
              </svg>
            </div>
            <div className="modal-logo-text">
              <span className="modal-text-snap" style={{ color: '#5eead4', backgroundColor: 'transparent' }}>GHSNAP</span>
              <span className="modal-text-flix" style={{ color: '#fde68a', backgroundColor: 'transparent' }}>FLIX</span>
            </div>
          </div>
          <h1 className="modal-title">{t('login.welcome')}</h1>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {!hidePhoneInput && (
            <div className="input-group">
              <label className="input-label">{t('login.phone.label')}</label>
              <div className="phone-input-wrapper">
                <span className="phone-prefix">+{COUNTRY_CODE}</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="phone-input"
                  placeholder="241234567"
                  maxLength={PHONE_INPUT_MAX_LENGTH}
                  disabled={isLoading}
                  autoComplete="tel-national"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className={`send-otp-button ${isLoading ? 'loading' : ''}`}
            disabled={isSubmitDisabled}
            style={{
              background: 'linear-gradient(135deg, #5eead4 0%, #14b8a6 55%, #0f766e 100%)',
              opacity: isSubmitDisabled ? 0.6 : 1,
            }}
          >
            {isLoading ? (
              <>
                <span className="button-spinner" aria-hidden="true" />
                <span>Please wait...</span>
              </>
            ) : (
              <>
                <span>{t('login.proceed.subscribe')}</span>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10L16 10M10 4L16 10L10 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="security-notice">
          <div className="security-icon">🔒</div>
          <span>{t('login.security')}</span>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
