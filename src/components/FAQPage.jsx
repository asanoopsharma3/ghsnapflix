import React, { useState, useMemo } from 'react';
import './FAQPage.scss';
import {
  FaMagnifyingGlass,
  FaPlus,
  FaMinus,
  FaComments,
  FaEnvelope,
  FaBookOpen,
  FaGamepad,
  FaLightbulb,
  FaDownload,
  FaUserPlus,
  FaCrown,
  FaCreditCard,
  FaMobileScreen,
  FaGift,
  FaUsers,
  FaHeadset,
  FaStar,
  FaWallet,
  FaCloudArrowUp,
  FaChevronRight,
  FaCircleQuestion,
  FaWrench,
  FaShieldHalved,
} from 'react-icons/fa6';

export default function FAQPage({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(0); // First item open by default

  const FAQ_LIST = [
    {
      id: 1,
      category: 'account',
      icon: <FaUserPlus />,
      question: 'How do I create an account on GHSnapflix?',
      answer:
        'Creating an account is completely free and takes less than 30 seconds. Simply enter your mobile phone number, verify the OTP code sent via SMS, and you are ready to start streaming anime edits and playing web games immediately.',
    },
    {
      id: 2,
      category: 'billing',
      icon: <FaCrown />,
      question: 'What subscription plans are available?',
      answer:
        'We offer flexible Daily (GHS 1.00), Weekly (GHS 5.00), and Monthly (GHS 18.00) passes. All plans unlock unlimited ad-free 4K anime streaming, full access to our game library, and exclusive members-only rewards.',
    },
    {
      id: 3,
      category: 'billing',
      icon: <FaCreditCard />,
      question: 'How can I cancel my subscription?',
      answer:
        'You can cancel your subscription at any time with zero long-term commitments or cancellation fees. Simply visit the Subscription Management page in your profile or dial the USSD shortcode for your mobile telecom provider.',
    },
    {
      id: 4,
      category: 'streaming',
      icon: <FaGamepad />,
      question: 'What games are available on GHSnapflix?',
      answer:
        'We feature thousands of curated high-definition anime music videos, battle edits, AMVs, character spotlights, and instant cloud-playable anime browser games across Action, Adventure, Horror, Strategy, and Indie genres.',
    },
    {
      id: 5,
      category: 'streaming',
      icon: <FaDownload />,
      question: 'Can I play games offline?',
      answer:
        'Select anime browser games support offline caching on compatible mobile browsers. When offline mode is enabled, your progress and high scores sync automatically once your device reconnects to the network.',
    },
    {
      id: 6,
      category: 'streaming',
      icon: <FaDownload />,
      question: 'How do I download games for offline play?',
      answer:
        'To download offline-supported games, look for the download icon beneath the game player. Ensure your browser has local storage permissions enabled to save game assets securely.',
    },
    {
      id: 7,
      category: 'streaming',
      icon: <FaMobileScreen />,
      question: 'What devices are supported?',
      answer:
        'GHSnapflix is fully cross-platform! Stream and play seamlessly on iOS Safari, Android Chrome, Windows, macOS, and smart TVs with modern HTML5 video support.',
    },
    {
      id: 8,
      category: 'streaming',
      icon: <FaGift />,
      question: 'Are new anime videos added regularly?',
      answer:
        'Yes! Our catalog is updated daily with the newest trending anime clips, AMV premieres, action scenes, and fan favorites from popular series worldwide.',
    },
    {
      id: 9,
      category: 'account',
      icon: <FaUsers />,
      question: 'Can I share my account with family members?',
      answer:
        'Yes, our Standard and Premium membership tiers allow simultaneous streaming on up to 3 screens at the same time with synchronized favorite lists and watch history.',
    },
    {
      id: 10,
      category: 'account',
      icon: <FaHeadset />,
      question: 'How do I contact customer support?',
      answer:
        'Our friendly support team is available 24/7. You can connect via Live Chat directly on this page, send an email to support@ghsnapflix.com, or reach out through our community channels.',
    },
    {
      id: 11,
      category: 'streaming',
      icon: <FaStar />,
      question: 'What are GHSnapflix Originals?',
      answer:
        'GHSnapflix Originals are exclusive edits and game experiences created in partnership with top anime editors, VFX creators, and independent animators that you won’t find anywhere else.',
    },
    {
      id: 12,
      category: 'billing',
      icon: <FaWallet />,
      question: 'How do I update my payment method?',
      answer:
        'You can update your payment method anytime in the Subscription Management section. We support MTN Mobile Money, Telecel Cash, AT Money, and major credit/debit cards.',
    },
  ];

  const filteredFAQs = useMemo(() => {
    if (!searchQuery.trim()) return FAQ_LIST;
    const q = searchQuery.toLowerCase().trim();
    return FAQ_LIST.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const helpfulResources = [
    {
      icon: <FaBookOpen />,
      title: 'Getting Started Guide',
      desc: 'Learn the basics',
      action: () => setExpandedIndex(0),
    },
    {
      icon: <FaCreditCard />,
      title: 'Billing & Subscription',
      desc: 'Manage your plan',
      action: () => (onNavigate ? onNavigate('subscription-management') : null),
      action: () => (onNavigate ? onNavigate('subscription') : null),
    },
    {
      icon: <FaWrench />,
      title: 'Troubleshooting',
      desc: 'Fix common issues',
      action: () => setExpandedIndex(6),
    },
    {
      icon: <FaShieldHalved />,
      title: 'Safety & Security',
      desc: 'Keep your account safe',
      action: () => (onNavigate ? onNavigate('terms') : null),
    },
  ];

  const quickLinks = [
    {
      icon: <FaBookOpen />,
      title: 'User Guide',
      desc: 'Complete walkthrough of features and shortcuts',
      action: () => setExpandedIndex(0),
    },
    {
      icon: <FaGamepad />,
      title: 'Game Tutorials',
      desc: 'Tips on playing and mastering web games',
      action: () => (onNavigate ? onNavigate('videos') : null),
    },
    {
      icon: <FaLightbulb />,
      title: 'Anime Catalog',
      desc: 'Discover daily anime premieres and trending clips',
      action: () => (onNavigate ? onNavigate('videos') : null),
    },
    {
      icon: <FaDownload />,
      title: 'Download Apps',
      desc: 'Get GHSnapflix on Mobile, TV, and Desktop',
      action: () => alert('Mobile app download links coming soon! Use Web PWA in the meantime.'),
    },
  ];

  return (
    <div className="faq-page-wrapper">
      <div className="faq-redesign-canvas">
        {/* 1. HERO SECTION */}
        <section className="faq-hero-block">
          <div className="faq-hero-grid">
            {/* Left Hero Column */}
            <div className="faq-hero-left">
              <div className="faq-eyebrow">
                <span className="eyebrow-dash">—</span>
                <span>SUPPORT</span>
              </div>
              <h1 className="faq-hero-title">
                Frequently Asked <br />
                <span className="highlight-yellow">Questions</span>
              </h1>
              <p className="faq-hero-desc">
                Find answers to common questions about GHSnapflix. <br />
                Still need help? We're here for you!
              </p>

              {/* Large Rounded Search Bar */}
              <div className="faq-search-box-wrap">
                <FaMagnifyingGlass className="search-box-icon" />
                <input
                  type="text"
                  placeholder="Search for a question..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="faq-search-input"
                />
                {searchQuery && (
                  <button
                    className="clear-search-btn"
                    onClick={() => setSearchQuery('')}
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Right Hero Column: Naruto Artwork */}
            <div className="faq-hero-right">
              <div className="faq-hero-art-card">
                <img
                  src="/images/faq_naruto_hero_hd.png"
                  alt="Frequently Asked Questions - Good Anime Better Support"
                  className="faq-hero-art-img"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 2. MAIN 2-COLUMN LAYOUT: FAQ ACCORDION (LEFT) + SUPPORT SIDEBAR (RIGHT) */}
        <section className="faq-main-split">
          {/* Left Column (68-70%): FAQ Accordion Cards */}
          <div className="faq-questions-column">
            {filteredFAQs.length === 0 ? (
              <div className="faq-empty-state">
                <FaCircleQuestion className="empty-icon" />
                <h3>No matching questions</h3>
                <p>Try searching with a different keyword or browse all topics.</p>
                <button
                  className="btn-clear-search"
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="faq-accordion-list">
                {filteredFAQs.map((faq, idx) => {
                  const isExpanded = expandedIndex === idx;
                  return (
                    <div
                      key={faq.id}
                      className={`faq-accordion-card ${isExpanded ? 'is-expanded' : ''}`}
                    >
                      <div
                        className="faq-card-header"
                        onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                      >
                        <div className="faq-header-left">
                          <div className="faq-icon-circle">{faq.icon}</div>
                          <h4 className="faq-question-text">{faq.question}</h4>
                        </div>
                        <div className="faq-toggle-btn">
                          {isExpanded ? <FaMinus /> : <FaPlus />}
                        </div>
                      </div>
                      {isExpanded && (
                        <div className="faq-card-body">
                          <p>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column (30-32%): Support Sidebar */}
          <div className="faq-sidebar-column">
            {/* Card 1: Still Need Help? Prominent Yellow Card */}
            <div className="faq-support-yellow-card">
              <div className="card-text-side">
                <h3 className="support-card-title">
                  Still Need <br />
                  Help?
                </h3>
                <p className="support-card-desc">
                  Can't find what you're looking for? Our support team is here to help!
                </p>
                <div className="support-actions">
                  <button
                    className="btn-live-chat"
                    onClick={() =>
                      alert('Live Chat is active 24/7! Connecting to anime support agent...')
                    }
                  >
                    Live Chat →
                  </button>
                  <a href="mailto:support@ghsnapflix.com" className="btn-email-support">
                    <FaEnvelope className="btn-mail-icon" /> Email Support
                  </a>
                </div>
              </div>

              <div className="card-art-side">
                <img
                  src="/images/faq_luffy_clean.png"
                  alt="Luffy Support - We're Here For You!"
                  className="support-luffy-img"
                />
              </div>
            </div>

            {/* Card 2: Helpful Resources */}
            <div className="faq-resources-card">
              <div className="resources-header">
                <h4 className="resources-title">
                  <FaLightbulb className="bulb-icon" /> Helpful Resources
                </h4>
              </div>
              <div className="resources-list">
                {helpfulResources.map((res, idx) => (
                  <div
                    key={idx}
                    className="resource-item-row"
                    onClick={res.action}
                  >
                    <div className="res-icon-box">{res.icon}</div>
                    <div className="res-meta">
                      <div className="res-name">{res.title}</div>
                      <div className="res-desc">{res.desc}</div>
                    </div>
                    <FaChevronRight className="res-arrow" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3. QUICK LINKS SECTION */}
        <section className="faq-quick-links-section">
          <div className="section-title-wrap">
            <div className="quick-links-eyebrow">
              <span className="eyebrow-dash">—</span>
              <h3 className="section-title">Quick Links</h3>
            </div>
            <p className="section-subtitle">Everything you need, all in one place.</p>
          </div>

          <div className="quick-links-grid-wrap">
            <div className="quick-links-grid">
              {quickLinks.map((link, idx) => (
                <div
                  key={idx}
                  className="quick-link-card"
                  onClick={link.action}
                >
                  <div className="link-icon-circle">{link.icon}</div>
                  <h4 className="link-card-title">{link.title}</h4>
                </div>
              ))}
            </div>

            {/* Decorative Background Watermark */}
            <div className="quick-links-watermark">
              PLAY <br />
              LEARN <br />
              IMPROVE <br />
              ENJOY
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
