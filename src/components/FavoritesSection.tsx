import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import './FavoritesSection.css';
import { allVideos, getVideoUrl } from '../utils/localVideos';
import { VideoPlayHandler } from '../types/video';

interface VideoItem {
  name: string;
  video: string; // Video URL
  category: string;
}

interface FavoriteCardProps {
  video: VideoItem;
  onVideoPlay: VideoPlayHandler;
}

const FavoriteCard: React.FC<FavoriteCardProps> = ({ video, onVideoPlay }) => {
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoUrl = video.video;
  // Disable thumbnail generation to prevent crashes - use placeholder
  const thumbnailSrc = null;

  useLayoutEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl || !videoUrl) return;

    if (showVideo) {
      try {
        const next = new URL(videoUrl).href;
        if (videoEl.src !== next) {
          videoEl.src = videoUrl;
          videoEl.load();
        }
      } catch {
        if (videoEl.getAttribute('src') !== videoUrl) {
          videoEl.src = videoUrl;
          videoEl.load();
        }
      }

      const tryPlay = () => {
        if (!videoRef.current) return;
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      };

      if (videoEl.readyState >= 2) {
        tryPlay();
      } else {
        const onCanPlay = () => tryPlay();
        videoEl.addEventListener('canplay', onCanPlay, { once: true });
        return () => videoEl.removeEventListener('canplay', onCanPlay);
      }
    } else {
      videoEl.pause();
      videoEl.removeAttribute('src');
      videoEl.load();
    }
    return undefined;
  }, [showVideo, videoUrl]);

  const handleMouseEnter = () => {
    setShowVideo(true);
  };

  const handleMouseLeave = () => {
    setShowVideo(false);
  };

  const handleClick = () => {
    onVideoPlay({
      title: video.name,
      videoUrl: video.video,
    });
  };

  return (
    <div 
      className="favorite-card"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="favorite-video-container">
        <video
          ref={videoRef}
          className={`favorite-video-element ${showVideo ? 'favorite-video-visible' : ''}`}
          muted
          playsInline
          loop
          preload="metadata"
          onError={() => {
            console.error('Favorite video load error:', videoUrl);
          }}
        />
        {!showVideo && (
          thumbnailSrc ? (
            <img
              src={thumbnailSrc}
              alt={video.name}
              className="favorite-thumbnail"
            />
          ) : (
            <div className="favorite-thumbnail favorite-thumbnail-placeholder" style={{ 
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#999',
              zIndex: 4
            }}>
              <span>Loading...</span>
            </div>
          )
        )}
        <div className="favorite-overlay">
          <span className="favorite-badge">❤️ FAVORITE</span>
        </div>
      </div>
      <h3 className="favorite-title">{video.name}</h3>
      <span className="favorite-category">{video.category}</span>
    </div>
  );
};

interface FavoritesSectionProps {
  onVideoPlay: VideoPlayHandler;
  onNavigate?: (page: string) => void;
}

const FavoritesSection: React.FC<FavoritesSectionProps> = ({ onVideoPlay, onNavigate }) => {
  const [favoriteVideos, setFavoriteVideos] = useState<VideoItem[]>([]);

  useEffect(() => {
    const loadFavorites = () => {
      const stored = localStorage.getItem('ghsnapflix_favorites');
      if (stored) {
        try {
          const favoriteNames = new Set(JSON.parse(stored));
          
          // Convert allVideos to VideoItem format and filter by favorite names
          const videosList: VideoItem[] = allVideos
            .filter(v => favoriteNames.has(v.name))
            .map(v => ({
              name: v.name,
              video: getVideoUrl(v.videoPath),
              category: v.category || 'All'
            }));
          
          // Remove duplicates - if same video appears in multiple categories, keep first occurrence
          const uniqueVideos = videosList.reduce((acc, current) => {
            const existing = acc.find(v => v.name === current.name && v.video === current.video);
            if (!existing) {
              acc.push(current);
            }
            return acc;
          }, [] as VideoItem[]);
          
          setFavoriteVideos(uniqueVideos);
        } catch (error) {
          console.error('Error loading favorites:', error);
          setFavoriteVideos([]);
        }
      }
    };
    
    loadFavorites();
    
    // Listen for storage changes (when favorites are updated)
    const handleStorageChange = () => {
      loadFavorites();
    };
    
    // Use custom event for same-window updates
    const handleCustomStorageChange = () => {
      loadFavorites();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', loadFavorites);
    window.addEventListener('favoritesUpdated', handleCustomStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', loadFavorites);
      window.removeEventListener('favoritesUpdated', handleCustomStorageChange);
    };
  }, []);
  
  if (favoriteVideos.length === 0) {
    return null;
  }
  
  return (
    <div className="favorites-section">
      <div className="favorites-header">
        <h2 className="favorites-title">
          ❤️ Your Favorite Videos
        </h2>
        {onNavigate && (
          <button 
            className="view-all-btn"
            onClick={() => onNavigate('videos')}
          >
            View All →
          </button>
        )}
      </div>
      
      <div className="favorites-grid">
        {favoriteVideos.slice(0, 4).map((video) => (
          <FavoriteCard key={`${video.name}-${video.video}`} video={video} onVideoPlay={onVideoPlay} />
        ))}
      </div>
    </div>
  );
};

export default FavoritesSection;

