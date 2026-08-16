import React, { useState, useEffect, useCallback, useRef } from 'react';
import './InteractiveCarousel.css';
import { useTranslation } from '../contexts/TranslationContext';
import { useVideoThumbnail } from '../hooks/useVideoThumbnail';
import { carouselVideos, getVideoUrl, getVideoMimeType } from '../utils/localVideos';
import { VideoPlayHandler } from '../types/video';

interface CarouselItem {
  id: number;
  title: string;
  video: string; // Direct video URL
  directUrl?: string;
  description?: string;
}

interface InteractiveCarouselProps {
  onVideoPlay: VideoPlayHandler;
}

const InteractiveCarousel: React.FC<InteractiveCarouselProps> = ({ onVideoPlay }) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [showVideo, setShowVideo] = useState(true); // Always show video
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hoverTimer, setHoverTimer] = useState<NodeJS.Timeout | null>(null);
  const [videoTimer, setVideoTimer] = useState<NodeJS.Timeout | null>(null);
  const [touchTimer, setTouchTimer] = useState<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const moreInfoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Safely detect mobile once on mount
    if (typeof window !== 'undefined' && window.innerWidth) {
      setIsMobile(window.innerWidth <= 768);
    }
  }, []);

  // Convert carousel videos to the format needed
  const carouselItems: CarouselItem[] = carouselVideos.map(v => ({
    id: v.id,
    title: v.name,
    video: getVideoUrl(v.videoPath),
    directUrl: getVideoUrl(v.videoPath),
    description: v.description
  }));

  // ALL HOOKS MUST BE CALLED UNCONDITIONALLY - before any early returns
  const currentItem = carouselItems.length > 0 ? carouselItems[currentIndex] : null;
  const videoUrl = currentItem?.video || '';

  // Skip thumbnail for external URLs (S3) – avoids CORS and speeds up; video will show instead
  const isExternalUrl = videoUrl.startsWith('http://') || videoUrl.startsWith('https://');
  const thumbnailSrc = useVideoThumbnail(isExternalUrl ? undefined : videoUrl);

  const nextSlide = useCallback(() => {
    if (carouselItems.length === 0) return;
    setCurrentIndex((prevIndex) => 
      prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
    );
  }, [carouselItems.length]);

  const prevSlide = useCallback(() => {
    if (carouselItems.length === 0) return;
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
    );
  }, [carouselItems.length]);

  const goToSlide = useCallback((index: number) => {
    if (carouselItems.length === 0) return;
    setCurrentIndex(index);
  }, [carouselItems.length]);

  // Auto-play video on load and when slide changes - optimized with cleanup
  useEffect(() => {
    if (!currentItem || !videoRef.current || !videoUrl) return;
    
    const video = videoRef.current;
    let cleanup: (() => void) | null = null;
    
    // Reset video when slide changes
    video.pause();
    video.currentTime = 0;
    
    // Set src when index changes
    if (video.src !== videoUrl) {
      video.src = videoUrl;
      video.load();
    }
    
    // Play when ready - simplified
    const playVideo = () => {
      if (video.readyState >= 2 && video.paused && currentItem) {
        video.currentTime = 0;
        video.play().catch(() => {
          // Autoplay blocked - ignore
        });
      }
    };
    
    // Try to play immediately if ready
    if (video.readyState >= 2) {
      playVideo();
    } else {
      const onCanPlay = () => {
        if (currentItem) {
          playVideo();
        }
      };
      video.addEventListener('canplay', onCanPlay, { once: true });
      cleanup = () => {
        video.removeEventListener('canplay', onCanPlay);
      };
    }
    
    return () => {
      if (cleanup) cleanup();
    };
  }, [currentIndex, currentItem, videoUrl]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    if (carouselItems.length === 0) return;
    
    // Disable auto-advance on mobile to prevent performance issues
    if (isMobile) return;

    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [nextSlide, isAutoPlaying, isMobile, carouselItems.length]);

  // Start video when slide changes (only on hover)
  useEffect(() => {
    const video = videoRef.current;
    if (video && isHovered && showVideo && currentItem) {
      // Lazy load: set src if not loaded
      if (!video.src && video.dataset.src) {
        video.src = video.dataset.src;
        video.load();
      }
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  }, [currentIndex, isHovered, showVideo, currentItem]);

  // Handle click outside More Info
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreInfoRef.current && !moreInfoRef.current.contains(event.target as Node)) {
        setShowMoreInfo(false);
      }
    };

    if (showMoreInfo) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMoreInfo]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hoverTimer) clearTimeout(hoverTimer);
      if (videoTimer) clearTimeout(videoTimer);
      if (touchTimer) clearTimeout(touchTimer);
    };
  }, [hoverTimer, videoTimer, touchTimer]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setIsAutoPlaying(false);
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsAutoPlaying(true);
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  };

  const handleTouchStart = () => {
    setIsHovered(true);
    setIsAutoPlaying(false);
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
    
    if (touchTimer) {
      clearTimeout(touchTimer);
    }
    const timer = setTimeout(() => {
      setIsHovered(false);
      setIsAutoPlaying(true);
    }, 5000);
    setTouchTimer(timer);
  };

  const handleTouchEnd = () => {
    // Ensure video plays on touch end if it didn't on touch start
    const video = videoRef.current;
    if (video && video.paused && isHovered) {
      video.play().catch(() => {});
    }
  };

  const openCurrentVideo = () => {
    if (!currentItem) {
      return;
    }

    onVideoPlay({
      title: currentItem.title,
      videoUrl: currentItem.video,
    });
  };

  const handleCarouselClick = () => {
    openCurrentVideo();
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openCurrentVideo();
  };

  const handleMoreInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering carousel click
    setShowMoreInfo(!showMoreInfo);
  };

  // Early return AFTER all hooks are called
  if (carouselItems.length === 0 || !currentItem) {
    return (
      <div className="interactive-carousel" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>No carousel videos available</div>
      </div>
    );
  }

  return (
    <div 
      className="interactive-carousel"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleCarouselClick}
    >
      <div className="carousel-container">
        <div className="slide-content">
          <div className="slide-text-overlay">
            <div className="slide-info">
              <h1 className="slide-title">{currentItem.title}</h1>
              <p className="slide-description">{currentItem.description}</p>
              <div className="slide-actions">
                <button 
                  className="slide-button primary"
                  onClick={(e) => handlePlayClick(e)}
                >
                  <span className="btn-icon">▶</span>
                  {t('homepage.action.play')}
                </button>
                <button 
                  className="slide-button secondary hide-on-mobile"
                  onClick={(e) => handleMoreInfoClick(e)}
                >
                  <span className="btn-icon">ℹ</span>
                  {t('homepage.action.moreInfo')}
                </button>
              </div>
            </div>
            
            {showMoreInfo && (
              <div className="more-info-content" ref={moreInfoRef}>
                <div className="info-section">
                  <h3>Game Details</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Genre:</span>
                      <span className="info-value">{currentItem.title}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Rating:</span>
                      <span className="info-value">★★★★★ (4.8/5)</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Players:</span>
                      <span className="info-value">1-4 Players</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Platform:</span>
                      <span className="info-value">PC, Mobile, Console</span>
                    </div>
                  </div>
                  <div className="info-description">
                    <p>Immerse yourself in the ultimate gaming experience with stunning graphics, 
                    smooth gameplay, and endless entertainment. Perfect for both casual and hardcore gamers.</p>
                  </div>
                  <div className="info-features">
                    <h4>Key Features:</h4>
                    <ul>
                      <li>🎮 Intuitive controls and smooth gameplay</li>
                      <li>🎨 Stunning visual effects and graphics</li>
                      <li>🏆 Multiple difficulty levels and achievements</li>
                      <li>🌐 Online multiplayer support</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="slide-media">
            <video
              key={`video-${currentIndex}-${videoUrl}`}
              ref={videoRef}
              src={videoUrl}
              poster={thumbnailSrc || undefined}
              className="slide-video-element visible"
              muted
              playsInline
              loop
              autoPlay
              preload="auto"
              onLoadedData={() => {
                if (videoRef.current && process.env.NODE_ENV === 'development') {
                  console.log('[Carousel] Video loaded:', currentItem?.title, videoUrl);
                }
              }}
              onCanPlay={() => {
                const video = videoRef.current;
                if (video && video.paused) {
                  video.currentTime = 0;
                  video.play().catch(() => {
                    // Autoplay blocked - ignore
                  });
                }
              }}
              onError={(e) => {
                const video = videoRef.current;
                const error = video?.error;
                const msg = error
                  ? `code ${error.code} (${error.message})`
                  : 'unknown';
                console.error('[Carousel] Video failed to load:', msg, 'URL:', videoUrl);
              }}
            >
              <source src={videoUrl} type={getVideoMimeType(videoUrl)} />
              Your browser does not support the video tag.
            </video>
            <div className="media-overlay video-active">
              <div className="video-preview-badge">
                <span className="preview-dot"></span>
                <span>PREVIEW</span>
              </div>
            </div>
            
            
            
            {/* Progress indicator for current slide */}
            <div className="slide-progress">
              <div className="progress-dots">
                {carouselItems.map((_, index) => (
                  <div 
                    key={index}
                    className={`progress-dot ${index === currentIndex ? 'active' : ''}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button className="carousel-arrow left" onClick={prevSlide}>
        ‹
      </button>
      <button className="carousel-arrow right" onClick={nextSlide}>
        ›
      </button>

      {/* Dots Indicator */}
      <div className="carousel-dots">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default InteractiveCarousel;
