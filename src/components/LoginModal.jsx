import React, { useState } from 'react';
import './LoginModal.css';
import { useTranslation } from '../contexts/TranslationContext';
import { NOTIFICATION_MESSAGES } from '../constants/notifications';
import { buildMsisdn, COUNTRY_CODE, isValidLocalPhoneInput, PHONE_INPUT_MAX_LENGTH, sanitizeLocalPhoneInput, } from '../constants/phone';
import { FaLock } from 'react-icons/fa6';
const LoginModal = ({ hidePhoneInput = false, onSubmit, onNotify, onClose, }) => {
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
        }
        catch {
            onNotify(NOTIFICATION_MESSAGES.ERROR_GENERIC, 'error');
        }
        finally {
            setIsLoading(false);
        }
    };
    const isSubmitDisabled = isLoading || (!hidePhoneInput && !isValidLocalPhoneInput(phone));
    return (<div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-brand-bar">
          <div className="modal-brand">
            <span className="modal-brand-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <div className="modal-brand-text">
              <span className="modal-brand-name">GHSNAPFLIX</span>
              <span className="modal-brand-tagline">WATCH • STREAM • EXPLORE</span>
            </div>
          </div>
          <button className="close-button" onClick={onClose} type="button" aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
        <div className="modal-header">
          <h1 className="modal-title">{t('login.welcome')}</h1>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {!hidePhoneInput && (<div className="input-group">
              <label className="input-label">{t('login.phone.label')}</label>
              <div className="phone-input-wrapper">
                <span className="phone-prefix">+{COUNTRY_CODE}</span>
                <input type="tel" inputMode="numeric" value={phone} onChange={handlePhoneChange} className="phone-input" placeholder="241234567" maxLength={PHONE_INPUT_MAX_LENGTH} disabled={isLoading} autoComplete="tel-national"/>
              </div>
            </div>)}

          <button type="submit" className={`send-otp-button ${isLoading ? 'loading' : ''}`} disabled={isSubmitDisabled}>
            {isLoading ? (<>
                <span className="button-spinner" aria-hidden="true"/>
                <span>Please wait...</span>
              </>) : (<>
                <span>{t('login.proceed.subscribe')}</span>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10L16 10M10 4L16 10L10 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>)}
          </button>
        </form>

        <div className="security-notice">
          <div className="security-icon"><FaLock /></div>
          <span>{t('login.security')}</span>
        </div>
        </div>
      </div>
    </div>);
};
export default LoginModal;
