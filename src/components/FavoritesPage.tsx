import React, { useState, useEffect } from 'react';
import './FavoritesPage.css';
import { allVideos, getVideoUrl } from '../utils/localVideos';
import { VideoPlayHandler } from '../types/video';
import { useCardVideoPreview } from '../hooks/useCardVideoPreview';

interface VideoItem {
  name: string;
  video: string; // Video URL
  category: string;
}

interface FavoritePageCardProps {
  video: VideoItem;
  onVideoPlay?: VideoPlayHandler;
  onRemove: (name: string) => void;
}

const FavoritePageCard: React.FC<FavoritePageCardProps> = ({ video, onVideoPlay, onRemove }) => {
  const [showVideo, setShowVideo] = useState(false);
  const videoUrl = video.video;
  const { containerRef, videoRef, hasFrame } = useCardVideoPreview(videoUrl, showVideo);

  const handleClick = () => {
    onVideoPlay?.({
      title: video.name,
      videoUrl: video.video,
    });
  };

  return (
    <div 
      key={video.name} 
      className="favorite-card-page" 
      onClick={handleClick}
      onMouseEnter={() => setShowVideo(true)}
      onMouseLeave={() => setShowVideo(false)}
    >
      <div className="favorite-video-container-page" ref={containerRef}>
        <video
          ref={videoRef}
          className="favorite-video-element-page favorite-video-page-visible"
          muted
          playsInline
          loop
          preload="metadata"
          onError={() => {
            console.error('Favorite page video load error:', videoUrl);
          }}
        />
        {!hasFrame && (
          <div className="video-poster-fallback">{video.name}</div>
        )}
        <button
          className="remove-favorite-btn"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(video.name);
          }}
        >
          ✕
        </button>
      </div>
      <h3 className="favorite-title-page">{video.name}</h3>
      <span className="favorite-category-page">{video.category}</span>
    </div>
  );
};

interface FavoritesPageProps {
  onVideoPlay?: VideoPlayHandler;
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({ onVideoPlay }) => {
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
    
    // Listen for storage changes
    const handleStorageChange = () => {
      loadFavorites();
    };
    
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

  const handleRemoveFavorite = (videoName: string) => {
    const stored = localStorage.getItem('ghsnapflix_favorites');
    if (stored) {
      const favoriteNames = new Set(JSON.parse(stored));
      favoriteNames.delete(videoName);
      localStorage.setItem('ghsnapflix_favorites', JSON.stringify(Array.from(favoriteNames)));
      setFavoriteVideos(prev => prev.filter(v => v.name !== videoName));
      // Dispatch custom event to update favorites sections
      window.dispatchEvent(new Event('favoritesUpdated'));
    }
  };

  if (favoriteVideos.length === 0) {
    return (
      <div className="favorites-page">
        <div className="favorites-empty">
          <div className="empty-icon">❤️</div>
          <h2>No Favorite Videos Yet</h2>
          <p>Start adding videos to your favorites by clicking the heart icon on any video!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="favorites-header-page">
        <h1 className="favorites-page-title">
          <span className="heart-icon">❤️</span>
          Your Favorite Videos
        </h1>
        <p className="favorites-page-subtitle">
          {favoriteVideos.length} {favoriteVideos.length === 1 ? 'video' : 'videos'} in your collection
        </p>
      </div>

      <div className="favorites-grid-page">
        {favoriteVideos.map((video) => (
          <FavoritePageCard
            key={`${video.name}-${video.video}`}
            video={video}
            onVideoPlay={onVideoPlay}
            onRemove={handleRemoveFavorite}
          />
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;

