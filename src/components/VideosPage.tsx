import React, { useState, useRef, useEffect } from 'react';
import './VideosPage.css';
import { allVideos, getVideoUrl } from '../utils/localVideos';
import { PlayableVideo, VideoPlayHandler } from '../types/video';
import { useCardVideoPreview } from '../hooks/useCardVideoPreview';

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
  const touchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Get video URL
  const videoUrl = video.video;
  const { containerRef, videoRef, hasFrame } = useCardVideoPreview(videoUrl, isHovered && showVideo);

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
      <div className="video-wrapper" ref={containerRef}>
        <video
          ref={videoRef}
          className="video-preview playing"
          muted
          playsInline
          loop
          preload="metadata"
          onError={() => {
            console.error('Video load error:', videoUrl);
          }}
        />
        {!hasFrame && (
          <div className="video-poster-fallback">{video.title}</div>
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
