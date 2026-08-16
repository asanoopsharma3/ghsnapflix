import React, { useState, useEffect } from 'react';
import './OTPModal.css';
import { NOTIFICATION_MESSAGES, NotificationType } from '../constants/notifications';
import { verifyOtp } from '../services/authService';
import { formatMsisdnForDisplay } from '../constants/phone';
import { SendOtpResponse } from '../types/auth';

interface OTPModalProps {
  phoneNumber: string;
  otpSession?: SendOtpResponse | null;
  onVerify: () => void;
  onBack: () => void;
  onNotify: (message: string, type: NotificationType) => void;
  onClose: () => void;
}

const OTPModal: React.FC<OTPModalProps> = ({
  phoneNumber,
  onVerify,
  onBack,
  onNotify,
  onClose,
}) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }

    setIsResendDisabled(false);
  }, [timeLeft]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async () => {
    if (!otp.every((digit) => digit !== '') || isVerifying) {
      return;
    }

    const otpCode = otp.join('');
    setIsVerifying(true);

    try {
      const response = await verifyOtp(phoneNumber, otpCode);

      if (response.ok && response.verified) {
        onVerify();
      } else {
        onNotify(
          response.errorMessage || NOTIFICATION_MESSAGES.ERROR_GENERIC,
          'error'
        );
      }
    } catch {
      onNotify(NOTIFICATION_MESSAGES.ERROR_GENERIC, 'error');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = () => {
    setTimeLeft(120);
    setIsResendDisabled(true);
    setOtp(['', '', '', '']);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isOtpComplete = otp.every((digit) => digit !== '');
  const isVerifyDisabled = !isOtpComplete || isVerifying;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose} type="button">×</button>

        <div className="otp-header">
          <div className="ghsnapflix-logo-container-custom">
            <div className="modal-play-icon">
              <svg viewBox="0 0 100 100" className="modal-play-svg">
                <defs>
                  <radialGradient id="otpGHSnapflixGradient" cx="32%" cy="26%" r="78%">
                    <stop offset="0%" stopColor="#fff6c2" />
                    <stop offset="28%" stopColor="#7ee8d4" />
                    <stop offset="62%" stopColor="#2dd4bf" />
                    <stop offset="100%" stopColor="#0f766e" />
                  </radialGradient>
                  <radialGradient id="otpGHSnapflixHighlight" cx="30%" cy="24%" r="42%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.75)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                  </radialGradient>
                </defs>
                <circle cx="50" cy="50" r="45" fill="url(#otpGHSnapflixGradient)" className="modal-play-circle" />
                <ellipse cx="38" cy="34" rx="20" ry="14" fill="url(#otpGHSnapflixHighlight)" />
                <path d="M 40 30 L 40 70 L 65 50 Z" fill="white" className="modal-play-triangle" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" className="modal-play-ring" />
              </svg>
            </div>
            <div className="modal-logo-text">
              <span className="modal-text-snap" style={{ color: '#5eead4', backgroundColor: 'transparent' }}>GHSNAP</span>
              <span className="modal-text-flix" style={{ color: '#fde68a', backgroundColor: 'transparent' }}>FLIX</span>
            </div>
          </div>
          <h2 className="otp-title">Verify Your Phone</h2>
          <p className="otp-description">
            Enter the 4-digit code sent to {formatMsisdnForDisplay(phoneNumber)}
          </p>
        </div>

        <div className="otp-inputs-container">
          <div className="otp-inputs">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`otp-input ${digit ? 'filled' : ''}`}
                maxLength={1}
                autoComplete="off"
                disabled={isVerifying}
              />
            ))}
          </div>
          <div className="otp-progress" />
        </div>

        <div className="security-notice">
          <div className="security-icon">🛡️</div>
          <span>Your verification is secure and encrypted</span>
        </div>

        <div className="resend-section">
          {isResendDisabled ? (
            <div className="resend-timer-container">
              <div className="timer-icon">⏱️</div>
              <div className="timer-content">
                <p className="resend-timer">
                  Resend Available in {formatTime(timeLeft)}
                </p>
                <p className="timer-description">Didn't receive the code?</p>
              </div>
            </div>
          ) : (
            <button className="resend-button" onClick={handleResend} type="button">
              <span>🔄</span>
              <span>Resend OTP</span>
            </button>
          )}
        </div>

        <div className="verify-section">
          <button
            className={`verify-button ${isVerifying ? 'loading' : ''}`}
            onClick={handleVerify}
            disabled={isVerifyDisabled}
            type="button"
            style={{
              background: 'linear-gradient(135deg, #5eead4, #14b8a6, #0f766e)',
              opacity: isVerifyDisabled ? 0.6 : 1,
            }}
          >
            {isVerifying ? (
              <>
                <span className="button-spinner" aria-hidden="true" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Verify & Continue</span>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10L16 10M10 4L16 10L10 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </button>

          <button className="otp-back-button" onClick={onBack} type="button" disabled={isVerifying}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M16 10L4 10M10 4L4 10L10 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPModal;
