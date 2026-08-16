import React, { useState } from 'react';
import './FAQPage.css';
import { useTranslation } from '../contexts/TranslationContext';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  icon: string;
}

const FAQPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const faqCategories = [
    { id: 'all', name: 'All Questions', icon: '❓' },
    { id: 'account', name: 'Account', icon: '👤' },
    { id: 'billing', name: 'Billing', icon: '💳' },
    { id: 'technical', name: 'Technical', icon: '🔧' },
    { id: 'games', name: 'Games', icon: '🎮' },
    { id: 'features', name: 'Features', icon: '⚡' }
  ];

  const faqItems: FAQItem[] = [
    {
      id: 1,
      question: 'How do I create an account on GHSnapflix?',
      answer: 'Creating an account is easy! Simply click on the "Sign Up" button in the top navigation, enter your email address and create a secure password. You can also sign up using your Google or Facebook account for faster registration.',
      category: 'account',
      icon: '👤'
    },
    {
      id: 2,
      question: 'What subscription plans are available?',
      answer: 'We offer three flexible subscription plans: Daily ($2.99), Weekly ($7.99), and Monthly ($24.99). All plans include unlimited access to our game library, exclusive content, and premium features. You can upgrade or downgrade your plan at any time.',
      category: 'billing',
      icon: '💳'
    },
    {
      id: 3,
      question: 'How can I cancel my subscription?',
      answer: 'You can cancel your subscription anytime from your account settings. Go to Profile > Subscriptions > Cancel Subscription. Your access will continue until the end of your current billing period. You can also reactivate your subscription at any time.',
      category: 'billing',
      icon: '💳'
    },
    {
      id: 4,
      question: 'What games are available on GHSnapflix?',
      answer: 'We have a vast library of over 10,000 games across multiple genres including action, adventure, puzzle, RPG, and more. New games are added weekly, and we feature exclusive titles you won\'t find anywhere else. Browse our catalog to discover your next favorite game.',
      category: 'games',
      icon: '🎮'
    },
    {
      id: 5,
      question: 'Can I play games offline?',
      answer: 'Yes! Many of our games support offline play. Simply download the games you want to play offline when you have an internet connection. Look for the download icon next to games that support offline mode.',
      category: 'technical',
      icon: '🔧'
    },
    {
      id: 6,
      question: 'How do I download games for offline play?',
      answer: 'To download games for offline play, find the game you want in our catalog and click the download button. Make sure you have sufficient storage space on your device. Downloads will only work with an active subscription.',
      category: 'technical',
      icon: '🔧'
    },
    {
      id: 7,
      question: 'What devices are supported?',
      answer: 'GHSnapflix is available on Windows, Mac, iOS, Android, and web browsers. We also support gaming consoles like PlayStation and Xbox. Your progress syncs across all devices when you\'re logged in with the same account.',
      category: 'technical',
      icon: '🔧'
    },
    {
      id: 8,
      question: 'How does the rewards system work?',
      answer: 'Our rewards system lets you earn points by playing games, completing achievements, and maintaining streaks. Points can be redeemed for premium content, exclusive items, and special privileges. Check your rewards dashboard to see available rewards.',
      category: 'features',
      icon: '⚡'
    },
    {
      id: 9,
      question: 'Can I share my account with family members?',
      answer: 'Yes! Our Family Plan allows up to 6 family members to share one subscription. Each family member gets their own profile and can play simultaneously. You can manage family members from your account settings.',
      category: 'account',
      icon: '👤'
    },
    {
      id: 10,
      question: 'How do I contact customer support?',
      answer: 'You can reach our support team 24/7 through live chat on our website, email at support@ghsnapflix.com, or by submitting a ticket through your account dashboard. Premium subscribers get priority support.',
      category: 'account',
      icon: '👤'
    },
    {
      id: 11,
      question: 'What are GHSnapflix Originals?',
      answer: 'GHSnapflix Originals are exclusive games developed specifically for our platform. These games feature unique storylines, characters, and gameplay mechanics that you won\'t find anywhere else. They\'re included with your subscription at no extra cost.',
      category: 'features',
      icon: '⚡'
    },
    {
      id: 12,
      question: 'How do I update my payment method?',
      answer: 'To update your payment method, go to Profile > Subscriptions > Payment Method. You can add, remove, or change your payment methods. We accept all major credit cards, PayPal, and digital wallets.',
      category: 'billing',
      icon: '💳'
    }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? faqItems 
    : faqItems.filter(item => item.category === selectedCategory);

  const toggleExpanded = (itemId: number) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <div className="faq-page">
      <div className="faq-container">
        {/* Header */}
        <div className="faq-header">
          <h1 className="faq-main-title">Frequently Asked Questions</h1>
          <p className="faq-subtitle">Find answers to common questions about GHSnapflix</p>
        </div>

        {/* Search Bar */}
        <div className="search-section">
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Search questions..." 
              className="search-input"
            />
            <button className="search-btn">
              <span className="search-icon">🔍</span>
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          {faqCategories.map((category) => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{category.name}</span>
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="faq-list">
          {filteredItems.map((item) => (
            <div key={item.id} className="faq-item">
              <div 
                className="faq-question"
                onClick={() => toggleExpanded(item.id)}
              >
                <div className="question-content">
                  <span className="question-icon">{item.icon}</span>
                  <h3 className="question-text">{item.question}</h3>
                </div>
                <button className={`expand-btn ${expandedItems.includes(item.id) ? 'expanded' : ''}`}>
                  <span className="expand-icon">+</span>
                </button>
              </div>
              {expandedItems.includes(item.id) && (
                <div className="faq-answer">
                  <p className="answer-text">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Support Section */}
        <div className="support-section">
          <div className="support-card">
            <div className="support-content">
              <div className="support-icon">💬</div>
              <div className="support-text">
                <h3>Still need help?</h3>
                <p>Can't find what you're looking for? Our support team is here to help!</p>
              </div>
            </div>
            <div className="support-actions">
              <button className="support-btn primary">
                <span>Live Chat</span>
                <span className="btn-icon">💬</span>
              </button>
              <button className="support-btn secondary">
                <span>Email Support</span>
                <span className="btn-icon">📧</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="quick-links">
          <h3 className="quick-links-title">Quick Links</h3>
          <div className="links-grid">
            <a href="#" className="quick-link">
              <span className="link-icon">📖</span>
              <span>User Guide</span>
            </a>
            <a href="#" className="quick-link">
              <span className="link-icon">🎮</span>
              <span>Game Tutorials</span>
            </a>
            <a href="#" className="quick-link">
              <span className="link-icon">💡</span>
              <span>Tips & Tricks</span>
            </a>
            <a href="#" className="quick-link">
              <span className="link-icon">📱</span>
              <span>Download Apps</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
