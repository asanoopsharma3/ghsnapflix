import React, { useState } from 'react';
import './SubscriptionManagementPage.css';

interface SubscriptionManagementPageProps {
  onNavigate: (page: string) => void;
}

const SubscriptionManagementPage: React.FC<SubscriptionManagementPageProps> = ({ onNavigate }) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock user subscription data
  const currentSubscription = {
    plan: 'Premium Monthly',
    status: 'Active',
    startDate: '2024-01-15',
    nextBilling: '2024-02-15',
    amount: 299,
    currency: '₹',
    features: [
      'Unlimited streaming',
      'HD & 4K quality',
      'Multiple devices',
      'Offline downloads',
      'Ad-free experience',
      'Priority support'
    ],
    usage: {
      devices: 2,
      maxDevices: 4,
      downloads: 15,
      maxDownloads: 100,
      streamingHours: 45,
      maxHours: 'Unlimited'
    }
  };

  const billingHistory = [
    {
      id: '1',
      date: '2024-01-15',
      amount: 299,
      currency: '₹',
      status: 'Paid',
      description: 'Premium Monthly Plan'
    },
    {
      id: '2',
      date: '2023-12-15',
      amount: 299,
      currency: '₹',
      status: 'Paid',
      description: 'Premium Monthly Plan'
    },
    {
      id: '3',
      date: '2023-11-15',
      amount: 299,
      currency: '₹',
      status: 'Paid',
      description: 'Premium Monthly Plan'
    }
  ];

  const handleUpgradePlan = () => {
    onNavigate('subscription');
  };

  const handleCancelSubscription = () => {
    setShowCancelModal(true);
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    setIsLoading(true);
    // Simulate download
    setTimeout(() => {
      setIsLoading(false);
      alert('Invoice downloaded successfully!');
    }, 1000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return '#22c55e';
      case 'paid':
        return '#22c55e';
      case 'pending':
        return '#f59e0b';
      case 'failed':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="subscription-management-page">
      <div className="subscription-container">
        {/* Header */}
        <div className="page-header">
          <button className="back-button" onClick={() => onNavigate('profile')}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Profile
          </button>
          <h1 className="page-title">Subscription Management</h1>
          <p className="page-subtitle">Manage your GHSnapflix subscription and billing</p>
        </div>

        {/* Current Subscription Card */}
        <div className="subscription-card">
          <div className="card-header">
            <div className="plan-info">
              <h2 className="plan-name">{currentSubscription.plan}</h2>
              <div className="status-badge" style={{ backgroundColor: getStatusColor(currentSubscription.status) }}>
                {currentSubscription.status}
              </div>
            </div>
            <div className="plan-price">
              <span className="price-amount">{currentSubscription.currency}{currentSubscription.amount}</span>
              <span className="price-period">/month</span>
            </div>
          </div>

          <div className="subscription-details">
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Start Date</span>
                <span className="detail-value">{formatDate(currentSubscription.startDate)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Next Billing</span>
                <span className="detail-value">{formatDate(currentSubscription.nextBilling)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Billing Cycle</span>
                <span className="detail-value">Monthly</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Auto Renewal</span>
                <span className="detail-value">Enabled</span>
              </div>
            </div>
          </div>

          <div className="card-actions">
            <button className="action-button primary" onClick={handleUpgradePlan}>
              <span>Upgrade Plan</span>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M4 10L16 10M10 4L16 10L10 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="action-button secondary" onClick={handleCancelSubscription}>
              <span>Cancel Subscription</span>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M4 8L12 8M8 4L12 8L8 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <h3 className="section-title">Your Plan Features</h3>
          <div className="features-grid">
            {currentSubscription.features.map((feature, index) => (
              <div key={index} className="feature-item">
                <div className="feature-icon">✅</div>
                <span className="feature-text">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Statistics */}
        <div className="usage-section">
          <h3 className="section-title">Usage Statistics</h3>
          <div className="usage-grid">
            <div className="usage-card">
              <div className="usage-icon">📱</div>
              <div className="usage-info">
                <span className="usage-label">Active Devices</span>
                <span className="usage-value">
                  {currentSubscription.usage.devices}/{currentSubscription.usage.maxDevices}
                </span>
              </div>
              <div className="usage-progress">
                <div 
                  className="progress-bar"
                  style={{ width: `${(currentSubscription.usage.devices / currentSubscription.usage.maxDevices) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="usage-card">
              <div className="usage-icon">⬇️</div>
              <div className="usage-info">
                <span className="usage-label">Downloads</span>
                <span className="usage-value">
                  {currentSubscription.usage.downloads}/{currentSubscription.usage.maxDownloads}
                </span>
              </div>
              <div className="usage-progress">
                <div 
                  className="progress-bar"
                  style={{ width: `${(currentSubscription.usage.downloads / currentSubscription.usage.maxDownloads) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="usage-card">
              <div className="usage-icon">⏱️</div>
              <div className="usage-info">
                <span className="usage-label">Streaming Hours</span>
                <span className="usage-value">
                  {currentSubscription.usage.streamingHours} hours this month
                </span>
              </div>
              <div className="usage-progress">
                <div className="progress-bar full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Billing History */}
        <div className="billing-section">
          <h3 className="section-title">Billing History</h3>
          <div className="billing-table">
            <div className="table-header">
              <span>Date</span>
              <span>Description</span>
              <span>Amount</span>
              <span>Status</span>
              <span>Action</span>
            </div>
            {billingHistory.map((invoice) => (
              <div key={invoice.id} className="table-row">
                <span className="invoice-date">{formatDate(invoice.date)}</span>
                <span className="invoice-description">{invoice.description}</span>
                <span className="invoice-amount">{invoice.currency}{invoice.amount}</span>
                <span 
                  className="invoice-status"
                  style={{ color: getStatusColor(invoice.status) }}
                >
                  {invoice.status}
                </span>
                <button 
                  className="download-button"
                  onClick={() => handleDownloadInvoice(invoice.id)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="spinner"></div>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                      <path d="M3 17L17 17M10 3L10 17M6 13L10 17L14 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div className="payment-section">
          <h3 className="section-title">Payment Method</h3>
          <div className="payment-card">
            <div className="payment-info">
              <div className="payment-icon">💳</div>
              <div className="payment-details">
                <span className="card-type">Visa ending in 4242</span>
                <span className="card-expiry">Expires 12/25</span>
              </div>
            </div>
            <button className="update-payment-button">
              <span>Update</span>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M3 10L17 10M10 3L17 10L10 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Cancel Subscription</h3>
              <button 
                className="close-button"
                onClick={() => setShowCancelModal(false)}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to cancel your subscription?</p>
              <p className="modal-warning">
                You'll lose access to all premium features at the end of your current billing period.
              </p>
            </div>
            <div className="modal-actions">
              <button 
                className="modal-button secondary"
                onClick={() => setShowCancelModal(false)}
              >
                Keep Subscription
              </button>
              <button 
                className="modal-button danger"
                onClick={() => onNavigate('unsubscribe')}
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagementPage;
