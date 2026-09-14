import React from 'react';
import './AnimeFooter.scss';
import {
  FaCompass,
  FaShieldHalved,
  FaHeadset,
  FaFileContract,
  FaArrowRotateLeft,
  FaStar,
  FaBolt,
  FaLock,
  FaTv,
  FaArrowRight,
  FaGear
} from 'react-icons/fa6';

export default function AnimeFooter({ onNavigate, onOpenLegalModal, onOpenDemoAdmin }) {
  return (
    <footer className="anime-footer">
      {/* Top Ambient Glow Line */}
      <div className="footer-glow-line" aria-hidden="true" />

      {/* Feature Highlights Strip */}
      <div className="footer-highlights-bar">
        <div className="highlights-inner">
          <div className="highlight-item">
            <div className="highlight-icon">
              <FaTv />
            </div>
            <div className="highlight-text">
              <strong>Ultra HD Streaming</strong>
              <span>Zero-buffer anime playback</span>
            </div>
          </div>

          <div className="highlight-item">
            <div className="highlight-icon highlight-gold">
              <FaBolt />
            </div>
            <div className="highlight-text">
              <strong>1-Day All-Access Pass</strong>
              <span>1 GHS for 24-hour unlimited streaming</span>
            </div>
          </div>

          <div className="highlight-item">
            <div className="highlight-icon">
              <FaLock />
            </div>
            <div className="highlight-text">
              <strong>MTN Mobile Billing</strong>
              <span>Instant 1-click carrier activation</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-inner">
        <div className="footer-top">
          {/* Brand & Mission Column */}
          <div className="footer-brand">
            <div className="brand-header">
              <div className="brand-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div className="brand-title">
                GHSNAPFLIX
                <span>WATCH • STREAM • EXPLORE</span>
              </div>
            </div>

            <p className="brand-manifesto">
              Ghana's premier anime streaming network. Discover legendary series, epic battles, and vibrant stories — all in stunning high definition.
            </p>

            {/* Live Service Status */}
            <div className="service-status-badge">
              <span className="pulse-dot" />
              <span>Streaming Servers Online • 24/7 Access</span>
            </div>

            {/* Social Links */}
            <div className="social-links">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="social-btn"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="social-btn"
                aria-label="X"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="social-btn"
                aria-label="Facebook"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Rows (Explore in a row, Support & Legal in next row) */}
          <div className="footer-nav-rows">
            {/* Row 1: Explore */}
            <div className="footer-nav-row">
              <div className="nav-row-header">
                <span className="nav-row-tag">
                  <FaCompass className="tag-icon" />
                  EXPLORE
                </span>
              </div>
              <div className="nav-row-pills">
                <button
                  type="button"
                  className="nav-pill"
                  onClick={() => onNavigate('home')}
                >
                  <span>Home</span>
                </button>
                <button
                  type="button"
                  className="nav-pill pill-highlight"
                  onClick={() => onNavigate('videos')}
                >
                  <span>Videos</span>
                  <span className="pill-badge">HOT</span>
                </button>
                <button
                  type="button"
                  className="nav-pill"
                  onClick={() => onNavigate('favorites')}
                >
                  <span>Favorites</span>
                </button>

              </div>
            </div>

            {/* Row 2: Support & Legal */}
            <div className="footer-nav-row">
              <div className="nav-row-header">
                <span className="nav-row-tag">
                  <FaShieldHalved className="tag-icon" />
                  SUPPORT &amp; LEGAL
                </span>
              </div>
              <div className="nav-row-pills">
                <button
                  type="button"
                  className="nav-pill"
                  onClick={() => onOpenLegalModal && onOpenLegalModal('help')}
                >
                  <FaHeadset className="pill-icon" />
                  <span>Help Center</span>
                </button>
                <button
                  type="button"
                  className="nav-pill"
                  onClick={() => onOpenLegalModal && onOpenLegalModal('terms')}
                >
                  <FaFileContract className="pill-icon" />
                  <span>Terms &amp; Conditions</span>
                </button>
                <button
                  type="button"
                  className="nav-pill"
                  onClick={() => onOpenLegalModal && onOpenLegalModal('privacy')}
                >
                  <FaShieldHalved className="pill-icon" />
                  <span>Privacy Policy</span>
                </button>
                <button
                  type="button"
                  className="nav-pill"
                  onClick={() => onOpenLegalModal && onOpenLegalModal('subscription')}
                >
                  <FaArrowRotateLeft className="pill-icon" />
                  <span>Subscription Policy</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Calligraphy & Fast-Pass Card */}
          <div className="footer-calligraphy-card">
            <div className="calligraphy-backdrop-glow" />
            <div className="script-quote">
              Anime
              <br />
              Connects
              <br />
              Us All
            </div>
            <div className="japanese-motto">アニメが私たちを繋ぐ</div>
            <button
              type="button"
              className="footer-fast-pass-btn"
              onClick={() => onNavigate('videos')}
            >
              <span>Explore Catalog</span>
              <FaArrowRight />
            </button>
          </div>
        </div>

        {/* Bottom Copyright & Compliance Bar */}
        <div className="footer-bottom">
          <div className="copyright-info">
            <span>
              © 2026 GHSNAPFLIX.buzz • All rights reserved.
            </span>
            <span className="partner-note">MTN Mobile Billing Verified Partner</span>
            <button
              type="button"
              className="footer-demo-admin-pill"
              onClick={() => onOpenDemoAdmin ? onOpenDemoAdmin() : onNavigate('admin')}
              title="Open Demo Admin Portal"
            >
              <FaGear className="gear-icon" />
              <span>Demo Admin</span>
            </button>
          </div>
          <div className="community-tag">
            <span>Made with <span className="heart-span">❤️</span> for Anime Fans in Ghana</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
