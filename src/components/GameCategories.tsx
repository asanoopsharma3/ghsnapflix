import React, { useCallback, useState, useRef, useEffect } from 'react';
import './GameCategories.css';
import { useTranslation } from '../contexts/TranslationContext';
import { topTrendingVideos, adventureVideos, actionVideos, brainteaseVideos, fightingVideos, getVideoUrl } from '../utils/localVideos';
import { VideoPlayHandler } from '../types/video';
import { useCardVideoPreview } from '../hooks/useCardVideoPreview';

interface VideoItem {
  name: string;
  video: string; // Video URL
  category?: string;
}

interface VideoCategoriesProps {
  onVideoPlay: VideoPlayHandler;
  onNavigate?: (page: string) => void;
}

interface VideoCardProps {
  video: VideoItem;
  onVideoPlay: VideoPlayHandler;
  onFavorite?: (name: string) => void;
  isFavorite?: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onVideoPlay, onFavorite, isFavorite }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [favorite, setFavorite] = useState(isFavorite || false);
  const touchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Get video URL
  const videoUrl = video.video;
  const { containerRef, videoRef, hasFrame } = useCardVideoPreview(videoUrl, isHovered && showVideo);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorite(!favorite);
    if (onFavorite) {
      onFavorite(video.name);
    }
  };

  const playVideo = () => {
    setShowVideo(true);
  };

  const pauseVideo = () => {
    setShowVideo(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    playVideo();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    pauseVideo();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    // Don't prevent default to allow natural touch behavior
    setIsHovered(true);
    playVideo(); // Will trigger useEffect to play
    
    // Clear any existing timer
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
    }
    
    // Auto-pause after 5 seconds on touch devices
    touchTimerRef.current = setTimeout(() => {
      setIsHovered(false);
      pauseVideo();
    }, 5000);
  };

  useEffect(() => {
    return () => {
      if (touchTimerRef.current) {
        clearTimeout(touchTimerRef.current);
      }
    };
  }, []);

  const handleCardClick = () => {
    onVideoPlay({
      title: video.name,
      videoUrl: video.video,
    });
  };

  return (
    <div 
      className={`video-card ${isHovered ? 'hovered' : ''}`}
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
    >
      <div className="video-image-container" ref={containerRef}>
        <video
          ref={videoRef}
          className="video-element visible"
          muted
          playsInline
          loop
          preload="metadata"
          onError={() => {
            console.error('Video load error:', videoUrl);
          }}
        />
        {!hasFrame && (
          <div className="video-poster-fallback">{video.name}</div>
        )}
        <div className="video-overlay video-active">
          <div className="video-preview-badge">
            <span className="preview-dot"></span>
            <span>PREVIEW</span>
          </div>
        </div>
        <button 
          className={`favorite-btn ${favorite ? 'active' : ''}`}
          onClick={handleFavoriteClick}
          aria-label="Add to favorites"
        >
          ❤️
        </button>
      </div>
      <h3 className="video-title">{video.name}</h3>
    </div>
  );
};

const VideoCategories: React.FC<VideoCategoriesProps> = ({ onVideoPlay, onNavigate }) => {
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  
  // Load favorites from localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem('ghsnapflix_favorites');
    if (storedFavorites) {
      setFavorites(new Set(JSON.parse(storedFavorites)));
    }
  }, []);
  
  // Save favorites to localStorage
  const handleFavorite = (videoName: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(videoName)) {
      newFavorites.delete(videoName);
    } else {
      newFavorites.add(videoName);
    }
    setFavorites(newFavorites);
    localStorage.setItem('ghsnapflix_favorites', JSON.stringify(Array.from(newFavorites)));
    // Dispatch custom event to update favorites sections in same window
    window.dispatchEvent(new Event('favoritesUpdated'));
  };
  
  const handleViewAll = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('videos');
    }
  };
  const categories: Array<{ title: string; games: VideoItem[] }> = [
    {
      title: "TOP TRENDING VIDEOS",
      games: topTrendingVideos.map(v => ({ 
        name: v.name, 
        video: getVideoUrl(v.videoPath),
        category: v.category
      }))
    },
    {
      title: "ADVENTURE VIDEOS",
      games: adventureVideos.map(v => ({ 
        name: v.name, 
        video: getVideoUrl(v.videoPath),
        category: v.category
      }))
    },
    {
      title: "ACTION VIDEOS",
      games: actionVideos.map(v => ({ 
        name: v.name, 
        video: getVideoUrl(v.videoPath),
        category: v.category
      }))
    },
    {
      title: "BRAIN TEASE VIDEOS",
      games: brainteaseVideos.map(v => ({ 
        name: v.name, 
        video: getVideoUrl(v.videoPath),
        category: v.category
      }))
    },
    {
      title: "FIGHTING VIDEOS",
      games: fightingVideos.map(v => ({ 
        name: v.name, 
        video: getVideoUrl(v.videoPath),
        category: v.category
      }))
    }
  ];

  const handleVideoPlay = useCallback(
    (video: Parameters<VideoPlayHandler>[0]) => onVideoPlay(video),
    [onVideoPlay]
  );

  return (
    <div className="game-categories">
      <div className="categories-header">
        <h1 className="categories-main-title">{t('homepage.categories.title')}</h1>
        <p className="categories-main-subtitle">{t('homepage.categories.subtitle')}</p>
      </div>
      
      {categories.map((category, categoryIndex) => (
        <section key={categoryIndex} className="category-section">
          <div className="category-header">
            <h2 className="category-title">{category.title}</h2>
            <button 
              className="view-all-btn" 
              onClick={handleViewAll}
            >
              View All →
            </button>
          </div>
          
          <div className="videos-grid">
            {category.games.map((video, videoIndex) => (
              <VideoCard 
                key={videoIndex}
                video={video}
                onVideoPlay={handleVideoPlay}
                onFavorite={handleFavorite}
                isFavorite={favorites.has(video.name)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default VideoCategories;
