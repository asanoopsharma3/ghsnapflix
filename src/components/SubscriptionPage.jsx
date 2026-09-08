import React, { useEffect, useState } from 'react';
import './SubscriptionPage.css';
import React, { useEffect, useState, useCallback } from 'react';
import './SubscriptionPage.scss';
import { SUBSCRIPTION_PLANS } from '../config/subscriptionPlans';
import { NOTIFICATION_MESSAGES } from '../constants/notifications';
import { activateLocalSubscription, LOCAL_SUBSCRIPTION_ENABLED, shouldUseHeFlow, startCgwByNetwork, subscribeToNetworkFlowChange, } from '../config/subscription';
import { buildMsisdn, COUNTRY_CODE, isValidLocalPhoneInput, PHONE_INPUT_MAX_LENGTH, sanitizeLocalPhoneInput, } from '../constants/phone';
const SubscriptionPage = ({ msisdn, onSubscribeSuccess: _onSubscribeSuccess, onNotify, }) => {
    const [selectedPlan, setSelectedPlan] = useState('daily');
    const [subscribingPlanId, setSubscribingPlanId] = useState(null);
    const [phone, setPhone] = useState(() => msisdn.startsWith(COUNTRY_CODE) ? msisdn.slice(COUNTRY_CODE.length) : '');
    const [showPhoneInput, setShowPhoneInput] = useState(() => !shouldUseHeFlow());
    const nheMsisdn = showPhoneInput ? buildMsisdn(phone) : msisdn;
    useEffect(() => {
        const sync = () => setShowPhoneInput(!shouldUseHeFlow());
        sync();
        return subscribeToNetworkFlowChange(sync);
    }, []);
    const selectedPlanData = SUBSCRIPTION_PLANS.find((plan) => plan.id === selectedPlan);
    const isSubscribing = subscribingPlanId !== null;
    const handlePlanSelect = (planId) => {
        if (isSubscribing) {
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
} from '../utils/sessionStorage';
import {
  FaCrown,
  FaCircleCheck,
  FaRotateRight,
  FaPlay,
  FaArrowLeft,
  FaShieldHalved,
  FaBolt,
  FaMobileScreen,
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
        setSelectedPlan(planId);
    };
    const handleSubscribe = async (planId, _apiPlanId, event) => {
        event.stopPropagation();
        if (isSubscribing) {
            return;

        // Fallback to local session check
        const activeLocally = Boolean(session.isSubscribed && isSubscriptionActive(session.subscription));
        setIsActive(activeLocally || Boolean(isSubscribed));
        if (session.subscription) {
          setLiveSubscription(session.subscription);
        }
        setSelectedPlan(planId);
        setSubscribingPlanId(planId);
        try {
            if (showPhoneInput && !isValidLocalPhoneInput(phone)) {
                onNotify(NOTIFICATION_MESSAGES.SUBSCRIBE_ERROR, 'error');
                setSubscribingPlanId(null);
                return;
            }
            if (!nheMsisdn && !shouldUseHeFlow()) {
                onNotify(NOTIFICATION_MESSAGES.SUBSCRIBE_ERROR, 'error');
                setSubscribingPlanId(null);
                return;
            }
            const plan = SUBSCRIPTION_PLANS.find((item) => item.id === planId);
            if (!plan) {
                onNotify(NOTIFICATION_MESSAGES.SUBSCRIBE_ERROR, 'error');
                setSubscribingPlanId(null);
                return;
            }
            localStorage.setItem('offerCode', plan.offerCode);
            if (LOCAL_SUBSCRIPTION_ENABLED) {
                const result = await activateLocalSubscription(nheMsisdn, plan.offerCode);
                const params = new URLSearchParams({
                    token: result.token,
                    status: 'success',
                    offerCode: result.offerCode || plan.offerCode,
                    msisdn: result.msisdn || nheMsisdn,
                });
                window.location.href = `/activation/callback?${params.toString()}`;
                return;
            }
            startCgwByNetwork(nheMsisdn, plan.offerCode);

        if (isManual) {
          onNotify('Subscription status refreshed.', 'info');
        }
        catch {
            onNotify(NOTIFICATION_MESSAGES.SUBSCRIBE_ERROR, 'error');
            setSubscribingPlanId(null);
      } catch (err) {
        console.warn('Subscription status check error:', err);
        const session = loadAppSession();
        setIsActive(Boolean(session.isSubscribed) || Boolean(isSubscribed));
        if (isManual) {
          onNotify('Unable to sync with server. Showing cached status.', 'info');
        }
    };
    return (<div className="subscription-page">
      {isSubscribing && (<div className="subscription-loading-overlay" aria-live="polite" aria-busy="true">
          <div className="subscription-loading-card">
            <span className="subscription-loading-spinner" aria-hidden="true"/>
            <p>Subscribing...</p>
          </div>
        </div>)}
      } finally {
        setIsCheckingStatus(false);
        if (isManual) setIsSyncing(false);
      }
    },
    [isSubscribed, onNotify]
  );

      <div className="background-effects">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
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

      <div className="subscription-container">
        <div className="subscription-header">
          <h1 className="main-title">
            Choose Your <span className="highlight">GHSnapflix</span> Plan
          </h1>
          <p className="subtitle">Unlock unlimited video content and premium features</p>
      {/* Loading Live Status Skeleton */}
      {isCheckingStatus ? (
        <div className="sub-loading-state">
          <div className="sub-loader-spinner" />
          <h3 className="sub-loader-text">Checking Subscription Status</h3>
          <p className="sub-loader-subtext">Connecting to MTN Ghana billing server...</p>
        </div>
      ) : (
        <div className="sub-card-container">
          {/* Top Decorative Gold Bar */}
          <div className="sub-top-bar" />

        {showPhoneInput && (<div className="nhe-phone-block">
            <label className="nhe-phone-label" htmlFor="nhe-phone">Mobile number</label>
            <div className="nhe-phone-wrapper">
              <span className="nhe-phone-prefix">+{COUNTRY_CODE}</span>
              <input id="nhe-phone" type="tel" inputMode="numeric" className="nhe-phone-input" value={phone} onChange={(e) => setPhone(sanitizeLocalPhoneInput(e.target.value))} placeholder="241234567" maxLength={PHONE_INPUT_MAX_LENGTH} disabled={isSubscribing} autoComplete="tel-national"/>
          {/* ========================================================
              STATE A: ACTIVE PASS ALREADY UNLOCKED
              ======================================================== */}
          {isActive ? (
            <div className="active-pass-view">
              <div className="sub-header-section">
                <div className="sub-badge-pill active-pass-pill">
                  <span className="status-pulse-dot" />
                  <span>Pass Active</span>
                </div>
                <h1 className="sub-title">1-Day Access Pass</h1>
                <p className="sub-subtitle">
                  Your VIP anime streaming pass is active and verified with MTN Mobile Billing.
                </p>
              </div>

              <div className="pass-status-box">
                <div className="pass-meta-row">
                  <span className="meta-label">Plan Tier</span>
                  <span className="meta-val">
                    <FaCrown style={{ color: '#f5c518' }} /> 1-Day Access Pass (1 GHS)
                  </span>
                </div>

                <div className="pass-meta-row">
                  <span className="meta-label">Access Status</span>
                  <span className="meta-val" style={{ color: '#16a34a' }}>
                    <FaCircleCheck /> Active & Unlocked
                  </span>
                </div>

                <div className="pass-meta-row">
                  <span className="meta-label">Billing Network</span>
                  <span className="meta-val">MTN Ghana Carrier Billing</span>
                </div>

                <div className="pass-meta-row">
                  <span className="meta-label">Pass Valid Until</span>
                  <span className="meta-val">{getExpiryDisplay()}</span>
                </div>

                <div className="pass-features-grid">
                  <div className="pass-feat-item">
                    <span className="check-badge">✓</span>
                    <span>Full HD Anime Streaming</span>
                  </div>
                  <div className="pass-feat-item">
                    <span className="check-badge">✓</span>
                    <span>100% Ad-Free Experience</span>
                  </div>
                  <div className="pass-feat-item">
                    <span className="check-badge">✓</span>
                    <span>Daily AMV Video Premieres</span>
                  </div>
                  <div className="pass-feat-item">
                    <span className="check-badge">✓</span>
                    <span>Direct MTN Mobile Billing</span>
                  </div>
                </div>
              </div>

              <div className="active-actions-row">
                <button
                  type="button"
                  className="btn-watch-anime"
                  onClick={() => onNavigate('videos')}
                >
                  <FaPlay style={{ fontSize: '13px' }} />
                  <span>Start Watching Anime</span>
                </button>

                <button
                  type="button"
                  className="btn-renew-pass"
                  disabled={isSubscribing}
                  onClick={(e) => handleSubscribe('daily', e)}
                >
                  {isSubscribing ? 'Renewing Pass...' : 'Renew / Extend 1-Day Pass (1 GHS)'}
                </button>
              </div>

              <div className="carrier-billing-notice">
                <FaCircleExclamation className="notice-icon" />
                <p className="notice-text">
                  <strong>Carrier Billing Info:</strong> Subscription is managed via MTN Ghana Mobile Billing.
                  To review or manage subscriptions directly on your handset, dial MTN USSD <strong>*175#</strong>.
                </p>
              </div>
            </div>
          </div>)}
          ) : (
            /* ========================================================
               STATE B: INACTIVE / PURCHASE SUBSCRIPTION FLOW
               ======================================================== */
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

        <div className="plans-section">
          <div className="plans-grid">
            {SUBSCRIPTION_PLANS.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            const isThisPlanLoading = subscribingPlanId === plan.id;
            return (<div key={plan.id} className={`plan-card ${plan.popular ? 'popular' : ''} ${isSelected ? 'selected' : ''}`} onClick={() => handlePlanSelect(plan.id)}>
                  {plan.popular && <div className="popular-badge">Most Popular</div>}
                  {plan.discount && <div className="discount-badge">{plan.discount}</div>}
              {/* Plan Card */}
              <div className="plan-highlight-card">
                <div className="plan-ribbon">Most Popular</div>

                  <div className="plan-header">
                    <h3 className="plan-name">{plan.name}</h3>
                    <p className="plan-duration">{plan.duration}</p>
                <div className="plan-top-info">
                  <h3 className="plan-main-name">{selectedPlan.name}</h3>
                  <div className="plan-price-tag">
                    <span className="currency-code">GHS</span>
                    <span className="price-number">{selectedPlan.price}</span>
                    <span className="duration-cadence">/ 24 hrs</span>
                  </div>
                </div>

                  <div className="plan-pricing">
                    <div className="price-container">
                      <span className="currency">GHS</span>
                      <span className="price">{plan.price}</span>
                      {plan.originalPrice && (<span className="original-price">GHS{plan.originalPrice}</span>)}
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

                  <div className="plan-features">
                    {plan.features.map((feature, index) => (<div key={index} className="feature-item">
                        <span className="check-icon">✓</span>
                        <span>{feature}</span>
                      </div>))}
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

                  <button type="button" className={`select-plan-btn ${isSelected ? 'selected' : ''}`} disabled={isSubscribing} onClick={(event) => handleSubscribe(plan.id, plan.planId, event)}>
                    {isThisPlanLoading ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </div>);
        })}
          </div>
        </div>
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

        {selectedPlanData && (<div className="payment-section">
            <div className="selected-plan-summary">
              <h3>Selected Plan: {selectedPlanData.name}</h3>
              <div className="plan-details">
                <span>Duration: {selectedPlanData.duration}</span>
                <span>Price: SZL{selectedPlanData.price}</span>
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
          </div>)}

        <div className="terms-section">
          <p>
            By proceeding with the subscription, you agree to our{' '}
            <a href="#" className="terms-link">Terms of Service</a> and{' '}
            <a href="#" className="terms-link">Privacy Policy</a>
          </p>
          )}
        </div>
      </div>
    </div>);
      )}
    </div>
  );
};

export default SubscriptionPage;
