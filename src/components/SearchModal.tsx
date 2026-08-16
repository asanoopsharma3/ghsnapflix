import React, { useState, useEffect, useRef } from 'react';
import './SearchModal.css';
import { useTranslation } from '../contexts/TranslationContext';
import { allVideos } from '../utils/localVideos';

interface SearchModalProps {
  onClose: () => void;
}

interface SearchResult {
  id: string;
  title: string;
  type: 'game' | 'video' | 'page';
  description: string;
  thumbnail?: string;
  category?: string;
}

const SearchModal: React.FC<SearchModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const catalogVideoResults: SearchResult[] = allVideos.map((v) => ({
    id: `vid-${v.id}`,
    title: v.name,
    type: 'video',
    description: v.description || v.name,
    category: v.category,
  }));

  const allContent: SearchResult[] = [
    ...catalogVideoResults,
    // Games
    { id: '1', title: 'Cyber Warriors 2077', type: 'game', description: 'Futuristic action RPG', thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop', category: 'Action' },
    { id: '2', title: 'Space Odyssey', type: 'game', description: 'Explore the vast universe', thumbnail: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=100&h=100&fit=crop', category: 'Adventure' },
    { id: '3', title: 'Racing Thunder', type: 'game', description: 'High-speed racing action', thumbnail: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=100&h=100&fit=crop', category: 'Racing' },
    { id: '4', title: 'Medieval Legends', type: 'game', description: 'Epic fantasy adventure', thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop', category: 'RPG' },
    { id: '5', title: 'Battle Royale X', type: 'game', description: 'Survive and conquer', thumbnail: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=100&h=100&fit=crop', category: 'Action' },
    { id: '6', title: 'Puzzle Master', type: 'game', description: 'Challenge your mind', thumbnail: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=100&h=100&fit=crop', category: 'Puzzle' },
    { id: '7', title: 'Horror Mansion', type: 'game', description: 'Survive the night', thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=100&h=100&fit=crop', category: 'Horror' },
    { id: '8', title: 'Sports Champions', type: 'game', description: 'Compete in various sports', thumbnail: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=100&h=100&fit=crop', category: 'Sports' },

    // Pages
    { id: 'p1', title: 'Subscription Plans', type: 'page', description: 'View our subscription options' },
    { id: 'p2', title: 'Rewards Program', type: 'page', description: 'Earn points and get rewards' },
    { id: 'p3', title: 'FAQ', type: 'page', description: 'Frequently asked questions' },
    { id: 'p4', title: 'About Us', type: 'page', description: 'Learn more about GHSnapflix' }
  ];

  useEffect(() => {
    // Focus on input when modal opens
    inputRef.current?.focus();

    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }

    // Close on escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // Simulate API delay
    const timer = setTimeout(() => {
      const query = searchQuery.toLowerCase();
      const results = allContent.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query)
      );
      setSearchResults(results);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() && !recentSearches.includes(query)) {
      const updated = [query, ...recentSearches.slice(0, 4)];
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'game': return '🎮';
      case 'video': return '🎬';
      case 'page': return '📄';
      default: return '🔍';
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'game': return 'Game';
      case 'video': return 'Video';
      case 'page': return 'Page';
      default: return '';
    }
  };

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal-header">
          <div className="search-input-container">
            <span className="search-icon">🔍</span>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search games, videos, or pages..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button className="clear-search" onClick={() => setSearchQuery('')}>
                ×
              </button>
            )}
          </div>
          <button className="close-search-modal" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="search-modal-content">
          {!searchQuery && recentSearches.length > 0 && (
            <div className="recent-searches">
              <div className="recent-header">
                <h3>Recent Searches</h3>
                <button className="clear-recent" onClick={clearRecentSearches}>
                  Clear All
                </button>
              </div>
              <div className="recent-list">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    className="recent-item"
                    onClick={() => setSearchQuery(search)}
                  >
                    <span className="recent-icon">🕒</span>
                    <span>{search}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {!searchQuery && recentSearches.length === 0 && (
            <div className="search-placeholder">
              <div className="placeholder-icon">🔍</div>
              <h3>Search GHSnapflix</h3>
              <p>Find games, videos, and more</p>
              <div className="popular-searches">
                <h4>Popular Searches</h4>
                <div className="popular-tags">
                  {['Action Games', 'RPG', 'Racing', 'Puzzle', 'Horror', 'Sports'].map(tag => (
                    <button
                      key={tag}
                      className="popular-tag"
                      onClick={() => setSearchQuery(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {isSearching && (
            <div className="search-loading">
              <div className="loading-spinner"></div>
              <p>Searching...</p>
            </div>
          )}

          {searchQuery && !isSearching && searchResults.length === 0 && (
            <div className="no-results">
              <div className="no-results-icon">😕</div>
              <h3>No results found</h3>
              <p>Try searching for something else</p>
            </div>
          )}

          {searchQuery && !isSearching && searchResults.length > 0 && (
            <div className="search-results">
              <div className="results-header">
                <h3>Results ({searchResults.length})</h3>
              </div>
              <div className="results-list">
                {searchResults.map((result) => (
                  <div key={result.id} className="result-item">
                    {result.thumbnail ? (
                      <img src={result.thumbnail} alt={result.title} className="result-thumbnail" />
                    ) : (
                      <div className="result-icon-placeholder">
                        {getTypeIcon(result.type)}
                      </div>
                    )}
                    <div className="result-info">
                      <div className="result-title-row">
                        <h4>{result.title}</h4>
                        <span className={`result-type-badge ${result.type}`}>
                          {getTypeBadge(result.type)}
                        </span>
                      </div>
                      <p className="result-description">{result.description}</p>
                      {result.category && (
                        <span className="result-category">{result.category}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
