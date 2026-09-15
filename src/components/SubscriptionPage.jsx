import React, { useEffect, useState, useCallback } from 'react';
import './SubscriptionPage.scss';
import { SUBSCRIPTION_PLANS } from '../config/subscriptionPlans';
import { NOTIFICATION_MESSAGES } from '../constants/notifications';
import {
  activateLocalSubscription,
  LOCAL_SUBSCRIPTION_ENABLED,
  shouldUseHeFlow,
  startCgwByNetwork,
  subscribeToNetworkFlowChange,
  INITIAL_OFFER_CODE,
} from '../config/subscription';
import {
  buildMsisdn,
  COUNTRY_CODE,
  isValidLocalPhoneInput,
  PHONE_INPUT_MAX_LENGTH,
  sanitizeLocalPhoneInput,
} from '../constants/phone';
import { fetchSubscriptionStatus } from '../services/subscriptionService';
import {
  loadAppSession,
  saveSubscription,
  isSubscriptionActive,
  isDemoAdminEnabled,
  setDemoSubscriptionState,
} from '../utils/sessionStorage';
import {
  FaCrown,
  FaCircleCheck,
  FaRotateRight,
  FaPlay,
  FaArrowLeft,
  FaShieldHalved,
  FaBolt,
  FaCircleExclamation,
} from 'react-icons/fa6';

const SubscriptionPage = ({
  msisdn = '',
  isSubscribed = false,
  onSubscribeSuccess,
  onNotify = () => {},
  onNavigate = () => {},
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState('daily');
  const [subscribingPlanId, setSubscribingPlanId] = useState(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [liveSubscription, setLiveSubscription] = useState(null);
  const [isActive, setIsActive] = useState(Boolean(isSubscribed));

  // Initialize phone number
  const [phone, setPhone] = useState(() => {
    if (msisdn && msisdn.startsWith(COUNTRY_CODE)) {
      return msisdn.slice(COUNTRY_CODE.length);
    }
    const session = loadAppSession();
    if (session.msisdn && session.msisdn.startsWith(COUNTRY_CODE)) {
      return session.msisdn.slice(COUNTRY_CODE.length);
    }
    return (msisdn || '').replace(/\D/g, '');
  });

  const [showPhoneInput, setShowPhoneInput] = useState(() => !shouldUseHeFlow());
  const effectiveMsisdn = showPhoneInput ? buildMsisdn(phone) : msisdn;

  // Listen for network HE flow changes
  useEffect(() => {
    const sync = () => setShowPhoneInput(!shouldUseHeFlow());
    sync();
    return subscribeToNetworkFlowChange(sync);
  }, []);

  // Fetch live subscription status from API on mount
  const checkLiveStatus = useCallback(
    async (isManual = false) => {
      if (isManual) setIsSyncing(true);
      try {
        const session = loadAppSession();
        const token = localStorage.getItem('token');

        if (token) {
          const apiSub = await fetchSubscriptionStatus();
          if (apiSub) {
            setLiveSubscription(apiSub);
            const statusActive =
              apiSub.subscriptionStatus === 'active' ||
              apiSub.status === 'active' ||
              apiSub.active === true;
            setIsActive(statusActive);

            if (statusActive && session.msisdn) {
              saveSubscription(session.msisdn, SUBSCRIPTION_PLANS[0]);
            }
            if (isManual) {
              onNotify('Subscription status synchronized with server! 🔄', 'success');
            }
            return;
          }
        }

        // Fallback to local session check
        const activeLocally = Boolean(session.isSubscribed && isSubscriptionActive(session.subscription));
        setIsActive(activeLocally || Boolean(isSubscribed));
        if (session.subscription) {
          setLiveSubscription(session.subscription);
        }

        if (isManual) {
          onNotify('Subscription status refreshed.', 'info');
        }
      } catch (err) {
        console.warn('Subscription status check error:', err);
        const session = loadAppSession();
        setIsActive(Boolean(session.isSubscribed) || Boolean(isSubscribed));
        if (isManual) {
          onNotify('Unable to sync with server. Showing cached status.', 'info');
        }
      } finally {
        setIsCheckingStatus(false);
        if (isManual) setIsSyncing(false);
      }
    },
    [isSubscribed, onNotify]
  );

  useEffect(() => {
    void checkLiveStatus(false);
  }, [checkLiveStatus]);

  const selectedPlan = SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlanId) || SUBSCRIPTION_PLANS[0];
  const isSubscribing = subscribingPlanId !== null;

  // Handle Subscription / Renewal API Call
  const handleSubscribe = async (planId, event) => {
    if (event) event.stopPropagation();
    if (isSubscribing) return;

    setSelectedPlanId(planId);
    setSubscribingPlanId(planId);

    try {
      if (showPhoneInput && !isValidLocalPhoneInput(phone)) {
        onNotify('Please enter a valid Ghana mobile number (e.g. 241234567).', 'error');
        setSubscribingPlanId(null);
        return;
      }

      if (!effectiveMsisdn && !shouldUseHeFlow()) {
        onNotify(NOTIFICATION_MESSAGES.SUBSCRIBE_ERROR, 'error');
        setSubscribingPlanId(null);
        return;
      }

      const plan = SUBSCRIPTION_PLANS.find((item) => item.id === planId) || SUBSCRIPTION_PLANS[0];
      const offerCode = plan.offerCode || INITIAL_OFFER_CODE;
      localStorage.setItem('offerCode', offerCode);

      if (LOCAL_SUBSCRIPTION_ENABLED) {
        const result = await activateLocalSubscription(effectiveMsisdn, offerCode);
        saveSubscription(effectiveMsisdn, plan);
        setIsActive(true);
        onNotify('1-Day Access Pass activated successfully! 🎉', 'success');
        if (onSubscribeSuccess) {
          onSubscribeSuccess(result);
        }
        const params = new URLSearchParams({
          token: result.token,
          status: 'success',
          offerCode: result.offerCode || offerCode,
          msisdn: result.msisdn || effectiveMsisdn,
        });
        window.location.href = `/activation/callback?${params.toString()}`;
        return;
      }

      // Production / Carrier CGW flow
      startCgwByNetwork(effectiveMsisdn, offerCode);
    } catch (err) {
      console.error('Subscription error:', err);
      onNotify(NOTIFICATION_MESSAGES.SUBSCRIBE_ERROR, 'error');
      setSubscribingPlanId(null);
    }
  };

  // Format expiration / billing date
  const getExpiryDisplay = () => {
    if (liveSubscription?.expiresAt) {
      return new Date(liveSubscription.expiresAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    if (liveSubscription?.expiryDate) {
      return liveSubscription.expiryDate;
    }
    const session = loadAppSession();
    if (session.subscription?.expiresAt) {
      return new Date(session.subscription.expiresAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return 'Active (24 Hours Remaining)';
  };

  useEffect(() => {
    if (isActive) {
      onNavigate('videos');
    }
  }, [isActive, onNavigate]);

  if (isActive) {
    return null;
  }

  return (
    <div className="subscription-page-wrapper">
      {/* Ambient Backdrop Lighting */}
      <div className="sub-ambient-bg" />

      {/* Top Navigation Bar */}
      <div className="sub-nav-bar">
        <button
          type="button"
          className="back-home-btn"
          onClick={() => onNavigate('home')}
          title="Return to Home"
        >
          <FaArrowLeft />
          <span>Home</span>
        </button>

        <button
          type="button"
          className={`sync-status-btn ${isSyncing ? 'is-spinning' : ''}`}
          onClick={() => checkLiveStatus(true)}
          title="Refresh subscription status via API"
        >
          <FaRotateRight className="refresh-icon" />
          <span>{isSyncing ? 'Syncing...' : 'Sync Status'}</span>
        </button>
      </div>

      {/* Loading Live Status Skeleton */}
      {isCheckingStatus ? (
        <div className="sub-loader-card">
          <div className="sub-loader-spinner" />
          <h3 className="sub-loader-text">Checking Subscription Status</h3>
          <p className="sub-loader-subtext">Connecting to MTN Ghana billing server...</p>
        </div>
      ) : (
        <div className="sub-card-container">
          {/* Top Decorative Gold Bar */}
          <div className="sub-top-bar" />

          {/* ========================================================
             PURCHASE SUBSCRIPTION FLOW
             ======================================================== */}
          <div className="purchase-pass-view">
            <div className="sub-header-section">
              <div className="sub-badge-pill">
                <FaCrown className="crown-icon" />
                <span>VIP Access Pass</span>
              </div>
              <h1 className="sub-title">Unlock Unlimited Anime</h1>
              <p className="sub-subtitle">
                Watch top trending anime edits, AMVs, and exclusive episodes with instant carrier activation.
              </p>
            </div>

              {/* Plan Card */}
              <div className="plan-highlight-card">
                <div className="plan-ribbon">Most Popular</div>

                <div className="plan-top-info">
                  <h3 className="plan-main-name">{selectedPlan.name}</h3>
                  <div className="plan-price-tag">
                    <span className="currency-code">GHS</span>
                    <span className="price-number">{selectedPlan.price}</span>
                    <span className="duration-cadence">/ 24 hrs</span>
                  </div>
                </div>

                <div className="plan-features-list">
                  {selectedPlan.features.map((feature, idx) => (
                    <div key={idx} className="plan-feat-row">
                      <FaCircleCheck className="feat-bullet-icon" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Phone Input */}
              {showPhoneInput && (
                <div className="phone-input-group">
                  <div className="phone-label-row">
                    <label className="phone-label" htmlFor="sub-page-phone">
                      Mobile Number
                    </label>
                    <span className="carrier-badge">MTN Ghana</span>
                  </div>

                  <div className="phone-field-wrapper">
                    <span className="phone-country-code">+{COUNTRY_CODE}</span>
                    <input
                      id="sub-page-phone"
                      type="tel"
                      inputMode="numeric"
                      className="phone-actual-input"
                      value={phone}
                      onChange={(e) => setPhone(sanitizeLocalPhoneInput(e.target.value))}
                      placeholder="241234567"
                      maxLength={PHONE_INPUT_MAX_LENGTH}
                      disabled={isSubscribing}
                      autoComplete="tel-national"
                    />
                  </div>
                  <p className="phone-hint">
                    Enter your MTN Ghana mobile number to bill 1 GHS for 24-hour full access.
                  </p>
                </div>
              )}

              {/* Primary Subscribe Button */}
              <button
                type="button"
                className="btn-subscribe-submit"
                disabled={isSubscribing}
                onClick={(e) => handleSubscribe(selectedPlan.id, e)}
              >
                {isSubscribing ? (
                  <>
                    <span className="btn-spinner" />
                    <span>Connecting to MTN...</span>
                  </>
                ) : (
                  <span>Subscribe</span>
                )}
              </button>

              {/* Instant Test Demo Pass Button (when Demo Admin is active) */}
              {isDemoAdminEnabled() && (
                <button
                  type="button"
                  className="btn-demo-admin-activate"
                  onClick={() => {
                    setDemoSubscriptionState('active');
                    setIsActive(true);
                    onNotify('⚡ Demo 1-Day Pass activated instantly! All videos unlocked.', 'success');
                    if (onSubscribeSuccess) {
                      onSubscribeSuccess({ id: 'daily', planId: 'daily-pass', name: '1-Day Access Pass' });
                    }
                  }}
                  style={{
                    marginTop: '12px',
                    width: '100%',
                    padding: '12px',
                    borderRadius: '9999px',
                    background: 'rgba(255, 210, 31, 0.12)',
                    border: '1.5px dashed #ffd21f',
                    color: '#ffd21f',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <FaBolt />
                  <span>⚡ Activate Demo Pass (Instant Test)</span>
                </button>
              )}

              {/* Trust Badges & Legal Disclaimer */}
              <div className="sub-trust-footer">
                <div className="trust-badges-row">
                  <span className="trust-badge">
                    <FaShieldHalved className="trust-icon" />
                    <span>Secure Carrier Billing</span>
                  </span>
                  <span className="trust-badge">
                    <FaBolt className="trust-icon" />
                    <span>Instant Activation</span>
                  </span>
                </div>

                <p className="terms-disclaimer">
                  By subscribing, you agree to our{' '}
                  <span
                    className="disclaimer-link"
                    onClick={() => onNavigate('terms')}
                    role="button"
                    tabIndex={0}
                  >
                    Terms of Service
                  </span>{' '}
                  and{' '}
                  <span
                    className="disclaimer-link"
                    onClick={() => onNavigate('privacy')}
                    role="button"
                    tabIndex={0}
                  >
                    Privacy Policy
                  </span>
                  . Daily charge of 1 GHS applies until cancelled.
                </p>
              </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPage;
