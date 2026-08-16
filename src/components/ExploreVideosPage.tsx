import React, { useState, useRef } from 'react';
import './ExploreVideosPage.css';

interface VideoCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  count: number;
  video: string;
  image: string;
}

const ExploreVideosPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const categories: VideoCategory[] = [
    {
      id: 'action',
      name: 'Action Video Games',
      icon: '💥',
      description: 'Intense combat and thrilling action',
      count: 245,
      video: 'https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/157_-_GTA_6_Trailer_sdhb8f.mp4',
      image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&auto=format&fit=crop'
    },
    {
      id: 'adventure',
      name: 'Adventure Video Games',
      icon: '🗺️',
      description: 'Epic journeys and discoveries',
      count: 189,
      video: 'https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/127_-_Onepiece_edit_ifvaba.mp4',
      image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop'
    },
    {
      id: 'strategy',
      name: 'Strategy Video Games',
      icon: '♟️',
      description: 'Tactical gameplay and planning',
      count: 156,
      video: 'https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/134_-_Cyberpunk_Edit_kwejen.mp4',
      image: 'https://images.unsplash.com/photo-1551808525-51a94da548ce?w=800&auto=format&fit=crop'
    },
    {
      id: 'racing',
      name: 'Racing Video Games',
      icon: '🏎️',
      description: 'High-speed thrills',
      count: 98,
      video: 'https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/153_-_The_quotes_from_onepiece_aqq6qj.mp4',
      image: 'https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?w=800&auto=format&fit=crop'
    },
    {
      id: 'sports',
      name: 'Sports Video Games',
      icon: '⚽',
      description: 'Virtual sports action',
      count: 124,
      video: 'https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/148_-_Death_note_edit_rf3xpx.mp4',
      image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop'
    },
    {
      id: 'puzzle',
      name: 'Puzzle Video Games',
      icon: '🧩',
      description: 'Brain-teasing challenges',
      count: 142,
      video: 'https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/157_-_GTA_6_Trailer_sdhb8f.mp4',
      image: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=800&auto=format&fit=crop'
    },
    {
      id: 'horror',
      name: 'Horror Video Games',
      icon: '👻',
      description: 'Scary and suspenseful',
      count: 87,
      video: 'https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/127_-_Onepiece_edit_ifvaba.mp4',
      image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop'
    },
    {
      id: 'indie',
      name: 'Indie Video Games',
      icon: '🎨',
      description: 'Creative and unique',
      count: 203,
      video: 'https://res.cloudinary.com/dbudqhbum/video/upload/Anime%20complete%20reels/134_-_Cyberpunk_Edit_kwejen.mp4',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop'
    }
  ];

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleVideoHover = (categoryId: string) => {
    setHoveredVideo(categoryId);
    const video = videoRefs.current[categoryId];
    if (video) {
      // Lazy load: set src only when hovered
      if (!video.src && video.dataset.src) {
        video.src = video.dataset.src;
      }
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  };

  const handleVideoLeave = (categoryId: string) => {
    setHoveredVideo(null);
    const video = videoRefs.current[categoryId];
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  const setVideoRef = (categoryId: string) => (el: HTMLVideoElement | null) => {
    videoRefs.current[categoryId] = el;
  };

  return (
    <div className="explore-videos-page">
      <div className="explore-header-section">
        <h1 className="explore-main-title">
          <span className="title-icon">🚀</span>
          Explore Video Games
        </h1>
        <p className="explore-subtitle">
          Discover thousands of amazing video games across all genres
        </p>
      </div>

      <div className="categories-grid">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`category-card ${selectedCategory === category.id ? 'selected' : ''}`}
            onClick={() => handleCategoryClick(category.id)}
            onMouseEnter={() => handleVideoHover(category.id)}
            onMouseLeave={() => handleVideoLeave(category.id)}
          >
            <div className="category-thumbnail">
              <video
                ref={setVideoRef(category.id)}
                data-src={category.video}
                muted
                playsInline
                loop
                preload="none"
                poster={category.image}
                className={`category-video ${hoveredVideo === category.id ? 'playing' : ''}`}
                style={{ backgroundImage: `url(${category.image})` }}
              />
              <div className={`category-overlay ${hoveredVideo === category.id ? 'video-active' : ''}`}>
                <span className="category-icon">{category.icon}</span>
              </div>
            </div>
            <div className="category-info">
              <h3 className="category-name">{category.name}</h3>
              <p className="category-description">{category.description}</p>
              <button className="explore-btn">
                Explore <span>→</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedCategory && (
        <div className="category-videos-preview">
          <h2 className="preview-title">Popular in {categories.find(c => c.id === selectedCategory)?.name}</h2>
          <div className="preview-grid">
            {categories.slice(0, 6).map((category, index) => (
              <div key={index} className="preview-video-card">
                <video
                  src={category.video}
                  muted
                  playsInline
                  loop
                  preload="metadata"
                  poster={category.image}
                  className="preview-thumbnail"
                />
                <div className="preview-info">
                  <div className="preview-play-btn">▶</div>
                  <span className="preview-duration">5:32</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExploreVideosPage;

