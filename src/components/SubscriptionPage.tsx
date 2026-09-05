import React, { useEffect, useState } from 'react';
import './SubscriptionPage.css';
import { SUBSCRIPTION_PLANS, SubscriptionPlanConfig } from '../config/subscriptionPlans';
import { NOTIFICATION_MESSAGES, NotificationType } from '../constants/notifications';
import {
  activateLocalSubscription,
  LOCAL_SUBSCRIPTION_ENABLED,
  shouldUseHeFlow,
  startCgwByNetwork,
  subscribeToNetworkFlowChange,
} from '../config/subscription';
import {
  buildMsisdn,
  COUNTRY_CODE,
  isValidLocalPhoneInput,
  PHONE_INPUT_MAX_LENGTH,
  sanitizeLocalPhoneInput,
} from '../constants/phone';

interface SubscriptionPageProps {
  msisdn: string;
  onSubscribeSuccess: (plan: SubscriptionPlanConfig) => void;
  onNotify: (message: string, type: NotificationType) => void;
}

const SubscriptionPage: React.FC<SubscriptionPageProps> = ({
  msisdn,
  onSubscribeSuccess: _onSubscribeSuccess,
  onNotify,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('monthly');
  const [subscribingPlanId, setSubscribingPlanId] = useState<string | null>(null);
  const [phone, setPhone] = useState(() =>
    msisdn.startsWith(COUNTRY_CODE) ? msisdn.slice(COUNTRY_CODE.length) : ''
  );
  const [showPhoneInput, setShowPhoneInput] = useState(() => !shouldUseHeFlow());
  const nheMsisdn = showPhoneInput ? buildMsisdn(phone) : msisdn;

  useEffect(() => {
    const sync = () => setShowPhoneInput(!shouldUseHeFlow());
    sync();
    return subscribeToNetworkFlowChange(sync);
  }, []);

  const selectedPlanData = SUBSCRIPTION_PLANS.find((plan) => plan.id === selectedPlan);
  const isSubscribing = subscribingPlanId !== null;

  const handlePlanSelect = (planId: string) => {
    if (isSubscribing) {
      return;
    }
    setSelectedPlan(planId);
  };

  const handleSubscribe = async (
    planId: string,
    _apiPlanId: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();

    if (isSubscribing) {
      return;
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
    } catch {
      onNotify(NOTIFICATION_MESSAGES.SUBSCRIBE_ERROR, 'error');
      setSubscribingPlanId(null);
    }
  };

  return (
    <div className="subscription-page">
      {isSubscribing && (
        <div className="subscription-loading-overlay" aria-live="polite" aria-busy="true">
          <div className="subscription-loading-card">
            <span className="subscription-loading-spinner" aria-hidden="true" />
            <p>Subscribing...</p>
          </div>
        </div>
      )}

      <div className="background-effects">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className="subscription-container">
        <div className="subscription-header">
          <h1 className="main-title">
            Choose Your <span className="highlight">GHSnapflix</span> Plan
          </h1>
          <p className="subtitle">Unlock unlimited video content and premium features</p>
        </div>

        {showPhoneInput && (
          <div className="nhe-phone-block">
            <label className="nhe-phone-label" htmlFor="nhe-phone">Mobile number</label>
            <div className="nhe-phone-wrapper">
              <span className="nhe-phone-prefix">+{COUNTRY_CODE}</span>
              <input
                id="nhe-phone"
                type="tel"
                inputMode="numeric"
                className="nhe-phone-input"
                value={phone}
                onChange={(e) => setPhone(sanitizeLocalPhoneInput(e.target.value))}
                placeholder="241234567"
                maxLength={PHONE_INPUT_MAX_LENGTH}
                disabled={isSubscribing}
                autoComplete="tel-national"
              />
            </div>
          </div>
        )}

        <div className="plans-section">
          <div className="plans-grid">
            {SUBSCRIPTION_PLANS.map((plan) => {
              const isSelected = selectedPlan === plan.id;
              const isThisPlanLoading = subscribingPlanId === plan.id;

              return (
                <div
                  key={plan.id}
                  className={`plan-card ${plan.popular ? 'popular' : ''} ${isSelected ? 'selected' : ''}`}
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  {plan.popular && <div className="popular-badge">Most Popular</div>}
                  {plan.discount && <div className="discount-badge">{plan.discount}</div>}

                  <div className="plan-header">
                    <h3 className="plan-name">{plan.name}</h3>
                    <p className="plan-duration">{plan.duration}</p>
                  </div>

                  <div className="plan-pricing">
                    <div className="price-container">
                      <span className="currency">SZL</span>
                      <span className="price">{plan.price}</span>
                      {plan.originalPrice && (
                        <span className="original-price">SZL{plan.originalPrice}</span>
                      )}
                    </div>
                  </div>

                  <div className="plan-features">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="feature-item">
                        <span className="check-icon">✓</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    className={`select-plan-btn ${isSelected ? 'selected' : ''}`}
                    disabled={isSubscribing}
                    onClick={(event) => handleSubscribe(plan.id, plan.planId, event)}
                  >
                    {isThisPlanLoading ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {selectedPlanData && (
          <div className="payment-section">
            <div className="selected-plan-summary">
              <h3>Selected Plan: {selectedPlanData.name}</h3>
              <div className="plan-details">
                <span>Duration: {selectedPlanData.duration}</span>
                <span>Price: SZL{selectedPlanData.price}</span>
              </div>
            </div>
          </div>
        )}

        <div className="terms-section">
          <p>
            By proceeding with the subscription, you agree to our{' '}
            <a href="#" className="terms-link">Terms of Service</a> and{' '}
            <a href="#" className="terms-link">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
