import React, { useState } from 'react';
import './LoginModal.scss';
import { useTranslation } from '../contexts/TranslationContext';
import { NOTIFICATION_MESSAGES } from '../constants/notifications';
import {
  buildMsisdn,
  COUNTRY_CODE,
  isValidLocalPhoneInput,
  PHONE_INPUT_MAX_LENGTH,
  sanitizeLocalPhoneInput,
} from '../constants/phone';
import { FaShieldHalved, FaXmark, FaArrowRight, FaPlay } from 'react-icons/fa6';

const LoginModal = ({ hidePhoneInput = false, onSubmit, onNotify, onClose }) => {
  const { t } = useTranslation();
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneChange = (e) => {
    setPhone(sanitizeLocalPhoneInput(e.target.value));
  };

  const handleSubmit = async (e) => {
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
    <div className="login-modal-backdrop" onClick={onClose}>
      <div className="login-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Top Glow Ambient */}
        <div className="modal-glow-ambient" />

        {/* Close Button */}
        <button
          className="modal-close-btn"
          onClick={onClose}
          type="button"
          aria-label="Close modal"
        >
          <FaXmark />
        </button>

        {/* Header with Brand Logo & Title */}
        <div className="modal-header-section">
          <div className="brand-badge-row">
            <div className="brand-logo-icon">
              <FaPlay className="play-triangle" />
            </div>
            <div className="brand-meta">
              <span className="brand-name">GHSNAPFLIX</span>
              <span className="brand-tagline">WATCH • STREAM • EXPLORE</span>
            </div>
          </div>

          <h2 className="modal-title">{t('login.welcome')}</h2>
          <p className="modal-subtitle">
            Unlimited anime clips, AMVs & exclusive edits on MTN Ghana
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="modal-form-section">
          {!hidePhoneInput && (
            <div className="phone-field-group">
              <label htmlFor="modal-phone-input" className="field-label">
                {t('login.phone.label')}
              </label>
              <div className="phone-input-box">
                <div className="country-prefix">
                  <span className="flag-icon" role="img" aria-label="Ghana Flag">
                    🇬🇭
                  </span>
                  <span className="prefix-num">+{COUNTRY_CODE}</span>
                </div>
                <input
                  id="modal-phone-input"
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="phone-native-input"
                  placeholder="241234567"
                  maxLength={PHONE_INPUT_MAX_LENGTH}
                  disabled={isLoading}
                  autoComplete="tel-national"
                  autoFocus
                />
              </div>
              <span className="field-hint">Enter your 9-digit MTN mobile number</span>
            </div>
          )}

          <button
            type="submit"
            className={`modal-submit-btn ${isLoading ? 'is-loading' : ''}`}
            disabled={isSubmitDisabled}
          >
            {isLoading ? (
              <>
                <span className="submit-spinner" aria-hidden="true" />
                <span>Please wait...</span>
              </>
            ) : (
              <span>Subscribe</span>
            )}
          </button>
        </form>

        {/* Security & Billing Trust Bar */}
        <div className="trust-security-bar">
          <div className="trust-icon">
            <FaShieldHalved />
          </div>
          <div className="trust-text">
            <span>{t('login.security')}</span>
            <span className="trust-badge">MTN Verified Partner</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
