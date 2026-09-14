import React, { useState, useEffect } from 'react';
import './LegalSupportModal.scss';
import {
  FaHeadset,
  FaFileContract,
  FaShieldHalved,
  FaArrowRotateLeft,
  FaXmark,
  FaPhone,
  FaWhatsapp,
  FaEnvelope,
  FaFacebookF,
  FaXTwitter
} from 'react-icons/fa6';

export default function LegalSupportModal({ isOpen, initialTab = 'terms', onClose }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'terms');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="legal-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="legal-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Top Bar */}
        <div className="legal-modal-header">
          <div className="modal-title-group">
            <div className={`modal-icon-badge badge-${activeTab}`}>
              {activeTab === 'help' && <FaHeadset />}
              {activeTab === 'terms' && <FaFileContract />}
              {activeTab === 'privacy' && <FaShieldHalved />}
              {activeTab === 'subscription' && <FaArrowRotateLeft />}
            </div>
            <div>
              <h2 className="modal-title">
                {activeTab === 'help' && 'MTN SUPPORT CONTACT'}
                {activeTab === 'terms' && 'TERMS & CONDITIONS'}
                {activeTab === 'privacy' && 'PRIVACY POLICY'}
                {activeTab === 'subscription' && 'SUBSCRIPTION & REFUND POLICY'}
              </h2>
              <span className="modal-badge-meta">
                {activeTab === 'help' ? 'GHSNAPFLIX.buzz • 24/7 Assistance' : 'Last Updated: 2026'}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <FaXmark />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="legal-modal-tabs">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'help' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('help')}
          >
            <FaHeadset className="tab-icon" />
            <span className="tab-label-full">Help Center</span>
            <span className="tab-label-short">Help</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'terms' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('terms')}
          >
            <FaFileContract className="tab-icon" />
            <span className="tab-label-full">Terms & Conditions</span>
            <span className="tab-label-short">Terms</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'privacy' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            <FaShieldHalved className="tab-icon" />
            <span className="tab-label-full">Privacy Policy</span>
            <span className="tab-label-short">Privacy</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'subscription' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('subscription')}
          >
            <FaArrowRotateLeft className="tab-icon" />
            <span className="tab-label-full">Subscription Policy</span>
            <span className="tab-label-short">Billing</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="legal-modal-body">
          {/* TAB 1: HELP CENTER / MTN SUPPORT CONTACT */}
          {activeTab === 'help' && (
            <div className="tab-content support-contact-content">
              <div className="support-sub-header">
                <span className="pill-badge">
                  <FaHeadset /> MTN SUPPORT CONTACT
                </span>
                <p className="support-intro-text">
                  Need assistance with your GHSNAPFLIX.buzz subscription, streaming, or billing? Contact official MTN Ghana Customer Care or our direct platform channels below.
                </p>
              </div>

              <div className="contact-cards-list">
                {/* Dial 100 */}
                <a href="tel:100" className="contact-card">
                  <div className="contact-icon-bubble">
                    <FaPhone />
                  </div>
                  <div className="contact-info">
                    <span className="contact-label">DIAL</span>
                    <strong className="contact-value">100</strong>
                  </div>
                  <span className="contact-action-hint">Toll Free</span>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/233554300000"
                  target="_blank"
                  rel="noreferrer"
                  className="contact-card"
                >
                  <div className="contact-icon-bubble whatsapp-bubble">
                    <FaWhatsapp />
                  </div>
                  <div className="contact-info">
                    <span className="contact-label">WHATSAPP</span>
                    <strong className="contact-value">0554300000</strong>
                  </div>
                  <span className="contact-action-hint">Chat Now</span>
                </a>

                {/* Email */}
                <a
                  href="mailto:customercare.GH@mtn.com"
                  className="contact-card"
                >
                  <div className="contact-icon-bubble email-bubble">
                    <FaEnvelope />
                  </div>
                  <div className="contact-info">
                    <span className="contact-label">EMAIL</span>
                    <strong className="contact-value">customercare.GH@mtn.com</strong>
                  </div>
                  <span className="contact-action-hint">Send Email</span>
                </a>

                {/* Facebook */}
                <a
                  href="https://facebook.com/MTNGhana"
                  target="_blank"
                  rel="noreferrer"
                  className="contact-card"
                >
                  <div className="contact-icon-bubble fb-bubble">
                    <FaFacebookF />
                  </div>
                  <div className="contact-info">
                    <span className="contact-label">FACEBOOK</span>
                    <strong className="contact-value">MTNGhana</strong>
                  </div>
                  <span className="contact-action-hint">Visit Page</span>
                </a>

                {/* Twitter / X */}
                <div className="contact-card social-dual-card">
                  <div className="contact-icon-bubble x-bubble">
                    <FaXTwitter />
                  </div>
                  <div className="contact-info">
                    <span className="contact-label">TWITTER / X</span>
                    <div className="x-handles">
                      <a
                        href="https://twitter.com/MTNGhana"
                        target="_blank"
                        rel="noreferrer"
                        className="x-handle-link"
                      >
                        @MTNGhana
                      </a>
                      <a
                        href="https://twitter.com/AskMTNGhana"
                        target="_blank"
                        rel="noreferrer"
                        className="x-handle-link"
                      >
                        @AskMTNGhana
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="platform-support-notice">
                <h4>GHSNAPFLIX Platform Support</h4>
                <p>
                  For platform-specific video playback feedback or inquiries, write to{' '}
                  <a href="mailto:support@ghsnapflix.buzz">support@ghsnapflix.buzz</a>.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: TERMS & CONDITIONS */}
          {activeTab === 'terms' && (
            <div className="tab-content terms-content">
              <div className="legal-article-card">
                <span className="article-number">1</span>
                <div className="article-body">
                  <h3>Eligibility</h3>
                  <p>
                    Participation in GHSNAPFLIX.buzz is open to users who are legally eligible to subscribe and participate under the laws and regulations of their country. By using the service, you confirm that you meet all applicable eligibility requirements.
                  </p>
                </div>
              </div>

              <div className="legal-article-card">
                <span className="article-number">2</span>
                <div className="article-body">
                  <h3>Subscription Service</h3>
                  <p>GHSNAPFLIX.buzz is a subscription-based video streaming and entertainment platform.</p>
                  <ul className="legal-bullet-list">
                    <li><strong>Subscription Plan:</strong> Daily Only.</li>
                    <li>Applicable subscription fees will be charged through your mobile operator or approved payment method.</li>
                    <li>Subscription renewals may occur automatically until cancelled by the user.</li>
                    <li>Users may unsubscribe at any time through the available unsubscribe mechanisms.</li>
                  </ul>
                </div>
              </div>

              <div className="legal-article-card">
                <span className="article-number">3</span>
                <div className="article-body">
                  <h3>User Responsibilities</h3>
                  <p>
                    Users are responsible for ensuring that the mobile number and information provided are accurate and up to date.
                  </p>
                </div>
              </div>

              <div className="legal-article-card">
                <span className="article-number">4</span>
                <div className="article-body">
                  <h3>Privacy &amp; Data Protection</h3>
                  <p>By using the service, you consent to the collection and processing of your mobile number and related information for:</p>
                  <ul className="legal-bullet-list">
                    <li>Service delivery</li>
                    <li>Subscription management</li>
                    <li>Customer support</li>
                    <li>Service improvement</li>
                  </ul>
                  <p>Personal information will be handled in accordance with applicable data protection laws.</p>
                </div>
              </div>

              <div className="legal-article-card">
                <span className="article-number">5</span>
                <div className="article-body">
                  <h3>Service Availability</h3>
                  <p>
                    While we strive to provide uninterrupted access, GHSNAPFLIX.buzz does not guarantee continuous availability. Service interruptions may occur due to maintenance, network issues, technical failures, or circumstances beyond our control.
                  </p>
                </div>
              </div>

              <div className="legal-article-card">
                <span className="article-number">6</span>
                <div className="article-body">
                  <h3>Limitation of Liability</h3>
                  <p>
                    GHSNAPFLIX.buzz, its partners, affiliates, and mobile operators shall not be liable for any indirect, incidental, consequential, or special damages arising from the use of the service.
                  </p>
                </div>
              </div>

              <div className="legal-article-card">
                <span className="article-number">7</span>
                <div className="article-body">
                  <h3>Modification of Terms</h3>
                  <p>
                    GHSNAPFLIX.buzz reserves the right to amend these Terms &amp; Conditions at any time. Continued use of the service following such changes constitutes acceptance of the updated Terms.
                  </p>
                </div>
              </div>

              <div className="legal-article-card">
                <span className="article-number">8</span>
                <div className="article-body">
                  <h3>Contact Support</h3>
                  <p>
                    For assistance, inquiries, subscription support, or service-related questions, please contact the official GHSNAPFLIX.buzz customer support channels available on the website or via MTN Customer Care.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="tab-content privacy-content">
              <div className="legal-article-card">
                <span className="article-number">1</span>
                <div className="article-body">
                  <h3>Data Collection</h3>
                  <p>
                    By using GHSNAPFLIX.buzz, you consent to the collection and processing of your mobile number and video streaming activity for service delivery, subscription management, playback continuity, and customer support.
                  </p>
                </div>
              </div>

              <div className="legal-article-card">
                <span className="article-number">2</span>
                <div className="article-body">
                  <h3>Security &amp; Protection</h3>
                  <p>
                    All personal information and transactions are handled in strict accordance with applicable data protection laws and industry-standard 256-bit encryption.
                  </p>
                </div>
              </div>

              <div className="legal-article-card">
                <span className="article-number">3</span>
                <div className="article-body">
                  <h3>Streaming Quality &amp; Fair Use Monitoring</h3>
                  <p>
                    Streaming logs and session activity are monitored solely to ensure high-definition streaming performance, optimize server routing, and prevent unauthorized automation or fraud.
                  </p>
                </div>
              </div>

              <div className="legal-article-card">
                <span className="article-number">4</span>
                <div className="article-body">
                  <h3>User Controls</h3>
                  <p>
                    Users may request access, updates, or removal of their profile information and watch history by contacting customer care via our official support channels.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SUBSCRIPTION & REFUND POLICY */}
          {activeTab === 'subscription' && (
            <div className="tab-content subscription-content">
              <div className="legal-article-card">
                <span className="article-number">1</span>
                <div className="article-body">
                  <h3>Subscription Plans</h3>
                  <p>
                    Subscriptions on GHSNAPFLIX.buzz are available exclusively in the <strong>Daily Only (1 GHS)</strong> tier, granting full 24-hour unlimited access to all anime series and high-definition streams. Access ends strictly after 24 hours unless renewed.
                  </p>
                </div>
              </div>

              <div className="legal-article-card">
                <span className="article-number">2</span>
                <div className="article-body">
                  <h3>Instant Activation</h3>
                  <p>
                    Passes grant instant, unrestricted access to anime episodes, full-screen playback, and featured catalog content immediately upon mobile operator confirmation.
                  </p>
                </div>
              </div>

              <div className="legal-article-card">
                <span className="article-number">3</span>
                <div className="article-body">
                  <h3>Cancellations &amp; Auto-Renewals</h3>
                  <p>
                    Users can unsubscribe at any time through standard mobile carrier unsubscribe codes or directly through the on-site Unsubscribe page. Active passes remain usable until the current 24-hour cycle completes.
                  </p>
                </div>
              </div>

              <div className="legal-article-card">
                <span className="article-number">4</span>
                <div className="article-body">
                  <h3>Billing Support &amp; Inquiries</h3>
                  <p>
                    For billing inquiries or operator charge queries, contact MTN Customer Care by dialing <strong>100</strong> or emailing{' '}
                    <a href="mailto:customercare.GH@mtn.com">customercare.GH@mtn.com</a>.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

