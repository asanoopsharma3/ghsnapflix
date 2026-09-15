import React, { useState, useEffect } from 'react';
import {
  FaPlay,
  FaCircleInfo,
  FaUsers,
  FaVideo,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
  FaBolt,
  FaCrown,
  FaGamepad,
  FaCommentDots,
} from 'react-icons/fa6';
import './HeroBanner.scss';

const HERO_SLIDES = [
  {
    id: 1,
    tag: '— A WORLD OF ANIME AWAITS —',
    titleLine1: 'Watch.',
    titleLine2: 'Stream.',
    titleHighlight: 'Feel the Story.',
    desc: 'The best anime series, AMVs, trailers and moments from around the world — all in one place.',
    quote: "It's Not Over Yet...",
    subQuote: 'ANIME CONNECTS US ALL',
    image: '/images/hero-bg1.png',
    thumbnail: '/thumbnails/zoro.jpg',
    videoTitle: 'The Promise Of Zoro',
    videoUrl: 'https://snapflix-mp4.s3.ap-southeast-2.amazonaws.com/Anime_mp4/108%20-%20The%20Promise%20Of%20Zoro.mp4',
  },
  {
    id: 2,
    tag: '— UNLEASH THE CREATIVE SPARK —',
    titleLine1: 'Watch.',
    titleLine2: 'Stream.',
    titleHighlight: 'Feel the Story.',
    desc: 'The best anime series, AMVs, trailers and moments from around the world — all in one place.',
    quote: 'Same Anime, Different Perspective',
    subQuote: 'GOOD ANIME, BETTER PEOPLE',
    image: '/images/hero-bg2.png',
    thumbnail: '/thumbnails/jinwoo.jpg',
    videoTitle: 'Sung Jin Woo Aura',
    videoUrl: 'https://snapflix-mp4.s3.ap-southeast-2.amazonaws.com/Anime_mp4/11%20-%20Sung%20Jin%20Woo%20Aura.mp4',
  },
  {
    id: 3,
    tag: '— PASSION MEETS PERFECTION —',
    titleLine1: 'Watch.',
    titleLine2: 'Stream.',
    titleHighlight: 'Feel the Story.',
    desc: 'The best anime series, AMVs, trailers and moments from around the world — all in one place.',
    quote: 'Good Stories, Brighter People',
    subQuote: 'A BRIGHTER TOMORROW',
    image: '/images/hero-bg3.png',
    thumbnail: '/thumbnails/naruto.jpg',
    videoTitle: 'The Tale Of Naruto Uzumaki',
    videoUrl: 'https://snapflix-mp4.s3.ap-southeast-2.amazonaws.com/Anime_mp4/110%20-%20The%20Tale%20Of%20Naruto%20Uzumaki.mp4',
  },
  {
    id: 4,
    tag: '— CRAFTED BY CREATORS —',
    titleLine1: 'Watch.',
    titleLine2: 'Stream.',
    titleHighlight: 'Feel the Story.',
    desc: 'The best anime series, AMVs, trailers and moments from around the world — all in one place.',
    quote: "It's Not Over Yet...",
    subQuote: 'CULTURE ALWAYS',
    image: '/images/hero-bg4.png',
    thumbnail: '/thumbnails/gojo.jpg',
    videoTitle: 'Satoro Gojo Edit',
    videoUrl: 'https://snapflix-mp4.s3.ap-southeast-2.amazonaws.com/Anime_mp4/129%20-%20Satoro%20Gojo%20Edit.mp4',
  },
];

export default function HeroBanner({ onVideoPlay, onNavigate }) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Smooth Auto-Play carousel with 6s interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [currentSlideIndex]);

  const slide = HERO_SLIDES[currentSlideIndex];

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleWatch = () => {
    if (onVideoPlay) {
      onVideoPlay({
        id: `hero-${slide.id}`,
        title: slide.videoTitle || `${slide.titleLine1} ${slide.titleHighlight}`,
        videoUrl: slide.videoUrl,
        thumbnail: slide.thumbnail || slide.image,
        category: 'Featured',
      });
    }
  };

  return (
    <section className="hero-banner-wrapper">
      <div className="hero-banner">
        {/* Animated Background Carousel */}
        <div className="hero-bg-slider">
          {HERO_SLIDES.map((s, index) => (
            <div
              key={s.id}
              className={`hero-bg-slide ${index === currentSlideIndex ? 'active' : ''}`}
            >
              <img src={s.image} alt={`Hero Anime Slide ${s.id}`} />
            </div>
          ))}
          <div className="hero-overlay" />

          {/* Right Calligraphic Quote Badge */}
          {slide.quote && (
            <div className="hero-quote-badge" key={`quote-${slide.id}`}>
              <div className="hero-quote-script">{slide.quote}</div>
              <svg className="hero-quote-underline" viewBox="0 0 160 16" fill="none">
                <path d="M 2 10 Q 80 18 158 4" stroke="#FFD21F" strokeWidth="3" strokeLinecap="round" />
              </svg>
              {slide.subQuote && (
                <div className="hero-subquote">
                  <span>{slide.subQuote}</span>
                  <div className="subquote-line" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hero Main Content */}
        <div className="hero-content">
          <div className="hero-text-block">
            <span className="hero-tag">{slide.tag}</span>
            <h1 className="hero-title">
              {slide.titleLine1}
              <br />
              {slide.titleLine2}
              <br />
              <span className="highlight-yellow">{slide.titleHighlight}</span>
            </h1>
            <p className="hero-desc">{slide.desc}</p>
            
            {/* CTA Buttons */}
            <div className="hero-cta-group">
              <button type="button" className="btn-watch" onClick={handleWatch}>
                <FaPlay className="btn-icon" />
                <span>Watch Now</span>
              </button>
              <button
                type="button"
                className="btn-info"
                onClick={() => onNavigate('videos')}
              >
                <FaCircleInfo className="btn-icon" />
                <span>Explore</span>
              </button>
            </div>

            {/* Social Proof / Stats Strip */}
            <div className="hero-stats-row">
              <div className="hero-stat-item">
                <FaUsers className="hero-stat-icon" />
                <div className="hero-stat-info">
                  <span className="hero-stat-num">1M+</span>
                  <span className="hero-stat-label">ANIME LOVERS</span>
                </div>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat-item">
                <FaVideo className="hero-stat-icon" />
                <div className="hero-stat-info">
                  <span className="hero-stat-num">50K+</span>
                  <span className="hero-stat-label">VIDEOS</span>
                </div>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat-item">
                <FaStar className="hero-stat-icon" />
                <div className="hero-stat-info">
                  <span className="hero-stat-num">100+</span>
                  <span className="hero-stat-label">CREATORS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Right Slider Controls */}
          <div className="hero-controls">
            <span className="slide-counter">
              0{currentSlideIndex + 1} / 0{HERO_SLIDES.length}
            </span>
            <div className="nav-arrows">
              <button
                type="button"
                className="arrow-btn"
                onClick={handlePrev}
                aria-label="Previous Slide"
              >
                <FaChevronLeft />
              </button>
              <button
                type="button"
                className="arrow-btn"
                onClick={handleNext}
                aria-label="Next Slide"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Feature Strip with Yellow Top Divider */}
      <div className="hero-features-bar">
        <div className="hero-features-container">
          <div className="hero-feature-item">
            <FaBolt className="feature-icon" />
            <div className="feature-text">
              <span className="feature-title">TRENDING ANIME</span>
              <span className="feature-subtitle">Fresh content daily</span>
            </div>
          </div>

          <div className="hero-feature-item">
            <FaCrown className="feature-icon" />
            <div className="feature-text">
              <span className="feature-title">TOP CREATORS</span>
              <span className="feature-subtitle">Amazing talent worldwide</span>
            </div>
          </div>

          <div className="hero-feature-item">
            <FaGamepad className="feature-icon" />
            <div className="feature-text">
              <span className="feature-title">DIVERSE GENRES</span>
              <span className="feature-subtitle">Something for everyone</span>
            </div>
          </div>

          <div className="hero-feature-item">
            <FaCommentDots className="feature-icon" />
            <div className="feature-text">
              <span className="feature-title">PREMIUM STREAMING</span>
              <span className="feature-subtitle">1-Day Pass for 1 GHS</span>
            </div>
          </div>

          <div className="hero-features-divider" />

          <div className="hero-signature-wrap">
            <span className="hero-signature-text">More Than Anime</span>
            <svg className="hero-signature-underline" viewBox="0 0 120 12" fill="none">
              <path d="M 2 8 Q 60 14 118 4" stroke="#FFD21F" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

