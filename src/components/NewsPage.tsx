import React from 'react';
import './NewsPage.css';

const NewsPage: React.FC = () => {
  return (
    <div className="news-page">
      <div className="news-container">
        {/* Main News Section */}
        <div className="news-main">
          <div className="news-left">
            <h1 className="news-title">NEWS</h1>
            <h2 className="news-subtitle">News 18</h2>
            <p className="news-description">
              From epic battles to heart-racing adventures, Thegameium has it all. Browse our action games and start your journey today. Play your favourite games now.
            </p>
            <div className="news-meta">
              <div className="news-folder">
                <span className="folder-icon">📁</span>
                <span className="news-date">2025-03-13</span>
              </div>
              <div className="news-time">
                <span className="clock-icon">🕐</span>
              </div>
            </div>
          </div>

          <div className="news-center">
            <div className="live-news-card large">
              <div className="live-text">
                <div className="live-red">LIVE</div>
                <div className="news-white">NEWS</div>
              </div>
            </div>
          </div>

          <div className="news-right">
            <div className="gaming-industry-card">
              <div className="industry-content">
                <div className="industry-tags">
                  <div className="tag-left">
                    <span className="tag">NEWS</span>
                    <span className="tag">MOBILE GAMES</span>
                    <span className="tag">AR</span>
                  </div>
                  <div className="tag-right">
                    <span className="tag">CONSOLE GAMES</span>
                    <span className="tag">E-SPORTS</span>
                    <span className="tag">AR</span>
                  </div>
                </div>
                <div className="industry-title">
                  <div className="gaming-text">GAMING</div>
                  <div className="industry-text">INDUSTRY</div>
                </div>
              </div>
              <div className="industry-silhouette">🎧</div>
            </div>

            <div className="article-snippet">
              <h3 className="article-title">About Space and World</h3>
              <p className="article-description">
                From epic battles to heart-racing adventures, Thegameium has it all. Browse our action games and start your journey today. Play your favourite games now.
              </p>
              <div className="article-date">2025-03-10</div>
            </div>
          </div>
        </div>

        {/* Bottom LIVE Cards */}
        <div className="live-cards-section">
          <div className="live-news-card small">
            <div className="live-text">
              <div className="live-red">LIVE</div>
            </div>
          </div>
          <div className="live-news-card small">
            <div className="live-text">
              <div className="live-red">LIVE</div>
            </div>
          </div>
          <div className="live-news-card small">
            <div className="live-text">
              <div className="live-red">LIVE</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
