import React, { useState, useEffect } from 'react';
import './DemoAdminModal.scss';
import {
  FaGear,
  FaXmark,
  FaCheck,
  FaBolt,
  FaTv,
  FaTrashCan,
  FaCirclePlay,
  FaUserCheck,
  FaUserXmark,
  FaClockRotateLeft,
} from 'react-icons/fa6';
import {
  isDemoAdminEnabled,
  setDemoAdminEnabled,
  setDemoSubscriptionState,
  loadAppSession,
  clearAllSessionData,
} from '../../utils/sessionStorage';

export default function DemoAdminModal({
  isOpen,
  onClose,
  onSessionUpdated,
  onPlayTestVideo,
  onNavigate,
}) {
  const [session, setSession] = useState(() => loadAppSession());
  const [demoEnabled, setDemoEnabled] = useState(() => isDemoAdminEnabled());
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSession(loadAppSession());
      setDemoEnabled(isDemoAdminEnabled());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2400);
  };

  const handleToggleDemoMode = (e) => {
    const nextVal = e.target.checked;
    setDemoAdminEnabled(nextVal);
    setDemoEnabled(nextVal);
    if (!nextVal) {
      setDemoSubscriptionState('guest');
    } else {
      setDemoSubscriptionState('active');
    }
    const updated = loadAppSession();
    setSession(updated);
    if (onSessionUpdated) onSessionUpdated(updated);
    showToast(nextVal ? 'Demo Admin Activated ⚡' : 'Demo Admin Disabled');
  };

  const handleSetState = (state) => {
    setDemoSubscriptionState(state);
    setDemoEnabled(true);
    const updated = loadAppSession();
    setSession(updated);
    if (onSessionUpdated) onSessionUpdated(updated);
    if (state === 'active') {
      showToast('1-Day VIP Pass Activated! All videos unlocked.');
    } else if (state === 'expired') {
      showToast('Simulating Expired Pass (Paywall active).');
    } else {
      showToast('Switched to Guest Mode.');
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Reset all localStorage session data and restart fresh?')) {
      clearAllSessionData();
      setDemoSubscriptionState('guest');
      const updated = loadAppSession();
      setSession(updated);
      if (onSessionUpdated) onSessionUpdated(updated);
      showToast('Session & Storage Reset Completed');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  return (
    <div className="demo-admin-backdrop" onClick={onClose}>
      <div className="demo-admin-card" onClick={(e) => e.stopPropagation()}>
        {/* Glow Ambient */}
        <div className="admin-glow-ambient" />

        {/* Header */}
        <div className="admin-header">
          <div className="header-badge-row">
            <div className="admin-badge-icon">
              <FaGear />
            </div>
            <div>
              <div className="admin-tagline">GHSNAPFLIX OPERATIONS</div>
              <h2 className="admin-title">Demo Admin Portal</h2>
            </div>
          </div>
          <button
            type="button"
            className="admin-close-btn"
            onClick={onClose}
            aria-label="Close Admin Modal"
          >
            <FaXmark />
          </button>
        </div>

        {toastMessage && (
          <div className="admin-toast-banner">
            <FaBolt />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="admin-body">
          {/* Main Master Switch */}
          <div className="admin-master-toggle-card">
            <div className="toggle-info">
              <span className="toggle-title">Demo Admin Mode</span>
              <span className="toggle-desc">
                Enables instant test passes, billing bypass, and video unlocking without MTN network airtime.
              </span>
            </div>
            <label className="switch-toggle" aria-label="Toggle Demo Admin Mode">
              <input
                type="checkbox"
                checked={demoEnabled}
                onChange={handleToggleDemoMode}
              />
              <span className="slider-round" />
            </label>
          </div>

          {/* Current Status Overview */}
          <div className="admin-status-grid">
            <div className="status-item">
              <span className="item-label">Subscription Status</span>
              <span
                className={`status-pill ${
                  session.isSubscribed
                    ? 'active'
                    : session.accessExpired
                    ? 'expired'
                    : 'guest'
                }`}
              >
                {session.isSubscribed ? (
                  <>
                    <FaCheck /> Active Pass
                  </>
                ) : session.accessExpired ? (
                  <>
                    <FaClockRotateLeft /> Expired
                  </>
                ) : (
                  'Guest / Unsubscribed'
                )}
              </span>
            </div>

            <div className="status-item">
              <span className="item-label">Simulated MSISDN</span>
              <span className="item-value">{session.msisdn || '233241234567'} (MTN)</span>
            </div>

            <div className="status-item">
              <span className="item-label">Active Plan</span>
              <span className="item-value">1-Day Access Pass (1 GHS)</span>
            </div>

            <div className="status-item">
              <span className="item-label">Streaming Auth</span>
              <span className={`status-pill ${session.isSubscribed ? 'active' : 'guest'}`}>
                {session.isSubscribed ? 'UNRESTRICTED' : 'PAYWALL LOCKED'}
              </span>
            </div>
          </div>

          {/* 1-Click Simulation Buttons */}
          <div className="admin-section-block">
            <div className="section-heading">⚡ Quick Subscription State Simulation</div>
            <div className="simulation-buttons-grid">
              <button
                type="button"
                className={`sim-btn sim-btn-active ${session.isSubscribed ? 'is-current' : ''}`}
                onClick={() => handleSetState('active')}
              >
                <FaUserCheck className="btn-icon" />
                <div className="btn-text">
                  <strong>Activate 1-Day Pass</strong>
                  <span>Unlock all videos & subscriber UI</span>
                </div>
              </button>

              <button
                type="button"
                className={`sim-btn sim-btn-expired ${session.accessExpired ? 'is-current' : ''}`}
                onClick={() => handleSetState('expired')}
              >
                <FaClockRotateLeft className="btn-icon" />
                <div className="btn-text">
                  <strong>Simulate Expired Pass</strong>
                  <span>Test expiration alerts & renewal prompt</span>
                </div>
              </button>

              <button
                type="button"
                className={`sim-btn sim-btn-guest ${
                  !session.isSubscribed && !session.accessExpired ? 'is-current' : ''
                }`}
                onClick={() => handleSetState('guest')}
              >
                <FaUserXmark className="btn-icon" />
                <div className="btn-text">
                  <strong>Reset to Guest</strong>
                  <span>Test fresh visitor paywall experience</span>
                </div>
              </button>
            </div>
          </div>

          {/* Video Player Quick Tester */}
          <div className="admin-section-block">
            <div className="section-heading">🎬 Quick Video Playback Test</div>
            <div className="quick-actions-row">
              <button
                type="button"
                className="action-pill-btn"
                onClick={() => {
                  if (onPlayTestVideo) {
                    onPlayTestVideo({
                      id: 'yt-1',
                      title: 'Demon Slayer - Official Anime Opening',
                      duration: '03:15',
                      views: '4.2M views',
                      thumbnail: '/thumbnails/demon_slayer.jpg',
                      videoType: 'youtube',
                      videoUrl: 'https://www.youtube.com/embed/pmanD_s7G3U',
                    });
                    onClose();
                  }
                }}
              >
                <FaCirclePlay />
                <span>Demon Slayer AMV (YouTube)</span>
              </button>

              <button
                type="button"
                className="action-pill-btn"
                onClick={() => {
                  if (onPlayTestVideo) {
                    onPlayTestVideo({
                      id: 'anime-2',
                      title: 'Jujutsu Kaisen Best Scene',
                      duration: '02:08',
                      views: '2.8M views',
                      thumbnail: '/thumbnails/jjk.jpg',
                      videoType: 'local',
                      videoUrl: 'https://snapflix-mp4.s3.ap-southeast-2.amazonaws.com/Anime_mp4/144%20-%20Jujutsu%20Kaisen%20Best%20Scene.mp4',
                    });
                    onClose();
                  }
                }}
              >
                <FaTv />
                <span>Jujutsu Kaisen (Local Player)</span>
              </button>
            </div>
          </div>

          {/* Navigation Shortcuts */}
          <div className="admin-section-block">
            <div className="section-heading">🧭 Quick Viewport Navigation</div>
            <div className="nav-shortcuts-wrap">
              <button
                type="button"
                className="nav-chip"
                onClick={() => {
                  onNavigate('home');
                  onClose();
                }}
              >
                Home
              </button>
              <button
                type="button"
                className="nav-chip"
                onClick={() => {
                  onNavigate('videos');
                  onClose();
                }}
              >
                Videos
              </button>
              <button
                type="button"
                className="nav-chip"
                onClick={() => {
                  onNavigate('favorites');
                  onClose();
                }}
              >
                Favorites
              </button>
              <button
                type="button"
                className="nav-chip"
                onClick={() => {
                  onNavigate('subscription');
                  onClose();
                }}
              >
                Subscription Pass
              </button>
              <button
                type="button"
                className="nav-chip"
                onClick={() => {
                  onNavigate('help');
                  onClose();
                }}
              >
                Legal / Help
              </button>
            </div>
          </div>

          {/* Reset / Cache Tool */}
          <div className="admin-danger-row">
            <button
              type="button"
              className="danger-reset-btn"
              onClick={handleClearAll}
            >
              <FaTrashCan />
              <span>Clear All Cache &amp; Reset Storage</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

