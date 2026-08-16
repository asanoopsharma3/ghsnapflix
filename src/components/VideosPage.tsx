import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import './VideosPage.css';
import { allVideos, getVideoUrl } from '../utils/localVideos';
import { PlayableVideo, VideoPlayHandler } from '../types/video';

interface VideoItem {
  id: number;
  title: string;
  category: string;
  video: string; // Video URL
}

interface VideosPageProps {
  onVideoPlay?: VideoPlayHandler;
}

interface VideoCardProps {
  video: VideoItem;
  onCardClick: (video: PlayableVideo) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onCardClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const touchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Get video URL
  const videoUrl = video.video;
  
  // Disable thumbnail generation to prevent crashes
  // Use placeholder instead - much better performance
  const thumbnailSrc = null;

  useLayoutEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl || !videoUrl) return;

    if (isHovered && showVideo) {
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
  }, [isHovered, showVideo, videoUrl]);

  const playVideo = () => {
    setShowVideo(true);
  };

  const pauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
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

  const handleTouchStart = () => {
    setIsHovered(true);
    playVideo();
    
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
    }
    
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
    onCardClick({
      title: video.title,
      videoUrl: video.video,
    });
  };

  return (
    <div 
      className="video-card-new"
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
    >
      <div className="video-wrapper">
        <video
          ref={videoRef}
          className={`video-preview ${showVideo ? 'playing' : ''}`}
          muted
          playsInline
          loop
          preload="metadata"
          onError={() => {
            console.error('Video load error:', videoUrl);
          }}
        />
        {!showVideo && (
          <div 
            className="video-thumbnail video-thumbnail-placeholder"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 4
            }}
          >
            <div style={{ textAlign: 'center', color: '#fff' }}>
              <div style={{ fontSize: '48px', marginBottom: '10px', opacity: 0.8 }}>🎬</div>
              <div style={{ fontSize: '14px', fontWeight: 600, opacity: 0.9 }}>{video.title}</div>
            </div>
          </div>
        )}
        <div className="video-badge">{video.category.toUpperCase()}</div>
      </div>
      <div className="video-details">
        <h3>{video.title}</h3>
      </div>
    </div>
  );
};

const VideosPage: React.FC<VideosPageProps> = ({ onVideoPlay }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Convert allVideos to VideoItem format
  const videosList: VideoItem[] = allVideos.map((v) => ({
    id: v.id,
    title: v.name,
    category: v.category || 'all',
    video: getVideoUrl(v.videoPath)
  }));

  const categories = [
    { id: 'all', name: 'All Videos', icon: '🎬' },
    { id: 'trailers', name: 'Trailers', icon: '🎭' },
    { id: 'action', name: 'Action', icon: '💥' },
    { id: 'adventure', name: 'Adventure', icon: '🗺️' },
    { id: 'thriller', name: 'Thriller', icon: '👻' }
  ];

  const filteredVideos = selectedCategory === 'all'
    ? videosList
    : videosList.filter(video => video.category.toLowerCase() === selectedCategory);

  return (
    <div className="videos-page-new">
      <div className="videos-content">
        <div className="videos-page-header">
          <h1>Video Library</h1>
          <p>Watch the latest video game content</p>
        </div>

        <div className="category-filters">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span className="filter-icon">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        <div className="videos-grid-new">
          {filteredVideos.map((video) => (
            <VideoCard 
              key={video.id}
              video={video}
              onCardClick={(video) => onVideoPlay?.(video)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideosPage;
