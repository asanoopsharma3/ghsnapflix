import React, { useState } from 'react';
import './UnsubscribePage.css';

interface UnsubscribePageProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const UnsubscribePage: React.FC<UnsubscribePageProps> = ({ onNavigate, onLogout }) => {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);
  const [logoutCountdown, setLogoutCountdown] = useState(3);

  const unsubscribeReasons = [
    { id: 'too-expensive', label: 'Too expensive', icon: '💰' },
    { id: 'not-using', label: "Not using the service", icon: '📱' },
    { id: 'technical-issues', label: 'Technical issues', icon: '🔧' },
    { id: 'found-alternative', label: 'Found a better alternative', icon: '🔄' },
    { id: 'content-not-interesting', label: 'Content not interesting', icon: '📺' },
    { id: 'too-many-emails', label: 'Too many emails/notifications', icon: '📧' },
    { id: 'temporary', label: 'Taking a break (temporary)', icon: '⏸️' },
    { id: 'other', label: 'Other reason', icon: '❓' }
  ];

  const handleUnsubscribe = async () => {
    if (!selectedReason) return;
    
    setIsUnsubscribing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsUnsubscribing(false);
      setIsUnsubscribed(true);
      
      // Start countdown for logout
      const countdownInterval = setInterval(() => {
        setLogoutCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            onLogout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 2000);
  };

  const handleStaySubscribed = () => {
    onNavigate('subscription');
  };

  if (isUnsubscribed) {
    return (
      <div className="unsubscribe-page">
        <div className="unsubscribe-container">
          <div className="success-content">
            <div className="success-icon">✅</div>
            <h1 className="success-title">Successfully Unsubscribed</h1>
            <p className="success-message">
              We're sorry to see you go! Your subscription has been cancelled and you won't be charged again.
            </p>
            <div className="logout-notice">
              <p className="logout-message">
                You will be automatically logged out in {logoutCountdown} seconds.
              </p>
            </div>
            
            <div className="unsubscribe-details">
              <div className="detail-item">
                <span className="detail-label">Cancellation Date:</span>
                <span className="detail-value">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Access Until:</span>
                <span className="detail-value">End of current billing period</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Refund:</span>
                <span className="detail-value">No refund for partial period</span>
              </div>
            </div>

            <div className="success-actions">
              <button 
                className="action-button primary"
                onClick={() => onNavigate('home')}
              >
                <span>Continue to Home</span>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10L16 10M10 4L16 10L10 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              <button 
                className="action-button secondary"
                onClick={handleStaySubscribed}
              >
                <span>Resubscribe</span>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M3 10L17 10M10 3L17 10L10 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="unsubscribe-page">
      <div className="unsubscribe-container">
        <div className="unsubscribe-header">
          <div className="unsubscribe-icon">😢</div>
          <h1 className="unsubscribe-title">We're Sorry to See You Go!</h1>
          <p className="unsubscribe-subtitle">
            Help us improve by telling us why you're unsubscribing
          </p>
        </div>

        <div className="unsubscribe-content">
          <div className="reason-section">
            <h3 className="section-title">Why are you unsubscribing?</h3>
            <div className="reason-options">
              {unsubscribeReasons.map((reason) => (
                <label key={reason.id} className="reason-option">
                  <input
                    type="radio"
                    name="reason"
                    value={reason.id}
                    checked={selectedReason === reason.id}
                    onChange={(e) => setSelectedReason(e.target.value)}
                  />
                  <span className="reason-icon">{reason.icon}</span>
                  <span className="reason-label">{reason.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="feedback-section">
            <h3 className="section-title">Additional Feedback (Optional)</h3>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us more about your experience or suggestions for improvement..."
              className="feedback-textarea"
              rows={4}
            />
          </div>

          <div className="warning-section">
            <div className="warning-icon">⚠️</div>
            <div className="warning-content">
              <h4 className="warning-title">Important Information</h4>
              <ul className="warning-list">
                <li>Your subscription will end at the end of the current billing period</li>
                <li>You'll retain access until then</li>
                <li>No refunds will be issued for the current period</li>
                <li>You can resubscribe anytime</li>
              </ul>
            </div>
          </div>

          <div className="unsubscribe-actions">
            <button 
              className="action-button danger"
              onClick={handleUnsubscribe}
              disabled={!selectedReason || isUnsubscribing}
            >
              {isUnsubscribing ? (
                <>
                  <div className="spinner"></div>
                  <span>Unsubscribing...</span>
                </>
              ) : (
                <>
                  <span>Confirm Unsubscribe</span>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M4 8L12 8M8 4L12 8L8 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </button>
            
            <button 
              className="action-button secondary"
              onClick={handleStaySubscribed}
              disabled={isUnsubscribing}
            >
              <span>Stay Subscribed</span>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M3 10L17 10M10 3L17 10L10 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnsubscribePage;
