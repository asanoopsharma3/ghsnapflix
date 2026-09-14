import React, { useState, useMemo, useEffect } from 'react';
import './VideosPage.scss';
import { allVideos, getVideoUrl } from '../utils/localVideos';
import { FEATURED_ANIME_VIDEOS, getMatchingAnimeThumbnail } from '../config/animeCatalog';
import { useFavorites } from '../hooks/useFavorites';
import {
  FaHeart,
  FaRegHeart,
  FaStar,
  FaFilm,
  FaBolt,
  FaCompass,
  FaFire,
  FaGhost,
  FaMasksTheater,
  FaMagnifyingGlass,
  FaXmark,
} from 'react-icons/fa6';

// High-quality anime artwork fallback gallery
const ANIME_THUMBNAILS = [
  'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=700&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1563089145-599997674d42?w=700&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=700&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=700&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=700&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?w=700&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=700&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=700&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=700&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=700&auto=format&fit=crop&q=85',
];

// Determine anime category intelligently from title
const detectAnimeCategory = (title = '') => {
  const t = title.toLowerCase();
  if (t.includes('zoro') || t.includes('swordsman') || t.includes('titan') || t.includes('fire force') || t.includes('slayer') || t.includes('action')) {
    return 'action';
  }
  if (t.includes('luffy') || t.includes('onepiece') || t.includes('naruto') || t.includes('marineford') || t.includes('vinland') || t.includes('adventure') || t.includes('roger')) {
    return 'adventure';
  }
  if (t.includes('gojo') || t.includes('jujutsu') || t.includes('gogeta') || t.includes('jin woo') || t.includes('fight') || t.includes('garp') || t.includes('fighting')) {
    return 'fighting';
  }
  if (t.includes('watching me') || t.includes('cyberpunk') || t.includes('death note') || t.includes('thriller') || t.includes('orochimaru') || t.includes('imu')) {
    return 'thriller';
  }
  if (t.includes('blue lock') || t.includes('haikyuu') || t.includes('comedy') || t.includes('blue box') || t.includes('funny') || t.includes('jojo')) {
    return 'comedy';
  }
  return 'anime';
};

// Deterministic views, duration, and timestamp generation for catalog display
const getAnimeMeta = (index) => {
  const viewsList = ['1.2M', '896K', '2.4M', '1.7M', '1.3M', '2.8M', '1.9M', '2.1M', '620K', '448K', '2.3M', '1.4M', '980K', '1.6M', '3.1M'];
  const timesList = ['2 weeks ago', '1 month ago', '3 weeks ago', '5 days ago', '2 months ago', '3 days ago', '1 week ago'];
  const durationsList = ['02:14', '01:56', '03:21', '01:45', '02:10', '02:08', '01:35', '02:26', '01:52', '02:49', '02:15', '01:36'];

  return {
    views: viewsList[index % viewsList.length],
    timestamp: timesList[index % timesList.length],
    duration: durationsList[index % durationsList.length],
  };
};

const CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'anime', name: 'Anime', icon: <FaFilm /> },
  { id: 'action', name: 'Action', icon: <FaBolt /> },
  { id: 'adventure', name: 'Adventure', icon: <FaCompass /> },
  { id: 'fighting', name: 'Fighting', icon: <FaFire /> },
  { id: 'thriller', name: 'Thriller', icon: <FaGhost /> },
  { id: 'comedy', name: 'Comedy', icon: <FaMasksTheater /> },
];

const ITEMS_PER_PAGE = 16;

export default function VideosPage({
  onVideoPlay,
  initialCategory = 'all',
  onSelectCategory,
  searchQuery = '',
  onSearchChange,
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [sortBy, setSortBy] = useState('popular');
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Sync with prop search changes
  useEffect(() => {
    setLocalSearch(searchQuery);
    setCurrentPageNum(1);
  }, [searchQuery]);

  // Sync category if initialCategory changes
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
      setCurrentPageNum(1);
    }
  }, [initialCategory]);

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    setCurrentPageNum(1);
    if (onSelectCategory) {
      onSelectCategory(catId);
    }
  };

  const handleSearchInput = (e) => {
    const val = e.target.value;
    setLocalSearch(val);
    setCurrentPageNum(1);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  const handleClearSearch = () => {
    setLocalSearch('');
    setCurrentPageNum(1);
    if (onSearchChange) {
      onSearchChange('');
    }
  };

  // Convert real S3 allVideos into unified catalog with rich anime metadata
  const fullCatalog = useMemo(() => {
    return allVideos.map((v, idx) => {
      const category = detectAnimeCategory(v.name);
      const meta = getAnimeMeta(idx);
      const thumb = getMatchingAnimeThumbnail(v.name, idx);

      return {
        id: `s3-${v.id}`,
        title: v.name,
        category,
        videoUrl: getVideoUrl(v.videoPath),
        thumbnail: thumb,
        duration: meta.duration,
        views: meta.views,
        timestamp: meta.timestamp,
        isFeatured: idx % 7 === 0, // Flag select high-profile videos as featured
      };
    });
  }, []);

  // Filtered & Sorted Videos
  const filteredVideos = useMemo(() => {
    let result = fullCatalog;

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter(
        (v) => v.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query
    const q = localSearch.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q)
      );
    }

    // Sort videos
    const sorted = [...result];
    if (sortBy === 'title') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'duration') {
      sorted.sort((a, b) => b.duration.localeCompare(a.duration));
    } else if (sortBy === 'newest') {
      sorted.reverse();
    }
    // 'popular' keeps curated top order

    return sorted;
  }, [fullCatalog, selectedCategory, localSearch, sortBy]);

  // Featured videos for top shelf (only shown when in 'All' and no active search)
  const featuredRow = useMemo(() => {
    if (selectedCategory !== 'all' || localSearch.trim()) {
      return [];
    }
    return FEATURED_ANIME_VIDEOS;
  }, [selectedCategory, localSearch]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredVideos.length / ITEMS_PER_PAGE) || 1;
  const paginatedVideos = useMemo(() => {
    const start = (currentPageNum - 1) * ITEMS_PER_PAGE;
    return filteredVideos.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredVideos, currentPageNum]);

  const handleCardClick = (video) => {
    if (onVideoPlay) {
      onVideoPlay({
        id: video.id,
        title: video.title,
        videoUrl: video.videoUrl,
        category: video.category,
        thumbnailUrl: video.thumbnail,
      });
    }
  };

  return (
    <div className="videos-page-container">
      <div className="videos-inner">
        {/* 1. Page Hero / Header */}
        <header className="videos-hero-header">
          <div className="header-text-block">
            <div className="title-row">
              <span className="accent-bar" />
              <h1>Explore Videos</h1>
            </div>
            <p>
              Discover the latest anime series, moments, trailers and creator content.
            </p>
          </div>

          <div className="header-search-wrap">
            <svg
              className="search-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search in videos..."
              value={localSearch}
              onChange={handleSearchInput}
            />
            {localSearch && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={handleClearSearch}
                aria-label="Clear Search"
              >
                <FaXmark />
              </button>
            )}
          </div>
        </header>

        {/* 2. Category Filter */}
        <nav className="category-filter-row" aria-label="Filter Videos by Category">
          <div className="category-scroll-list">
            {CATEGORIES.map((cat) => {
              if (cat.id === 'all') {
                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`cat-card-all ${selectedCategory === 'all' ? 'active' : ''}`}
                    onClick={() => handleCategorySelect('all')}
                  >
                    <svg viewBox="0 0 24 24">
                      <rect x="3" y="3" width="7" height="7" rx="1.5" />
                      <rect x="14" y="3" width="7" height="7" rx="1.5" />
                      <rect x="14" y="14" width="7" height="7" rx="1.5" />
                      <rect x="3" y="14" width="7" height="7" rx="1.5" />
                    </svg>
                    <span>All</span>
                  </button>
                );
              }

              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`cat-card-item ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => handleCategorySelect(cat.id)}
                >
                  {cat.icon && <span className="cat-icon">{cat.icon}</span>}
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* 3. Featured Videos Section (near top, real data) */}
        {featuredRow.length > 0 && (
          <section className="featured-videos-block" aria-label="Featured Videos">
            <div className="section-toolbar">
              <div className="section-title-wrap">
                <div className="title-row">
                  <span className="star-icon"><FaStar /></span>
                  <h2>Featured Videos</h2>
                </div>
                <span className="subtitle">Handpicked anime releases and moments</span>
              </div>
            </div>

            <div className="videos-grid-4col">
              {featuredRow.map((video) => {
                const videoKey = video.title || video.name || video.id;
                const favorited = isFavorite(videoKey);

                return (
                  <div
                    key={video.id}
                    className="anime-video-card"
                    onClick={() => handleCardClick(video)}
                  >
                    <div className="thumbnail-wrap">
                      <img src={video.thumbnail} alt={video.title} loading="lazy" />
                      <div className="thumb-overlay" />
                      <span className="featured-badge">FEATURED</span>
                      <span className="duration-pill">{video.duration}</span>

                      <button
                        type="button"
                        className={`card-fav-btn ${favorited ? 'is-favorited' : ''}`}
                        title={favorited ? 'Remove from favorites' : 'Add to favorites'}
                        aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(video);
                        }}
                      >
                        {favorited ? <FaHeart /> : <FaRegHeart />}
                      </button>

                      <div className="center-play-btn">
                        <svg viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>

                  <div className="card-info">
                    <h3 className="card-title">{video.title}</h3>
                    <div className="card-meta">
                      <svg
                        className="meta-eye"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <span>{video.views} views</span>
                      <span className="dot-sep">•</span>
                      <span>{video.timestamp}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          </section>
        )}

        {/* 4. All Videos Section */}
        <section className="all-videos-block" aria-label="All Videos">
          <div className="section-toolbar">
            <div className="section-title-wrap">
              <span className="results-count-pill">
                {selectedCategory !== 'all'
                  ? `${CATEGORIES.find((c) => c.id === selectedCategory)?.name || selectedCategory} (${filteredVideos.length})`
                  : `All Videos (${filteredVideos.length})`}
              </span>
            </div>

            <div className="sort-control">
              <label htmlFor="video-sort">Sort by</label>
              <select
                id="video-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest First</option>
                <option value="title">Title (A - Z)</option>
                <option value="duration">Duration</option>
              </select>
            </div>
          </div>

          {/* Loading Skeletons */}
          {isLoading && (
            <div className="videos-grid-4col">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-thumb" />
                  <div className="skeleton-details">
                    <div className="skeleton-title" />
                    <div className="skeleton-meta" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && paginatedVideos.length === 0 && (
            <div className="empty-state-card">
              <div className="empty-icon-wrap"><FaMagnifyingGlass /></div>
              <h3>No videos found</h3>
              <p>Try another category or search for something else.</p>
              <button
                type="button"
                className="btn-browse-all"
                onClick={() => {
                  handleCategorySelect('all');
                  handleClearSearch();
                }}
              >
                Browse All Videos
              </button>
            </div>
          )}

          {/* 4-Column Video Grid */}
          {!isLoading && paginatedVideos.length > 0 && (
            <div className="videos-grid-4col">
              {paginatedVideos.map((video) => {
                const videoKey = video.title || video.name || video.id;
                const favorited = isFavorite(videoKey);

                return (
                  <div
                    key={video.id}
                    className="anime-video-card"
                    onClick={() => handleCardClick(video)}
                  >
                    <div className="thumbnail-wrap">
                      <img src={video.thumbnail} alt={video.title} loading="lazy" />
                      <div className="thumb-overlay" />
                      {video.isFeatured && (
                        <span className="featured-badge">FEATURED</span>
                      )}
                      <span className="duration-pill">{video.duration}</span>

                      <button
                        type="button"
                        className={`card-fav-btn ${favorited ? 'is-favorited' : ''}`}
                        title={favorited ? 'Remove from favorites' : 'Add to favorites'}
                        aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(video);
                        }}
                      >
                        {favorited ? <FaHeart /> : <FaRegHeart />}
                      </button>

                      <div className="center-play-btn">
                        <svg viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>

                  <div className="card-info">
                    <h3 className="card-title">{video.title}</h3>
                    <div className="card-meta">
                      <svg
                        className="meta-eye"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <span>{video.views} views</span>
                      <span className="dot-sep">•</span>
                      <span>{video.timestamp}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          )}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <>
              <div className="pagination-row">
                <button
                  type="button"
                  className="page-btn"
                  disabled={currentPageNum === 1}
                  onClick={() => setCurrentPageNum((p) => Math.max(p - 1, 1))}
                >
                  ← Prev
                </button>

                {[...Array(totalPages)].map((_, idx) => {
                  const pageNumber = idx + 1;
                  // Show current page and surrounding pages if many pages
                  if (
                    totalPages > 7 &&
                    Math.abs(pageNumber - currentPageNum) > 2 &&
                    pageNumber !== 1 &&
                    pageNumber !== totalPages
                  ) {
                    if (Math.abs(pageNumber - currentPageNum) === 3) {
                      return (
                        <span key={pageNumber} className="page-ellipsis">
                          …
                        </span>
                      );
                    }
                    return null;
                  }

                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      className={`page-btn ${currentPageNum === pageNumber ? 'active' : ''}`}
                      onClick={() => setCurrentPageNum(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  type="button"
                  className="page-btn"
                  disabled={currentPageNum === totalPages}
                  onClick={() =>
                    setCurrentPageNum((p) => Math.min(p + 1, totalPages))
                  }
                >
                  Next →
                </button>
              </div>

              <div className="pagination-info">
                Showing {Math.min((currentPageNum - 1) * ITEMS_PER_PAGE + 1, filteredVideos.length)} -{' '}
                {Math.min(currentPageNum * ITEMS_PER_PAGE, filteredVideos.length)} of{' '}
                {filteredVideos.length} videos
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
