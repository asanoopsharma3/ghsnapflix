import React, { useState, useCallback, useMemo, useEffect } from 'react';
import './ProfilePage.css';
import { useTranslation } from '../contexts/TranslationContext';
import { useFavorites } from '../hooks/useFavorites';
import {
  TRENDING_ANIME_VIDEOS,
  FEATURED_ANIME_VIDEOS,
} from '../config/animeCatalog';
import { loadAppSession } from '../utils/sessionStorage';
import { fetchSubscriptionStatus } from '../services/subscriptionService';
import { SUBSCRIPTION_PLANS } from '../config/subscriptionPlans';
import {
  getStoredProfile,
  saveStoredProfile,
  getStoredPreferences,
  saveStoredPreferences,
} from '../utils/profileStorage';
import {
  getWatchHistory,
  clearWatchHistory,
  getContinueWatching,
  getWatchStats,
} from '../utils/watchHistory';
import {
  FaClock,
  FaFilm,
  FaHeart,
  FaDownload,
  FaArrowRight,
  FaCalendarDays,
  FaCrown,
  FaXmark,
  FaPlay,
  FaUser,
  FaLock,
  FaBell,
  FaShieldHalved,
  FaSliders,
  FaTrashCan,
  FaCircleCheck,
  FaFire,
  FaRotateRight,
} from 'react-icons/fa6';

function formatPhoneNumber(num) {
  if (!num) return '+233 24 123 4567';
  const clean = num.replace(/\D/g, '');
  if (clean.length === 12 && clean.startsWith('233')) {
    return `+233 ${clean.slice(3, 5)} ${clean.slice(5, 8)} ${clean.slice(8)}`;
  }
  if (clean.length === 10 && clean.startsWith('0')) {
    return `+233 ${clean.slice(1, 3)} ${clean.slice(3, 6)} ${clean.slice(6)}`;
  }
  return num;
}

const ProfilePage = ({
  onNavigate = () => {},
  onVideoPlay = () => {},
  phoneNumber = '',
  isSubscribed = false,
  onSubscribeClick = () => {},
  onLogout = () => {},
  onNotify = () => {},
}) => {
  const { t } = useTranslation();
  const { favorites, isFavorite, toggleFavorite, favoriteCount } = useFavorites();

  // Active user session state
  const [session, setSession] = useState(() => loadAppSession());
  const activePhone = phoneNumber || session.msisdn || '+233 24 123 4567';
  const effectiveSubscribed = isSubscribed || session.isSubscribed;

  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [favoriteFilter, setFavoriteFilter] = useState('all');

  // Live subscription state fetched from backend API
  const [liveSubscription, setLiveSubscription] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // User profile loaded from storage
  const [profile, setProfile] = useState(() => getStoredProfile(activePhone));

  // Edit form state
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone || activePhone,
    language: profile.language || 'English',
  });

  // Streaming preferences toggles state
  const [preferences, setPreferences] = useState(() => getStoredPreferences());

  // Real watch history anime videos loaded from storage
  const [watchHistory, setWatchHistory] = useState(() => getWatchHistory());

  // Derive active subscription plan from live API or session
  const currentPlan = useMemo(() => {
    const candidateId =
      liveSubscription?.planId ||
      session?.subscription?.apiPlanId ||
      session?.subscription?.planKey;
    if (candidateId) {
      const matched = SUBSCRIPTION_PLANS.find(
        (p) => p.id === candidateId || p.planId === candidateId || p.offerCode === candidateId
      );
      if (matched) return matched;
    }
    return null;
  }, [liveSubscription, session]);

  const planName = useMemo(() => {
    if (currentPlan) return currentPlan.name;
    if (effectiveSubscribed) return 'Premium Monthly Pass';
    return 'Free Plan';
  }, [currentPlan, effectiveSubscribed]);

  const nextBillingDate = useMemo(() => {
    if (!effectiveSubscribed) return 'N/A';
    const rawExpiry = liveSubscription?.expiresAt || session?.subscription?.expiresAt;
    if (rawExpiry) {
      try {
        const d = new Date(rawExpiry);
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        }
      } catch {}
    }
    const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return nextMonth.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }, [effectiveSubscribed, liveSubscription, session]);

  const memberSinceDate = useMemo(() => {
    const rawSubscribed = liveSubscription?.subscribedAt || session?.subscription?.subscribedAt;
    if (rawSubscribed) {
      try {
        const d = new Date(rawSubscribed);
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
        }
      } catch {}
    }
    return 'January 2024';
  }, [liveSubscription, session]);

  // Watch statistics
  const watchStats = useMemo(() => getWatchStats(watchHistory), [watchHistory]);

  // Dynamic user data
  const userData = useMemo(
    () => ({
      name: profile.name,
      email: profile.email,
      phone: formatPhoneNumber(profile.phone || activePhone),
      memberSince: memberSinceDate,
      subscription: planName,
      subscriptionStatus:
        effectiveSubscribed || liveSubscription?.subscriptionStatus === 'active'
          ? 'Active'
          : 'Free Tier',
      nextBilling: nextBillingDate,
      autoRenewal: effectiveSubscribed,
      watchTime: watchStats.watchTime,
      contentWatched: watchStats.contentWatched,
      downloads: watchStats.downloads,
      favorites: favoriteCount,
    }),
    [
      profile,
      activePhone,
      memberSinceDate,
      planName,
      effectiveSubscribed,
      liveSubscription,
      nextBillingDate,
      watchStats,
      favoriteCount,
    ]
  );

  // Continue watching single card data derived from real watch history
  const continueWatchingItem = useMemo(() => {
    return getContinueWatching(watchHistory);
  }, [watchHistory]);

  // Filtered favorite anime items based on user's real favorited set
  const favoriteVideos = useMemo(() => {
    const allCatalogVideos = [...TRENDING_ANIME_VIDEOS, ...FEATURED_ANIME_VIDEOS];
    const favorited = allCatalogVideos.filter((v) => isFavorite(v.title || v.id));
    const list = favorited.length > 0 ? favorited : allCatalogVideos.slice(0, 4);

    if (favoriteFilter === 'all') return list;
    return list.filter((v) => (v.category || '').toLowerCase() === favoriteFilter.toLowerCase());
  }, [favorites, isFavorite, favoriteFilter]);

  // Dynamic Activity list
  const recentActivities = useMemo(() => {
    const list = [];
    if (watchHistory.length > 0) {
      list.push({
        id: 'act-1',
        action: 'Watched',
        target: watchHistory[0].title,
        time: watchHistory[0].date || 'Recently',
        icon: <FaPlay className="act-icon" />,
      });
    }
    if (favoriteVideos.length > 0) {
      list.push({
        id: 'act-2',
        action: 'Saved to Favorites',
        target: favoriteVideos[0].title,
        time: 'In your library',
        icon: <FaHeart className="act-icon" />,
      });
    }
    list.push({
      id: 'act-3',
      action: 'Unlocked Badge',
      target: 'Speed Demon (Completed 50 anime edits)',
      time: '3 days ago',
      icon: <FaFire className="act-icon" />,
    });
    list.push({
      id: 'act-4',
      action: 'Plan Status',
      target: effectiveSubscribed ? `${planName} Membership` : 'Free Account Active',
      time: 'Active now',
      icon: <FaCircleCheck className="act-icon" />,
    });
    return list;
  }, [watchHistory, favoriteVideos, effectiveSubscribed, planName]);

  // Synchronize live subscription and storage data
  const handleSyncData = useCallback(
    async (manual = false) => {
      if (manual) setIsSyncing(true);
      try {
        const refreshedSession = loadAppSession();
        setSession(refreshedSession);

        const token = localStorage.getItem('token');
        if (token) {
          const sub = await fetchSubscriptionStatus();
          if (sub) {
            setLiveSubscription(sub);
          }
        }

        setWatchHistory(getWatchHistory());
        const stored = getStoredProfile(activePhone);
        setProfile(stored);
        setPreferences(getStoredPreferences());

        if (manual) {
          onNotify('Profile and subscription data synchronized! 🔄', 'success');
        }
      } catch (err) {
        console.warn('Sync error:', err);
        if (manual) {
          onNotify('Status refreshed from session storage.', 'info');
        }
      } finally {
        if (manual) setIsSyncing(false);
      }
    },
    [activePhone, onNotify]
  );

  // Initial fetch on component mount and event listeners
  useEffect(() => {
    void handleSyncData(false);

    const onWatchUpdate = () => setWatchHistory(getWatchHistory());
    const onProfileUpdate = () => setProfile(getStoredProfile(activePhone));
    const onPrefsUpdate = () => setPreferences(getStoredPreferences());
    const onStorageChange = () => {
      setSession(loadAppSession());
      setWatchHistory(getWatchHistory());
      setProfile(getStoredProfile(activePhone));
    };

    window.addEventListener('watchHistoryUpdated', onWatchUpdate);
    window.addEventListener('profileUpdated', onProfileUpdate);
    window.addEventListener('preferencesUpdated', onPrefsUpdate);
    window.addEventListener('storage', onStorageChange);

    return () => {
      window.removeEventListener('watchHistoryUpdated', onWatchUpdate);
      window.removeEventListener('profileUpdated', onProfileUpdate);
      window.removeEventListener('preferencesUpdated', onPrefsUpdate);
      window.removeEventListener('storage', onStorageChange);
    };
  }, [handleSyncData, activePhone]);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleEditToggle = useCallback(() => {
    setIsEditing((prev) => !prev);
    if (!isEditing) {
      setFormData({
        name: profile.name,
        email: profile.email,
        phone: profile.phone || activePhone,
        language: profile.language || 'English',
      });
    }
  }, [isEditing, profile, activePhone]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = useCallback(
    (e) => {
      e?.preventDefault();
      const updated = {
        name: (formData.name || '').trim() || profile.name,
        email: (formData.email || '').trim() || profile.email,
        phone: (formData.phone || '').trim() || profile.phone,
        language: formData.language || profile.language || 'English',
      };
      saveStoredProfile(updated);
      setProfile(updated);
      setIsEditing(false);
      onNotify('Profile details updated successfully! 🎉', 'success');
    },
    [formData, profile, onNotify]
  );

  const handlePreferenceToggle = (key) => {
    const updated = { ...preferences, [key]: !preferences[key] };
    setPreferences(updated);
    saveStoredPreferences(updated);
    onNotify('Preference updated', 'info');
  };

  const handleClearHistory = useCallback(() => {
    clearWatchHistory();
    setWatchHistory([]);
    onNotify('Watch history cleared', 'info');
  }, [onNotify]);

  const handlePlayCard = useCallback(
    (video) => {
      onVideoPlay({
        id: video.id,
        title: video.title,
        videoUrl: video.videoUrl,
        category: video.category || 'Anime',
        thumbnail: video.thumbnail,
      });
    },
    [onVideoPlay]
  );

  return (
    <div className="ghsnapflix-profile-page">
      <div className="profile-page-container">
        {/* Navigation Breadcrumb */}
        <div className="profile-breadcrumbs">
          <button
            type="button"
            className="crumb-back-btn"
            onClick={() => onNavigate('home')}
            title="Return to Home Feed"
          >
            ← Back to Home
          </button>
          <span className="crumb-separator">/</span>
          <span className="crumb-current">My Account</span>
        </div>

        {/* =================================================================
            2. & 3. PROFILE HERO WITH ANIME CREATOR ARTWORK
            ================================================================= */}
        <section className="profile-hero-card">
          <div className="profile-hero-content">
            {/* Left: Avatar & Identity Details */}
            <div className="profile-identity-group">
              <div className="profile-avatar-wrapper">
                <div className="profile-avatar-circle">
                  <span className="avatar-initials">{(userData.name || 'A').charAt(0).toUpperCase()}</span>
                </div>
                <div className={`status-pill ${effectiveSubscribed ? 'is-active' : 'is-free'}`}>
                  <span className="status-indicator-dot" />
                  <span className="status-label">
                    {userData.subscriptionStatus}
                  </span>
                </div>
              </div>

              <div className="profile-details-stack">
                <div className="profile-name-row">
                  <h1 className="profile-user-name">{userData.name}</h1>
                  <span className="user-verified-badge" title="Verified Member">
                    ✓
                  </span>
                </div>
                <p className="profile-user-email">{userData.email}</p>

                <div className="profile-tags-row">
                  <span className="profile-tag-pill">
                    <FaCalendarDays className="tag-icon" />
                    Member since {userData.memberSince}
                  </span>
                  <span className="profile-tag-pill tier-pill">
                    <FaCrown className="tag-icon crown-icon" />
                    {userData.subscription}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Actions & Anime Artwork Integration */}
            <div className="profile-hero-right">
              <button
                type="button"
                className={`hero-edit-profile-btn ${isEditing ? 'is-cancelling' : ''}`}
                onClick={handleEditToggle}
                aria-label="Edit Profile Information"
              >
                {isEditing ? (
                  <>
                    <FaXmark className="btn-icon" /> Cancel
                  </>
                ) : (
                  <>
                    <span>Edit Profile</span>
                    <FaArrowRight className="btn-arrow" />
                  </>
                )}
              </button>

              {/* Anime Creator Illustration Artwork */}
              <div className="profile-artwork-canvas">
                <img
                  src="/images/profile_anime_creator_transparent.png"
                  alt="Anime Creator Artwork"
                  className="creator-artwork-image"
                  loading="lazy"
                />
                <div className="artwork-quote-badge">
                  <span className="quote-label">CREATOR HUB</span>
                  <span className="quote-text">Watch. Edit. Grow.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Inline Edit Form (expands when edit mode is toggled) */}
          {isEditing && (
            <form className="hero-inline-edit-form" onSubmit={handleSaveProfile}>
              <div className="form-heading">
                <h3>Quick Edit Profile</h3>
                <p>Update your personal information and contact details</p>
              </div>
              <div className="form-inputs-grid">
                <div className="form-field">
                  <label htmlFor="edit-name">Full Name</label>
                  <input
                    id="edit-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="edit-email">Email Address</label>
                  <input
                    id="edit-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="edit-phone">Phone Number (MTN Ghana)</label>
                  <input
                    id="edit-phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    placeholder="+233 24 123 4567"
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="edit-language">Language</label>
                  <select
                    id="edit-language"
                    name="language"
                    value={formData.language}
                    onChange={handleFormChange}
                  >
                    <option value="English">English (US / UK)</option>
                    <option value="Twi">Twi (Ghana)</option>
                    <option value="French">Français</option>
                  </select>
                </div>
              </div>
              <div className="form-actions-row">
                <button type="submit" className="save-changes-btn">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="cancel-edit-btn"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>

        {/* =================================================================
            4. USER STATS (4-COLUMN RESPONSIVE ROW)
            ================================================================= */}
        <section className="profile-stats-grid" aria-label="Account Statistics">
          {/* 1. Watch Time */}
          <div className="profile-stat-card">
            <div className="stat-card-header">
              <div className="stat-icon-bubble">
                <FaClock />
              </div>
              <span className="stat-trend-badge">↑ 23%</span>
            </div>
            <div className="stat-number-display">{userData.watchTime}</div>
            <div className="stat-label-text">WATCH TIME</div>
          </div>

          {/* 2. Videos Watched */}
          <div className="profile-stat-card">
            <div className="stat-card-header">
              <div className="stat-icon-bubble">
                <FaFilm />
              </div>
              <span className="stat-trend-badge">↑ 12%</span>
            </div>
            <div className="stat-number-display">{userData.contentWatched}</div>
            <div className="stat-label-text">VIDEOS WATCHED</div>
          </div>

          {/* 3. Favorites */}
          <div
            className="profile-stat-card clickable-stat"
            onClick={() => handleTabChange('favorites')}
            title="View Favorites"
          >
            <div className="stat-card-header">
              <div className="stat-icon-bubble heart-bubble">
                <FaHeart />
              </div>
              <span className="stat-trend-badge">↑ 5%</span>
            </div>
            <div className="stat-number-display">
              {favoriteCount > 0 ? favoriteCount : userData.favorites || 23}
            </div>
            <div className="stat-label-text">FAVORITES</div>
          </div>

          {/* 4. Downloads */}
          <div className="profile-stat-card">
            <div className="stat-card-header">
              <div className="stat-icon-bubble">
                <FaDownload />
              </div>
              <span className="stat-trend-badge">↑ 8%</span>
            </div>
            <div className="stat-number-display">{userData.downloads}</div>
            <div className="stat-label-text">DOWNLOADS</div>
          </div>
        </section>

        {/* =================================================================
            5. ACCOUNT NAVIGATION TABS
            ================================================================= */}
        <nav className="profile-tabs-navbar" aria-label="Profile Sections">
          <div className="tabs-scroll-track">
            <button
              type="button"
              className={`profile-nav-tab ${activeTab === 'overview' ? 'is-active' : ''}`}
              onClick={() => handleTabChange('overview')}
            >
              Overview
            </button>
            <button
              type="button"
              className={`profile-nav-tab ${activeTab === 'history' ? 'is-active' : ''}`}
              onClick={() => handleTabChange('history')}
            >
              Watch History
            </button>
            <button
              type="button"
              className={`profile-nav-tab ${activeTab === 'favorites' ? 'is-active' : ''}`}
              onClick={() => handleTabChange('favorites')}
            >
              Favorites ({favoriteCount > 0 ? favoriteCount : 4})
            </button>
            <button
              type="button"
              className={`profile-nav-tab ${activeTab === 'settings' ? 'is-active' : ''}`}
              onClick={() => handleTabChange('settings')}
            >
              Settings
            </button>
          </div>
        </nav>

        {/* =================================================================
            TAB CONTENT: 1. OVERVIEW TAB
            ================================================================= */}
        {activeTab === 'overview' && (
          <div className="tab-pane overview-pane">
            {/* 6. CURRENT SUBSCRIPTION CARD */}
            <section className="profile-card subscription-highlight-card">
              <div className="sub-card-top">
                <div className="sub-heading-meta">
                  <div className="sub-title-row">
                    <h2 className="sub-card-title">Current Subscription</h2>
                    <span
                      className={`subscription-status-chip ${
                        effectiveSubscribed ? 'is-active' : 'is-free'
                      }`}
                    >
                      <span className="chip-dot" />
                      {effectiveSubscribed ? 'Active' : 'Free Tier'}
                    </span>
                  </div>
                  <p className="sub-card-description">
                    {effectiveSubscribed
                      ? 'You are enjoying full HD streaming and unlimited access.'
                      : "You're currently on the Free Plan. Upgrade for unlimited streaming."}
                  </p>
                </div>

                <div className="sub-actions-cluster">
                  <button
                    type="button"
                    className={`sub-sync-btn ${isSyncing ? 'is-syncing' : ''}`}
                    onClick={() => handleSyncData(true)}
                    title="Refresh and sync data from server"
                  >
                    <FaRotateRight className="sync-spin-icon" />
                    <span>{isSyncing ? 'Syncing...' : 'Sync Status'}</span>
                  </button>
                  <button
                    type="button"
                    className="sub-manage-plan-btn"
                    onClick={() => {
                      if (effectiveSubscribed) {
                        onNavigate('subscription-management');
                      } else {
                        onNavigate('subscription');
                      }
                    }}
                    onClick={() => onNavigate('subscription')}
                  >
                    <span>{effectiveSubscribed ? 'Manage Plan' : 'Upgrade to Premium'}</span>
                    <span>{effectiveSubscribed ? 'View Subscription Pass' : 'Subscribe'}</span>
                    <FaArrowRight className="btn-arrow" />
                  </button>
                </div>
              </div>

              <div className="sub-details-grid">
                <div className="sub-info-col">
                  <span className="col-label">PLAN</span>
                  <span className="col-value">
                    {userData.subscription}
                  </span>
                </div>
                <div className="sub-info-col">
                  <span className="col-label">NEXT BILLING</span>
                  <span className="col-value">
                    {effectiveSubscribed ? userData.nextBilling : 'N/A'}
                  </span>
                </div>
                <div className="sub-info-col">
                  <span className="col-label">AUTO-RENEWAL</span>
                  <span className="col-value">
                    <span
                      className={`renewal-indicator ${
                        effectiveSubscribed ? 'enabled' : 'disabled'
                      }`}
                    >
                      {effectiveSubscribed ? 'Enabled' : 'Disabled'}
                    </span>
                  </span>
                </div>
              </div>
            </section>

            {/* 7. PREMIUM MEMBERSHIP CINEMATIC CARD */}
            <section className="profile-card premium-membership-banner">
              <div className="membership-banner-text">
                <div className="premium-pill-tag">
                  <FaCrown className="crown-icon" /> GHSNAPFLIX VIP
                </div>
                <h3 className="membership-banner-title">
                  {effectiveSubscribed
                    ? "You're Part of the Premium Community"
                    : 'Unlock Premium Membership'}
                </h3>
                <p className="membership-banner-desc">
                  {effectiveSubscribed
                    ? 'Enjoy ad-free anime content, exclusive 4K edits, early access and more.'
                    : 'Get uninterrupted ad-free viewing, exclusive anime trailers, 1080p full streams and creator perks.'}
                </p>
                <div className="membership-cta-wrapper">
                  <button
                    type="button"
                    className="membership-cta-btn"
                    onClick={() => {
                      if (effectiveSubscribed) {
                        onNavigate('videos');
                      } else {
                        onSubscribeClick();
                      }
                    }}
                  >
                    <span>{effectiveSubscribed ? 'Explore Premium →' : 'Upgrade Now →'}</span>
                  </button>
                </div>
              </div>

              <div className="membership-banner-artwork">
                <img
                  src="/images/rewards_naruto_banner.png"
                  alt="Anime VIP Community"
                  className="membership-art-image"
                />
              </div>
            </section>

            {/* 9. CONTINUE WATCHING CARD */}
            {continueWatchingItem && (
              <section className="profile-card continue-watching-section">
                <div className="section-bar-header">
                  <div className="bar-header-titles">
                    <h2 className="bar-title">Continue Watching</h2>
                    <p className="bar-subtitle">Resume your favorite anime scene right away</p>
                  </div>
                  <button
                    type="button"
                    className="bar-action-link"
                    onClick={() => handleTabChange('history')}
                  >
                    View All →
                  </button>
                </div>

                <div className="continue-card-body">
                  <div className="continue-media-box" onClick={() => handlePlayCard(continueWatchingItem)}>
                    <img
                      src={continueWatchingItem.thumbnail}
                      alt={continueWatchingItem.title}
                      className="continue-thumb"
                    />
                    <div className="play-hover-badge">
                      <FaPlay />
                    </div>
                    <div className="continue-progress-track">
                      <div
                        className="continue-progress-bar"
                        style={{ width: `${continueWatchingItem.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="continue-meta-box">
                    <span className="continue-category">{continueWatchingItem.category}</span>
                    <h3 className="continue-title">{continueWatchingItem.title}</h3>
                    <p className="continue-status">
                      {continueWatchingItem.progressPercent}% complete • {continueWatchingItem.timeLeft}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="continue-resume-btn"
                    onClick={() => handlePlayCard(continueWatchingItem)}
                  >
                    <span>Resume</span>
                    <FaPlay className="play-icon-small" />
                  </button>
                </div>
              </section>
            )}

            {/* 8. RECENTLY WATCHED SECTION */}
            <section className="profile-card recently-watched-section">
              <div className="section-bar-header">
                <div className="bar-header-titles">
                  <h2 className="bar-title">Recently Watched</h2>
                  <p className="bar-subtitle">Pick up where you left off</p>
                </div>
                <button
                  type="button"
                  className="bar-action-link"
                  onClick={() => handleTabChange('history')}
                >
                  View All →
                </button>
              </div>

              <div className="video-cards-grid">
                {watchHistory.slice(0, 4).map((item) => (
                  <article
                    key={item.id}
                    className="profile-video-card"
                    onClick={() => handlePlayCard(item)}
                  >
                    <div className="video-thumb-container">
                      <img src={item.thumbnail} alt={item.title} className="video-thumb-img" />
                      <div className="video-play-overlay">
                        <div className="play-btn-circle">
                          <FaPlay />
                        </div>
                      </div>
                      <span className="video-duration-tag">{item.duration}</span>
                    </div>
                    <div className="video-info-container">
                      <span className="video-category-tag">{item.category}</span>
                      <h3 className="video-title-text" title={item.title}>
                        {item.title}
                      </h3>
                      <div className="video-meta-row">
                        <span>Watched {item.date}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* 10. FAVORITES PREVIEW */}
            <section className="profile-card favorites-preview-section">
              <div className="section-bar-header">
                <div className="bar-header-titles">
                  <h2 className="bar-title">Your Favorites</h2>
                  <p className="bar-subtitle">Your saved anime edits in one place</p>
                </div>
                <button
                  type="button"
                  className="bar-action-link"
                  onClick={() => handleTabChange('favorites')}
                >
                  View All →
                </button>
              </div>

              {favoriteVideos.length > 0 ? (
                <div className="video-cards-grid">
                  {favoriteVideos.slice(0, 4).map((item) => (
                    <article
                      key={item.id}
                      className="profile-video-card"
                      onClick={() => handlePlayCard(item)}
                    >
                      <div className="video-thumb-container">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="video-thumb-img"
                        />
                        <button
                          type="button"
                          className={`card-heart-toggle ${
                            isFavorite(item.title || item.id) ? 'is-fav' : ''
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(item);
                          }}
                          title="Toggle Favorite"
                        >
                          <FaHeart />
                        </button>
                        <div className="video-play-overlay">
                          <div className="play-btn-circle">
                            <FaPlay />
                          </div>
                        </div>
                        <span className="video-duration-tag">{item.duration}</span>
                      </div>
                      <div className="video-info-container">
                        <span className="video-category-tag">{item.category || 'Anime'}</span>
                        <h3 className="video-title-text" title={item.title}>
                          {item.title}
                        </h3>
                        <div className="video-meta-row">
                          <span>{item.views || '1.2M'} views</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="empty-favorites-box">
                  <div className="empty-heart-bubble">
                    <FaHeart />
                  </div>
                  <h3>No Favorites Yet</h3>
                  <p>Start saving your favorite anime edits to access them quickly here.</p>
                  <button
                    type="button"
                    className="empty-explore-btn"
                    onClick={() => onNavigate('videos')}
                  >
                    Explore Videos →
                  </button>
                </div>
              )}
            </section>

            {/* 11. ACCOUNT ACTIVITY & 12. SETTINGS PREVIEW ROW */}
            <div className="profile-split-sections-row">
              {/* 11. Activity Section */}
              <section className="profile-card activity-card-half">
                <div className="section-bar-header">
                  <div className="bar-header-titles">
                    <h2 className="bar-title">Your Activity</h2>
                    <p className="bar-subtitle">Recent platform interactions</p>
                  </div>
                </div>

                <div className="activity-timeline-list">
                  {recentActivities.map((act) => (
                    <div key={act.id} className="activity-timeline-item">
                      <div className="act-icon-wrapper">{act.icon}</div>
                      <div className="act-content">
                        <div className="act-main-line">
                          <span className="act-action-name">{act.action}</span>
                          <span className="act-target-name">{act.target}</span>
                        </div>
                        <span className="act-timestamp">{act.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 12. Settings Quick Preview */}
              <section className="profile-card settings-card-half">
                <div className="section-bar-header">
                  <div className="bar-header-titles">
                    <h2 className="bar-title">Account Settings</h2>
                    <p className="bar-subtitle">Manage your account preferences</p>
                  </div>
                </div>

                <div className="settings-rows-list">
                  <button
                    type="button"
                    className="settings-row-btn"
                    onClick={() => handleTabChange('settings')}
                  >
                    <div className="settings-row-icon">
                      <FaUser />
                    </div>
                    <div className="settings-row-text">
                      <span className="row-title">Profile Information</span>
                      <span className="row-desc">Name, email, and phone number</span>
                    </div>
                    <FaArrowRight className="row-arrow" />
                  </button>

                  <button
                    type="button"
                    className="settings-row-btn"
                    onClick={() => handleTabChange('settings')}
                  >
                    <div className="settings-row-icon">
                      <FaLock />
                    </div>
                    <div className="settings-row-text">
                      <span className="row-title">Password & Security</span>
                      <span className="row-desc">Account authentication and passcodes</span>
                    </div>
                    <FaArrowRight className="row-arrow" />
                  </button>

                  <button
                    type="button"
                    className="settings-row-btn"
                    onClick={() => handleTabChange('settings')}
                  >
                    <div className="settings-row-icon">
                      <FaBell />
                    </div>
                    <div className="settings-row-text">
                      <span className="row-title">Notifications</span>
                      <span className="row-desc">New anime releases & creator alerts</span>
                    </div>
                    <FaArrowRight className="row-arrow" />
                  </button>

                  <button
                    type="button"
                    className="settings-row-btn"
                    onClick={() => handleTabChange('settings')}
                  >
                    <div className="settings-row-icon">
                      <FaShieldHalved />
                    </div>
                    <div className="settings-row-text">
                      <span className="row-title">Privacy & Data</span>
                      <span className="row-desc">Stream data, storage and consent</span>
                    </div>
                    <FaArrowRight className="row-arrow" />
                  </button>

                  <button
                    type="button"
                    className="settings-row-btn"
                    onClick={() => handleTabChange('settings')}
                  >
                    <div className="settings-row-icon">
                      <FaSliders />
                    </div>
                    <div className="settings-row-text">
                      <span className="row-title">Playback Preferences</span>
                      <span className="row-desc">Autoplay, video resolution and sound</span>
                    </div>
                    <FaArrowRight className="row-arrow" />
                  </button>
                </div>
              </section>
            </div>
          </div>
        )}

        {/* =================================================================
            TAB CONTENT: 2. WATCH HISTORY TAB
            ================================================================= */}
        {activeTab === 'history' && (
          <div className="tab-pane history-pane">
            <section className="profile-card">
              <div className="section-bar-header">
                <div className="bar-header-titles">
                  <h2 className="bar-title">Your Watch History</h2>
                  <p className="bar-subtitle">
                    Chronological history of your streamed anime edits
                  </p>
                </div>
                {watchHistory.length > 0 && (
                  <button
                    type="button"
                    className="clear-history-action-btn"
                    onClick={handleClearHistory}
                  >
                    <FaTrashCan className="btn-icon" />
                    Clear History
                  </button>
                )}
              </div>

              {watchHistory.length > 0 ? (
                <div className="history-items-list">
                  {watchHistory.map((item) => (
                    <div
                      key={item.id}
                      className="history-item-row"
                      onClick={() => handlePlayCard(item)}
                    >
                      <div className="history-thumb-box">
                        <img src={item.thumbnail} alt={item.title} className="history-thumb-img" />
                        <div className="history-hover-play">
                          <FaPlay />
                        </div>
                        <span className="history-duration">{item.duration}</span>
                      </div>

                      <div className="history-info-box">
                        <span className="history-category">{item.category}</span>
                        <h3 className="history-item-title">{item.title}</h3>
                        <div className="history-meta-inline">
                          <span>Streamed {item.date}</span>
                          <span className="meta-bullet">•</span>
                          <span>HD 1080p</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="history-replay-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayCard(item);
                        }}
                      >
                        <FaPlay className="play-icon-tiny" />
                        <span>Watch Again</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-history-box">
                  <FaFilm className="empty-icon" />
                  <h3>No Watch History</h3>
                  <p>You have not watched any videos yet. Start exploring the anime catalog!</p>
                  <button
                    type="button"
                    className="empty-explore-btn"
                    onClick={() => onNavigate('videos')}
                  >
                    Discover Anime Videos →
                  </button>
                </div>
              )}
            </section>
          </div>
        )}

        {/* =================================================================
            TAB CONTENT: 3. FAVORITES TAB
            ================================================================= */}
        {activeTab === 'favorites' && (
          <div className="tab-pane favorites-pane">
            <section className="profile-card">
              <div className="section-bar-header">
                <div className="bar-header-titles">
                  <h2 className="bar-title">Your Saved Favorites</h2>
                  <p className="bar-subtitle">All bookmarked videos in your personal vault</p>
                </div>
                <div className="favorites-category-filters">
                  {['all', 'action', 'adventure', 'fighting'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`filter-pill-btn ${favoriteFilter === cat ? 'is-active' : ''}`}
                      onClick={() => setFavoriteFilter(cat)}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {favoriteVideos.length > 0 ? (
                <div className="video-cards-grid full-grid">
                  {favoriteVideos.map((item) => (
                    <article
                      key={item.id}
                      className="profile-video-card"
                      onClick={() => handlePlayCard(item)}
                    >
                      <div className="video-thumb-container">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="video-thumb-img"
                        />
                        <button
                          type="button"
                          className={`card-heart-toggle ${
                            isFavorite(item.title || item.id) ? 'is-fav' : ''
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(item);
                          }}
                          title="Toggle Favorite"
                        >
                          <FaHeart />
                        </button>
                        <div className="video-play-overlay">
                          <div className="play-btn-circle">
                            <FaPlay />
                          </div>
                        </div>
                        <span className="video-duration-tag">{item.duration}</span>
                      </div>
                      <div className="video-info-container">
                        <span className="video-category-tag">{item.category || 'Anime'}</span>
                        <h3 className="video-title-text" title={item.title}>
                          {item.title}
                        </h3>
                        <div className="video-meta-row">
                          <span>{item.views || '1.2M'} views</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="empty-favorites-box">
                  <div className="empty-heart-bubble">
                    <FaHeart />
                  </div>
                  <h3>No Favorites In This Category</h3>
                  <p>Browse our curated collections and save titles to your favorites!</p>
                  <button
                    type="button"
                    className="empty-explore-btn"
                    onClick={() => onNavigate('videos')}
                  >
                    Explore Anime Videos →
                  </button>
                </div>
              )}
            </section>
          </div>
        )}

        {/* =================================================================
            TAB CONTENT: 4. SETTINGS TAB
            ================================================================= */}
        {activeTab === 'settings' && (
          <div className="tab-pane settings-pane">
            {/* Profile Info Settings */}
            <section className="profile-card">
              <div className="section-bar-header">
                <div className="bar-header-titles">
                  <h2 className="bar-title">Personal Information</h2>
                  <p className="bar-subtitle">Update your account contact information</p>
                </div>
              </div>

              <form className="settings-form-layout" onSubmit={handleSaveProfile}>
                <div className="form-inputs-grid">
                  <div className="form-field">
                    <label htmlFor="settings-name">Full Name</label>
                    <input
                      id="settings-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="settings-email">Email Address</label>
                    <input
                      id="settings-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      placeholder="Your email"
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="settings-phone">Phone Number (MTN Ghana)</label>
                    <input
                      id="settings-phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      placeholder="+233 24 123 4567"
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="settings-language">Language</label>
                    <select
                      id="settings-language"
                      name="language"
                      value={formData.language}
                      onChange={handleFormChange}
                    >
                      <option value="English">English (US / UK)</option>
                      <option value="Twi">Twi (Ghana)</option>
                      <option value="French">Français</option>
                    </select>
                  </div>
                </div>

                <div className="form-actions-row">
                  <button type="submit" className="save-changes-btn">
                    Save Profile Changes
                  </button>
                </div>
              </form>
            </section>

            {/* Playback & Streaming Preferences */}
            <section className="profile-card">
              <div className="section-bar-header">
                <div className="bar-header-titles">
                  <h2 className="bar-title">Streaming & Playback Preferences</h2>
                  <p className="bar-subtitle">Customize how video content is rendered and played</p>
                </div>
              </div>

              <div className="preferences-toggle-list">
                <div className="preference-toggle-item">
                  <div className="toggle-info">
                    <h4>Autoplay Next Episode / Edit</h4>
                    <p>Automatically cue and play consecutive anime videos in a playlist</p>
                  </div>
                  <label className="ios-switch">
                    <input
                      type="checkbox"
                      checked={preferences.autoplay}
                      onChange={() => handlePreferenceToggle('autoplay')}
                    />
                    <span className="slider" />
                  </label>
                </div>

                <div className="preference-toggle-item">
                  <div className="toggle-info">
                    <h4>Always Stream in HD (1080p)</h4>
                    <p>Prioritize maximum visual quality on supported high-speed connections</p>
                  </div>
                  <label className="ios-switch">
                    <input
                      type="checkbox"
                      checked={preferences.hdStreaming}
                      onChange={() => handlePreferenceToggle('hdStreaming')}
                    />
                    <span className="slider" />
                  </label>
                </div>

                <div className="preference-toggle-item">
                  <div className="toggle-info">
                    <h4>Email & SMS Notifications</h4>
                    <p>Receive updates about newly uploaded episodes and community drops</p>
                  </div>
                  <label className="ios-switch">
                    <input
                      type="checkbox"
                      checked={preferences.emailNotifications}
                      onChange={() => handlePreferenceToggle('emailNotifications')}
                    />
                    <span className="slider" />
                  </label>
                </div>
              </div>
            </section>

            {/* Subscription & Billing Status */}
            <section className="profile-card">
              <div className="section-bar-header">
                <div className="bar-header-titles">
                  <h2 className="bar-title">Subscription & Billing Status</h2>
                  <p className="bar-subtitle">Real-time MTN network subscription verification</p>
                </div>
                <button
                  type="button"
                  className={`sub-sync-btn ${isSyncing ? 'is-syncing' : ''}`}
                  onClick={() => handleSyncData(true)}
                  title="Verify subscription with MTN server"
                >
                  <FaRotateRight className="sync-spin-icon" />
                  <span>{isSyncing ? 'Checking Server...' : 'Check Live Status'}</span>
                </button>
              </div>

              <div className="sub-details-grid">
                <div className="sub-info-col">
                  <span className="col-label">CURRENT PLAN</span>
                  <span className="col-value">{effectiveSubscribed ? userData.subscription : 'Free Plan'}</span>
                </div>
                <div className="sub-info-col">
                  <span className="col-label">STATUS</span>
                  <span className="col-value">
                    <span className={`renewal-indicator ${effectiveSubscribed ? 'enabled' : 'disabled'}`}>
                      {userData.subscriptionStatus}
                    </span>
                  </span>
                </div>
                <div className="sub-info-col">
                  <span className="col-label">NEXT BILLING / EXPIRY</span>
                  <span className="col-value">{userData.nextBilling}</span>
                </div>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="save-changes-btn"
                  onClick={() => {
                    if (effectiveSubscribed) {
                      onNavigate('subscription-management');
                    } else {
                      onNavigate('subscription');
                    }
                  }}
                  onClick={() => onNavigate('subscription')}
                >
                  {effectiveSubscribed ? 'Manage Subscription Pass' : 'Upgrade to Premium Pass'}
                  {effectiveSubscribed ? 'View Subscription Pass' : 'Subscribe'}
                </button>
                {effectiveSubscribed && (
                  <button
                    type="button"
                    className="cancel-edit-btn"
                    onClick={() => onNavigate('unsubscribe')}
                  >
                    Unsubscribe / Cancel Pass
                  </button>
                )}
              </div>
            </section>

            {/* Account Security & Sign Out */}
            <section className="profile-card danger-zone-card">
              <div className="section-bar-header">
                <div className="bar-header-titles">
                  <h2 className="bar-title">Account Security & Session</h2>
                  <p className="bar-subtitle">Manage your active session and sign out</p>
                </div>
              </div>

              <div className="danger-zone-actions">
                <div className="danger-action-info">
                  <h4>Log Out of GHSnapflix</h4>
                  <p>Sign out of this browser. Your favorites and watch history will remain saved.</p>
                </div>
                <button
                  type="button"
                  className="sign-out-btn"
                  onClick={onLogout}
                >
                  Sign Out
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
