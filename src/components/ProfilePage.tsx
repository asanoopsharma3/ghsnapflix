import React, { useState, useCallback } from 'react';
import './ProfilePage.css';
import { useTranslation } from '../contexts/TranslationContext';

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);

  // User data for GHSnapflix streaming service
  const userData = {
    name: 'John Doe',
    email: 'john.doe@ghsnapflix.com',
    phone: '+233 24 123 4567',
    memberSince: 'January 2024',
    subscription: 'Premium Monthly',
    subscriptionStatus: 'Active',
    nextBilling: '15 Nov 2024',
    watchTime: '127 hours',
    contentWatched: 89,
    favorites: 23,
    downloads: 15
  };

  const watchHistory = [
    { title: 'FPS Gaming Tournament', duration: '45 min', date: '2 hours ago', thumbnail: 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=200&h=120&fit=crop' },
    { title: 'Racing Championship Finals', duration: '1h 15min', date: '1 day ago', thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=120&fit=crop' },
    { title: 'Adventure Game Walkthrough', duration: '52 min', date: '2 days ago', thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200&h=120&fit=crop' },
    { title: 'Action Game Highlights', duration: '38 min', date: '3 days ago', thumbnail: 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=200&h=120&fit=crop' }
  ];

  const favoriteContent = [
    { title: 'Epic FPS Battles', type: 'Series', episodes: 12, thumbnail: 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=200&h=120&fit=crop' },
    { title: 'Racing World Cup', type: 'Event', episodes: 8, thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=120&fit=crop' },
    { title: 'Gaming News Daily', type: 'Series', episodes: 156, thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200&h=120&fit=crop' }
  ];

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  const handleEditToggle = useCallback(() => {
    setIsEditing(!isEditing);
  }, [isEditing]);

  const handleSaveProfile = useCallback(() => {
    setIsEditing(false);
  }, []);

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Modern Profile Header */}
        <div className="profile-header">
          <div className="header-background"></div>
          
          <div className="profile-main">
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                <div className="avatar-circle">
                  <span className="avatar-text">{userData.name.charAt(0)}</span>
                </div>
                <div className="status-indicator">
                  <span className="status-dot"></span>
                  <span className="status-text">Active</span>
                </div>
              </div>
            </div>
            
            <div className="profile-info-section">
              <h1 className="profile-name">{userData.name}</h1>
              <p className="profile-email">{userData.email}</p>
              <div className="profile-meta">
                <span className="meta-item">
                  <span className="meta-icon">📅</span>
                  Member since {userData.memberSince}
                </span>
                <span className="meta-item">
                  <span className="meta-icon">💎</span>
                  {userData.subscription}
                </span>
              </div>
            </div>
            
            <div className="profile-actions">
              <button className="edit-profile-btn" onClick={handleEditToggle}>
                {isEditing ? (
                  <>
                    <span className="btn-icon">✕</span>
                    Cancel
                  </>
                ) : (
                  <>
                    <span className="btn-icon">✎</span>
                    Edit Profile
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Dashboard */}
        <div className="stats-dashboard">
          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <span className="stat-icon">⏱️</span>
            </div>
            <div className="stat-details">
              <div className="stat-value">{userData.watchTime}</div>
              <div className="stat-label">Watch Time</div>
            </div>
            <div className="stat-trend">
              <span className="trend-up">↑ 23%</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <span className="stat-icon">🎬</span>
            </div>
            <div className="stat-details">
              <div className="stat-value">{userData.contentWatched}</div>
              <div className="stat-label">Videos Watched</div>
            </div>
            <div className="stat-trend">
              <span className="trend-up">↑ 12%</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <span className="stat-icon">❤️</span>
            </div>
            <div className="stat-details">
              <div className="stat-value">{userData.favorites}</div>
              <div className="stat-label">Favorites</div>
            </div>
            <div className="stat-trend">
              <span className="trend-neutral">→</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <span className="stat-icon">📥</span>
            </div>
            <div className="stat-details">
              <div className="stat-value">{userData.downloads}</div>
              <div className="stat-label">Downloads</div>
            </div>
            <div className="stat-trend">
              <span className="trend-up">↑ 8%</span>
            </div>
          </div>
        </div>

        {/* Subscription Status Card */}
        <div className="subscription-status-card">
          <div className="subscription-header">
            <div className="subscription-info">
              <h3>Current Subscription</h3>
              <div className="subscription-badge">{userData.subscriptionStatus}</div>
            </div>
            <button className="manage-subscription-btn">Manage Plan</button>
          </div>
          <div className="subscription-details">
            <div className="subscription-item">
              <span className="item-label">Plan</span>
              <span className="item-value">{userData.subscription}</span>
            </div>
            <div className="subscription-item">
              <span className="item-label">Next Billing</span>
              <span className="item-value">{userData.nextBilling}</span>
            </div>
            <div className="subscription-item">
              <span className="item-label">Auto-Renewal</span>
              <span className="item-value">
                <span className="renewal-badge">Enabled</span>
              </span>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="tabs-navigation">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => handleTabChange('overview')}
          >
            <span className="tab-icon">📊</span>
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => handleTabChange('history')}
          >
            <span className="tab-icon">🕐</span>
            Watch History
          </button>
          <button 
            className={`tab-button ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => handleTabChange('favorites')}
          >
            <span className="tab-icon">⭐</span>
            Favorites
          </button>
          <button 
            className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => handleTabChange('settings')}
          >
            <span className="tab-icon">⚙️</span>
            Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-content">
              <div className="content-section">
                <div className="section-header">
                  <h3>Recently Watched</h3>
                  <a href="#" className="see-all-link">See all →</a>
                </div>
                <div className="content-grid">
                  {watchHistory.slice(0, 3).map((item, index) => (
                    <div key={index} className="content-card">
                      <div className="content-thumbnail">
                        <img src={item.thumbnail} alt={item.title} />
                        <div className="play-overlay">
                          <span className="play-btn">▶</span>
                        </div>
                        <div className="duration-badge">{item.duration}</div>
                      </div>
                      <div className="content-info">
                        <h4>{item.title}</h4>
                        <p>{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="content-section">
                <div className="section-header">
                  <h3>Continue Watching</h3>
                  <a href="#" className="see-all-link">See all →</a>
                </div>
                <div className="continue-watching-list">
                  <div className="continue-item">
                    <div className="continue-thumbnail">
                      <img src="https://images.unsplash.com/photo-1556438064-2d7646166914?w=150&h=90&fit=crop" alt="Content" />
                      <div className="progress-bar">
                        <div className="progress-fill" style={{width: '45%'}}></div>
                      </div>
                    </div>
                    <div className="continue-info">
                      <h4>Epic Gaming Moments</h4>
                      <p>45% complete • 23 min left</p>
                    </div>
                    <button className="resume-btn">Resume</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="history-content">
              <div className="section-header">
                <h3>Your Watch History</h3>
                <button className="clear-history-btn">Clear History</button>
              </div>
              <div className="history-list">
                {watchHistory.map((item, index) => (
                  <div key={index} className="history-item">
                    <div className="history-thumbnail">
                      <img src={item.thumbnail} alt={item.title} />
                      <div className="play-overlay-small">▶</div>
                    </div>
                    <div className="history-info">
                      <h4>{item.title}</h4>
                      <div className="history-meta">
                        <span>{item.duration}</span>
                        <span className="dot-separator">•</span>
                        <span>{item.date}</span>
                      </div>
                    </div>
                    <button className="more-options-btn">⋮</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="favorites-content">
              <div className="section-header">
                <h3>Your Favorite Content</h3>
                <div className="filter-buttons">
                  <button className="filter-btn active">All</button>
                  <button className="filter-btn">Series</button>
                  <button className="filter-btn">Movies</button>
                  <button className="filter-btn">Events</button>
                </div>
              </div>
              <div className="favorites-grid">
                {favoriteContent.map((item, index) => (
                  <div key={index} className="favorite-card">
                    <div className="favorite-thumbnail">
                      <img src={item.thumbnail} alt={item.title} />
                      <button className="favorite-heart">❤️</button>
                      <div className="type-badge">{item.type}</div>
                    </div>
                    <div className="favorite-info">
                      <h4>{item.title}</h4>
                      <p>{item.episodes} episodes</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-content">
              <div className="settings-section">
                <h3>Account Settings</h3>
                <div className="settings-grid">
                  <div className="setting-item">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      defaultValue={userData.name}
                      disabled={!isEditing}
                      className={isEditing ? 'editable' : ''}
                    />
                  </div>
                  <div className="setting-item">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      defaultValue={userData.email}
                      disabled={!isEditing}
                      className={isEditing ? 'editable' : ''}
                    />
                  </div>
                  <div className="setting-item">
                    <label>Phone Number</label>
                    <input 
                      type="tel" 
                      defaultValue={userData.phone}
                      disabled={!isEditing}
                      className={isEditing ? 'editable' : ''}
                    />
                  </div>
                  <div className="setting-item">
                    <label>Language</label>
                    <select disabled={!isEditing} className={isEditing ? 'editable' : ''}>
                      <option>English</option>
                      <option>中文 (Chinese)</option>
                      <option>Français (French)</option>
                    </select>
                  </div>
                </div>
                {isEditing && (
                  <div className="save-section">
                    <button className="save-btn" onClick={handleSaveProfile}>
                      Save Changes
                    </button>
                  </div>
                )}
              </div>

              <div className="settings-section">
                <h3>Preferences</h3>
                <div className="preference-list">
                  <div className="preference-item">
                    <div className="preference-info">
                      <h4>Autoplay Next Episode</h4>
                      <p>Automatically play the next episode when one finishes</p>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  <div className="preference-item">
                    <div className="preference-info">
                      <h4>HD Streaming</h4>
                      <p>Stream in high definition when available</p>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  <div className="preference-item">
                    <div className="preference-info">
                      <h4>Email Notifications</h4>
                      <p>Receive updates about new content and features</p>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
