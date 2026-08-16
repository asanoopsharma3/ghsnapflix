import React, { useState } from 'react';
import './SubscriptionPage.css';
import { SUBSCRIPTION_PLANS, SubscriptionPlanConfig } from '../config/subscriptionPlans';
import { NOTIFICATION_MESSAGES, NotificationType } from '../constants/notifications';
import { subscribe } from '../services/subscriptionService';

interface SubscriptionPageProps {
  msisdn: string;
  onSubscribeSuccess: (plan: SubscriptionPlanConfig) => void;
  onNotify: (message: string, type: NotificationType) => void;
}

const SubscriptionPage: React.FC<SubscriptionPageProps> = ({
  msisdn,
  onSubscribeSuccess,
  onNotify,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('monthly');
  const [subscribingPlanId, setSubscribingPlanId] = useState<string | null>(null);

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
    apiPlanId: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();

    if (isSubscribing) {
      return;
    }

    setSelectedPlan(planId);
    setSubscribingPlanId(planId);

    try {
      const response = await subscribe(msisdn, apiPlanId);
      const plan = SUBSCRIPTION_PLANS.find((item) => item.id === planId);

      if (response.ok && plan) {
        onSubscribeSuccess(plan);
      } else {
        onNotify(NOTIFICATION_MESSAGES.SUBSCRIBE_ERROR, 'error');
      }
    } catch {
      onNotify(NOTIFICATION_MESSAGES.SUBSCRIBE_ERROR, 'error');
    } finally {
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
