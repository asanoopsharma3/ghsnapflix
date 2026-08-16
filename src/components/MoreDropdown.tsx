import React, { useState, useRef, useEffect } from 'react';
import './MoreDropdown.css';

const MoreDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const categories = [
    'ACTION',
    'ADVENTURE', 
    'BATTLE GAME',
    'BRAIN TEASE',
    'FIGHTING',
    'PUZZLE / SKILL',
    'RACING',
    'ROLE PLAYING GAME',
    'SPORTS'
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCategoryClick = (category: string) => {
    setIsOpen(false);
  };

  return (
    <div className="more-dropdown" ref={dropdownRef}>
      <button 
        className="more-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        MORE <span className="dropdown-arrow">▼</span>
      </button>
      
      {isOpen && (
        <div className="more-menu">
          <div className="menu-header">THE GHSNAPFLIX ORIGINALS</div>
          <div className="menu-categories">
            {categories.map((category, index) => (
              <div
                key={index}
                className="category-item"
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoreDropdown;
