import React, { useState } from 'react';
import './ExploreVideosPage.scss';
import {
  FaGamepad,
  FaUsers,
  FaStar,
  FaPlay,
  FaCircleInfo,
  FaCrown,
  FaFire,
  FaCalendarDays,
  FaHeart,
  FaEllipsisVertical,
  FaArrowRight,
  FaCompass,
  FaBolt,
  FaGhost,
  FaChessPawn,
} from 'react-icons/fa6';

export default function ExploreVideosPage({ onVideoPlay, onNavigate }) {
  const [activeGenre, setActiveGenre] = useState(null);

  const GENRES = [
    {
      id: 'action',
      name: 'Action Games',
      tagline: 'Intense combat and thrilling action',
      image: '/images/genre_action.png',
      badgeIcon: <FaBolt />,
      badgeColor: '#ef4444',
      badgeBg: '#fee2e2',
    },
    {
      id: 'adventure',
      name: 'Adventure Games',
      tagline: 'Epic journeys and discoveries',
      image: '/images/genre_adventure.png',
      badgeIcon: <FaCompass />,
      badgeColor: '#10b981',
      badgeBg: '#d1fae5',
    },
    {
      id: 'strategy',
      name: 'Strategy Games',
      tagline: 'Tactical gameplay and planning',
      image: '/images/genre_strategy.png',
      badgeIcon: <FaChessPawn />,
      badgeColor: '#8b5cf6',
      badgeBg: '#ede9fe',
    },
    {
      id: 'horror',
      name: 'Horror Games',
      tagline: 'Scary and suspenseful',
      image: '/images/genre_horror.png',
      badgeIcon: <FaGhost />,
      badgeColor: '#06b6d4',
      badgeBg: '#cffafe',
    },
    {
      id: 'indie',
      name: 'Indie Games',
      tagline: 'Creative and unique',
      image: '/images/genre_indie.png',
      badgeIcon: <FaHeart />,
      badgeColor: '#ec4899',
      badgeBg: '#fce7f3',
    },
  ];

  const ADVENTURE_VIDEOS = [
    {
      id: 'adv-1',
      title: 'Luffy In Skypiea',
      duration: '5:32',
      views: '1.2M',
      timestamp: '2 weeks ago',
      thumbnail: '/thumbnails/luffy.jpg',
      videoUrl: 'https://snapflix-mp4.s3.ap-southeast-2.amazonaws.com/Anime_mp4/143%20-%20Luffy%20In%20Skypia.mp4',
    },
    {
      id: 'adv-2',
      title: 'The Tunnel To Summer',
      duration: '5:32',
      views: '856K',
      timestamp: '3 weeks ago',
      thumbnail: '/thumbnails/tunnel_summer.jpg',
      videoUrl: 'https://snapflix-mp4.s3.ap-southeast-2.amazonaws.com/Anime_mp4/123.%20-%20The%20Tunnel%20To%20Summer.mp4',
    },
    {
      id: 'adv-3',
      title: 'Attack On Titan',
      duration: '5:32',
      views: '2.4M',
      timestamp: '1 month ago',
      thumbnail: '/thumbnails/eren_aot.jpg',
      videoUrl: 'https://snapflix-mp4.s3.ap-southeast-2.amazonaws.com/Anime_mp4/114%20-%20Attack%20On%20Titan.mp4',
    },
    {
      id: 'adv-4',
      title: 'The Tale Of Naruto Uzumaki',
      duration: '5:32',
      views: '1.1M',
      timestamp: '1 month ago',
      thumbnail: '/thumbnails/naruto.jpg',
      videoUrl: 'https://snapflix-mp4.s3.ap-southeast-2.amazonaws.com/Anime_mp4/110%20-%20The%20Tale%20Of%20Naruto%20Uzumaki.mp4',
    },
  ];

  const handleVideoCardClick = (video) => {
    if (onVideoPlay) {
      onVideoPlay({
        title: video.title,
        videoUrl: video.videoUrl,
        thumbnailUrl: video.thumbnail,
      });
    }
  };

  return (
    <div className="explore-page-canvas">
      <div className="explore-page-inner">
        {/* 1. Hero Banner: Explore Video Games (Light Theme with Gamer Boy Art) */}
        <section className="explore-hero-card">
          <div className="hero-left-content">
            <div className="hero-kicker">
              <span className="kicker-line" />
              <span>EXPLORE</span>
              <span className="kicker-line" />
            </div>

            <h1 className="hero-main-title">
              Explore <br />
              <span className="highlight-yellow">Video Games</span>
            </h1>

            <p className="hero-desc">
              Discover thousands of amazing video games across all genres. Find your next adventure.
            </p>

            <div className="hero-cta-group">
              <button
                type="button"
                className="btn-start-exploring"
                onClick={() => onNavigate?.('videos')}
              >
                <FaPlay className="btn-icon" />
                <span>Start Exploring</span>
              </button>
              <button
                type="button"
                className="btn-how-it-works"
                onClick={() => onNavigate?.('videos')}
              >
                <FaCircleInfo className="btn-icon" />
                <span>All Videos</span>
              </button>
            </div>

            {/* 3 Stats Counters in a row */}
            <div className="hero-stats-row">
              <div className="explore-stat-row-item">
                <span className="stat-row-icon">
                  <FaGamepad />
                </span>
                <div className="stat-row-text">
                  <strong>1000+</strong>
                  <span>Games</span>
                </div>
              </div>

              <div className="stat-row-divider" />

              <div className="explore-stat-row-item">
                <span className="stat-row-icon">
                  <FaUsers />
                </span>
                <div className="stat-row-text">
                  <strong>50K+</strong>
                  <span>Active Gamers</span>
                </div>
              </div>

              <div className="stat-row-divider" />

              <div className="explore-stat-row-item">
                <span className="stat-row-icon">
                  <FaStar />
                </span>
                <div className="stat-row-text">
                  <strong>Top Rated</strong>
                  <span>Curated Collection</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Artwork with Gamer Boy */}
          <div className="hero-right-artwork">
            <img
              src="/images/explore_light_hero_transparent.png"
              alt="Anime gamer boy with glowing headphones"
              className="gamer-boy-img"
            />
          </div>
        </section>

        {/* 2. Browse by Genre */}
        <section className="browse-genre-section">
          <div className="section-title-bar">
            <div className="title-left">
              <span className="title-icon-yellow">
                <FaGamepad />
              </span>
              <div>
                <h2>Browse by Genre</h2>
                <p>Find games that match your vibe</p>
              </div>
            </div>
            <button
              type="button"
              className="view-all-text-link"
              onClick={() => onNavigate?.('videos')}
            >
              View All Categories →
            </button>
          </div>

          <div className="genre-cards-grid">
            {GENRES.map((genre) => (
              <div
                key={genre.id}
                className={`genre-card ${activeGenre === genre.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveGenre(genre.id);
                  onNavigate?.('videos');
                }}
              >
                <div className="genre-thumb-wrap">
                  <img src={genre.image} alt={genre.name} />
                </div>
                <div className="genre-card-content">
                  <div className="genre-main-info">
                    <div className="genre-title-row">
                      <span
                        className="genre-badge-icon"
                        style={{ color: genre.badgeColor, backgroundColor: genre.badgeBg }}
                      >
                        {genre.badgeIcon}
                      </span>
                      <h3>{genre.name}</h3>
                    </div>
                    <p>{genre.tagline}</p>
                  </div>
                  <div className="genre-action-row">
                    <span className="arrow-circle">
                      <FaArrowRight />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Discover Hidden Gems Banner */}
        <section className="discover-gems-banner">
          <div className="gems-banner-bg">
            <img
              src="/images/hidden_gems_clean_bg.png"
              alt="Swordsman overlooking sunset mountain"
              className="gems-bg-img"
            />
            <div className="gems-gradient-overlay" />
          </div>

          <div className="gems-content-wrapper">
            <div className="gems-left">
              <div className="title-row">
                <span className="crown-icon">
                  <FaCrown />
                </span>
                <h2>Discover Hidden Gems</h2>
              </div>
              <p>
                Explore indie games, trending titles and community favorites all in one place.
              </p>
              <button
                type="button"
                className="btn-explore-now"
                onClick={() => onNavigate?.('videos')}
              >
                <span>Explore Now →</span>
              </button>
            </div>

            <div className="gems-right-checklist">
              <div className="check-item">
                <FaCalendarDays className="item-icon" />
                <span>New Games Weekly</span>
              </div>
              <div className="check-item">
                <FaUsers className="item-icon" />
                <span>Community Picks</span>
              </div>
              <div className="check-item">
                <FaGamepad className="item-icon" />
                <span>Detailed Info</span>
              </div>
              <div className="check-item">
                <FaHeart className="item-icon" />
                <span>Save Your Favorites</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Popular in Adventure Video Games */}
        <section className="adventure-popular-section">
          <div className="section-title-bar">
            <div className="title-left">
              <span className="title-icon-yellow fire-glow">
                <FaFire />
              </span>
              <div>
                <h2>Popular in Adventure Video Games</h2>
                <p>Most played and loved by our community</p>
              </div>
            </div>
            <button
              type="button"
              className="view-all-pill-btn"
              onClick={() => onNavigate?.('videos')}
            >
              View All →
            </button>
          </div>

          <div className="adventure-video-grid">
            {ADVENTURE_VIDEOS.map((video) => (
              <div
                key={video.id}
                className="adventure-card"
                onClick={() => handleVideoCardClick(video)}
              >
                <div className="adv-thumb-container">
                  <img src={video.thumbnail} alt={video.title} loading="lazy" />
                  <div className="adv-overlay" />
                  <span className="adv-duration">{video.duration}</span>
                  <div className="center-play-badge">
                    <svg viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                <div className="adv-info-row">
                  <div className="title-block">
                    <h4>{video.title}</h4>
                    <div className="adv-meta">
                      <svg
                        className="meta-eye"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <span>{video.views}</span>
                      <span className="dot">•</span>
                      <span>{video.timestamp}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="menu-dots-btn"
                    title="More options"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <FaEllipsisVertical />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Can't Find What You're Looking For? */}
        <section className="cant-find-callout">
          <div className="callout-inner">
            <div className="callout-left">
              <div className="callout-icon-box">
                <FaGamepad />
              </div>
              <div className="callout-text">
                <h3>Can't Find What You're Looking For?</h3>
                <p>Explore all categories and discover your next favorite game.</p>
              </div>
            </div>

            <button
              type="button"
              className="btn-browse-games"
              onClick={() => onNavigate?.('videos')}
            >
              Browse All Games →
            </button>

            <div className="callout-doodle-wrap">
              <img
                src="/images/explore_bottom_doodle_transparent.png"
                alt="Games Bring People Together"
                className="bottom-doodle-img"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
