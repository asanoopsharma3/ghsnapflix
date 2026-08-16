import React from 'react';
import './HeroSection.css';

interface HeroSectionProps {
  onGameClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onGameClick }) => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">FPS</h1>
          <button className="play-button" onClick={onGameClick}>
            Let's Play
          </button>
        </div>
        
        <div className="hero-video">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            preload="metadata"
            className="hero-video-element"
            poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%231a1a1a'/%3E%3C/svg%3E"
          >
            <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="video-overlay"></div>
        </div>
      </div>
      
      <div className="carousel-controls">
        <button className="carousel-arrow left">‹</button>
        <button className="carousel-arrow right">›</button>
      </div>
      
      <div className="carousel-indicators">
        <span className="indicator active"></span>
        <span className="indicator"></span>
        <span className="indicator"></span>
      </div>
    </section>
  );
};

export default HeroSection;
