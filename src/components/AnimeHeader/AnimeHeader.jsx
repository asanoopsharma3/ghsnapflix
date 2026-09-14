import React, { useState } from 'react';
import './AnimeHeader.scss';
import { FaCheck } from 'react-icons/fa6';

export default function AnimeHeader({
  currentPage = 'home',
  onNavigate,
  onSubscribeClick,
  onLoginClick,
  isLoggedIn = false,
  isSubscribed = false,
  onSearch,
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <header className="anime-header">
      <div className="header-inner">
        {/* Brand Logo */}
        <a
          href="#home"
          className="brand-logo"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('home');
          }}
        >
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-name">GHSNAPFLIX</span>
            <span className="brand-tagline">WATCH • STREAM • EXPLORE</span>
          </div>
        </a>

        {/* Navigation Pills */}
        <nav className="nav-menu" aria-label="Main Navigation">
          <button
            type="button"
            className={`nav-pill ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => onNavigate('home')}
          >
            Home
          </button>
          <button
            type="button"
            className={`nav-pill ${currentPage === 'videos' ? 'active' : ''}`}
            onClick={() => onNavigate('videos')}
          >
            Videos
          </button>
          <button
            type="button"
            className={`nav-pill ${currentPage === 'favorites' ? 'active' : ''}`}
            onClick={() => onNavigate('favorites')}
          >
            Favorites
          </button>
        </nav>

        {/* Search Bar */}
        <div className="search-container">
          <form onSubmit={handleSearchSubmit} className="search-input-wrap">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search anime, series, creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* Right Actions */}
        <div className="header-actions">
          {isLoggedIn && isSubscribed ? (
            <button
              type="button"
              className="subscribe-btn subscribed"
              onClick={() => onNavigate('videos')}
              title="Pass Active - Browse Videos"
            >
              <FaCheck style={{ marginRight: 6, fontSize: '0.85rem' }} />
              <span>Pass Active</span>
            </button>
          ) : (
            <button
              type="button"
              className="subscribe-btn"
              onClick={onSubscribeClick}
              title="Subscribe"
            >
              <span>Subscribe</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

