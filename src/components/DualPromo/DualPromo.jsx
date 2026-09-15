import React from 'react';
import './DualPromo.scss';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export default function DualPromo({ onSelectGenre, onUploadClick }) {
  const promoRef = useScrollReveal({ threshold: 0.15 });

  return (
    <section className="dual-promo-section reveal-on-scroll" ref={promoRef}>
      <div className="dual-promo-inner">
        {/* Left Card: Explore by Genre */}
        <div className="genre-promo-card">
          <div className="genre-card-header">
            <div className="title-row">
              <span className="accent-bar" />
              <h3>Explore by Genre</h3>
            </div>
            <p>Find your next spark for you</p>
          </div>

          <div className="genre-button-grid">
            <button
              type="button"
              className="genre-btn"
              onClick={() => onSelectGenre('action')}
            >
              <div className="genre-icon-wrap action">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <span>Action</span>
            </button>

            <button
              type="button"
              className="genre-btn"
              onClick={() => onSelectGenre('adventure')}
            >
              <div className="genre-icon-wrap adventure">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polygon points="3 11 22 2 13 21 11 13 3 11" />
                </svg>
              </div>
              <span>Adventure</span>
            </button>

            <button
              type="button"
              className="genre-btn"
              onClick={() => onSelectGenre('fighting')}
            >
              <div className="genre-icon-wrap fighting">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" />
                </svg>
              </div>
              <span>Fighting</span>
            </button>

            <button
              type="button"
              className="genre-btn"
              onClick={() => onSelectGenre('thriller')}
            >
              <div className="genre-icon-wrap thriller">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <circle cx="9" cy="10" r="1.5" fill="currentColor" />
                  <circle cx="15" cy="10" r="1.5" fill="currentColor" />
                  <path d="M8 16c1.33-1 2.67-1 4-1s2.67 0 4 1" />
                </svg>
              </div>
              <span>Thriller</span>
            </button>

            <button
              type="button"
              className="genre-btn"
              onClick={() => onSelectGenre('comedy')}
            >
              <div className="genre-icon-wrap comedy">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
              </div>
              <span>Comedy</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

