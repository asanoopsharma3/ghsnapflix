import React, { useEffect, useRef } from 'react';
import './ParticleBackground.css';

const SimpleParticleBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random position
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      
      // Random size
      const size = Math.random() * 4 + 1;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      
      // Random color
      particle.style.backgroundColor = Math.random() > 0.5 ? '#3b82f6' : '#0d9488';
      
      // Random opacity
      particle.style.opacity = (Math.random() * 0.5 + 0.1).toString();
      
      // Random animation duration
      particle.style.animationDuration = (Math.random() * 10 + 5) + 's';
      
      container.appendChild(particle);
      
      // Remove particle after animation
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 15000);
    };

    // Reduce particle creation rate on mobile
    const isMobile = window.innerWidth <= 768;
    const intervalRate = isMobile ? 800 : 200;
    const initialCount = isMobile ? 5 : 20;
    
    // Create particles periodically
    const interval = setInterval(createParticle, intervalRate);
    
    // Create initial particles
    for (let i = 0; i < initialCount; i++) {
      setTimeout(createParticle, i * (isMobile ? 300 : 100));
    }

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="particle-background"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}
    />
  );
};

export default SimpleParticleBackground;
