import React from 'react';
import './SnapflixLogo.css';

interface SnapflixLogoProps {
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
  className?: string;
}

const SnapflixLogo: React.FC<SnapflixLogoProps> = ({ 
  size = 'medium', 
  animated = true, 
  className = '' 
}) => {
  return (
    <div className={`ghsnapflix-logo ${size} ${animated ? 'animated' : ''} ${className}`}>
      <div className="logo-container">
        <div className="modern-play-icon">
          <svg viewBox="0 0 100 100" className="play-svg">
            <defs>
              <radialGradient id="ghsnapflixGradient" cx="32%" cy="26%" r="78%">
                <stop offset="0%" stopColor="#fff6c2" />
                <stop offset="28%" stopColor="#7ee8d4" />
                <stop offset="62%" stopColor="#2dd4bf" />
                <stop offset="100%" stopColor="#0f766e" />
              </radialGradient>
              <radialGradient id="ghsnapflixHighlight" cx="30%" cy="24%" r="42%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.75)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="45" fill="url(#ghsnapflixGradient)" className="play-circle" />
            <ellipse cx="38" cy="34" rx="20" ry="14" fill="url(#ghsnapflixHighlight)" />
            <path d="M 40 30 L 40 70 L 65 50 Z" fill="white" className="play-triangle" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" className="play-ring" />
          </svg>
        </div>
        
        <div className="logo-text">
          <span className="text-snap">GHSNAP</span>
          <span className="text-flix">FLIX</span>
        </div>
      </div>
    </div>
  );
};

export default SnapflixLogo;
