import React, { useState } from 'react';
import './RewardsPage.css';
import { useTranslation } from '../contexts/TranslationContext';

interface Reward {
  id: number;
  title: string;
  description: string;
  points: number;
  category: string;
  icon: string;
  isAvailable: boolean;
  isClaimed?: boolean;
}

interface UserStats {
  totalPoints: number;
  level: number;
  gamesCompleted: number;
  achievements: number;
  streak: number;
}

const RewardsPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const userStats: UserStats = {
    totalPoints: 2450,
    level: 8,
    gamesCompleted: 47,
    achievements: 23,
    streak: 12
  };

  const rewardCategories = [
    { id: 'all', name: 'All Rewards', icon: '🎁' },
    { id: 'gaming', name: 'Gaming', icon: '🎮' },
    { id: 'premium', name: 'Premium', icon: '👑' },
    { id: 'exclusive', name: 'Exclusive', icon: '⭐' },
    { id: 'social', name: 'Social', icon: '👥' }
  ];

  const rewards: Reward[] = [
    {
      id: 1,
      title: 'Premium Game Access',
      description: 'Unlock exclusive premium games for 30 days',
      points: 500,
      category: 'premium',
      icon: '🎮',
      isAvailable: true
    },
    {
      id: 2,
      title: 'Exclusive Avatar Frame',
      description: 'Get a limited edition avatar frame',
      points: 200,
      category: 'exclusive',
      icon: '🖼️',
      isAvailable: true
    },
    {
      id: 3,
      title: 'Double XP Weekend',
      description: '2x experience points for all games',
      points: 300,
      category: 'gaming',
      icon: '⚡',
      isAvailable: true
    },
    {
      id: 4,
      title: 'Early Access Pass',
      description: 'Get early access to new game releases',
      points: 800,
      category: 'premium',
      icon: '🔓',
      isAvailable: false
    },
    {
      id: 5,
      title: 'Custom Profile Theme',
      description: 'Personalize your profile with custom themes',
      points: 150,
      category: 'social',
      icon: '🎨',
      isAvailable: true
    },
    {
      id: 6,
      title: 'VIP Support Access',
      description: 'Priority customer support',
      points: 600,
      category: 'premium',
      icon: '💬',
      isAvailable: true
    },
    {
      id: 7,
      title: 'Exclusive Emoji Pack',
      description: 'Special emojis for chat and comments',
      points: 100,
      category: 'social',
      icon: '😀',
      isAvailable: true
    },
    {
      id: 8,
      title: 'Legendary Badge',
      description: 'Show off your achievements with this badge',
      points: 1000,
      category: 'exclusive',
      icon: '🏆',
      isAvailable: false
    }
  ];

  const filteredRewards = selectedCategory === 'all' 
    ? rewards 
    : rewards.filter(reward => reward.category === selectedCategory);

  const handleClaimReward = (rewardId: number) => {
    // Add claim logic here
  };

  const getLevelProgress = () => {
    const currentLevelPoints = (userStats.level - 1) * 300;
    const nextLevelPoints = userStats.level * 300;
    const progress = ((userStats.totalPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;
    return Math.min(progress, 100);
  };

  return (
    <div className="rewards-page">
      <div className="rewards-container">
        {/* Header */}
        <div className="rewards-header">
          <h1 className="rewards-main-title">Rewards & Achievements</h1>
          <p className="rewards-subtitle">Earn points, unlock rewards, and showcase your gaming achievements</p>
        </div>

        {/* User Stats Dashboard */}
        <div className="stats-dashboard">
          <div className="stats-card main-stats">
            <div className="stats-content">
              <div className="points-display">
                <span className="points-number">{userStats.totalPoints.toLocaleString()}</span>
                <span className="points-label">Total Points</span>
              </div>
              <div className="level-info">
                <span className="level-badge">Level {userStats.level}</span>
                <div className="level-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${getLevelProgress()}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {userStats.totalPoints - ((userStats.level - 1) * 300)} / {userStats.level * 300 - ((userStats.level - 1) * 300)} XP
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stats-card">
              <div className="stat-icon">🎮</div>
              <div className="stat-content">
                <span className="stat-number">{userStats.gamesCompleted}</span>
                <span className="stat-label">Games Completed</span>
              </div>
            </div>
            <div className="stats-card">
              <div className="stat-icon">🏆</div>
              <div className="stat-content">
                <span className="stat-number">{userStats.achievements}</span>
                <span className="stat-label">Achievements</span>
              </div>
            </div>
            <div className="stats-card">
              <div className="stat-icon">🔥</div>
              <div className="stat-content">
                <span className="stat-number">{userStats.streak}</span>
                <span className="stat-label">Day Streak</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          {rewardCategories.map((category) => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Rewards Grid */}
        <div className="rewards-grid">
          {filteredRewards.map((reward) => (
            <div key={reward.id} className={`reward-card ${!reward.isAvailable ? 'unavailable' : ''}`}>
              <div className="reward-header">
                <div className="reward-icon">{reward.icon}</div>
                <div className="reward-points">{reward.points} pts</div>
              </div>
              <div className="reward-content">
                <h3 className="reward-title">{reward.title}</h3>
                <p className="reward-description">{reward.description}</p>
                <div className="reward-category">
                  <span className={`category-badge ${reward.category}`}>
                    {rewardCategories.find(cat => cat.id === reward.category)?.name}
                  </span>
                </div>
              </div>
              <div className="reward-footer">
                {reward.isAvailable ? (
                  <button 
                    className="claim-btn"
                    onClick={() => handleClaimReward(reward.id)}
                  >
                    <span>Claim Reward</span>
                    <span className="claim-icon">→</span>
                  </button>
                ) : (
                  <button className="unavailable-btn" disabled>
                    <span>Coming Soon</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Achievement Section */}
        <div className="achievements-section">
          <h2 className="section-title">Recent Achievements</h2>
          <div className="achievements-grid">
            <div className="achievement-card">
              <div className="achievement-icon">🎯</div>
              <div className="achievement-content">
                <h4>Perfect Score</h4>
                <p>Scored 100% in 5 consecutive games</p>
                <span className="achievement-date">2 days ago</span>
              </div>
            </div>
            <div className="achievement-card">
              <div className="achievement-icon">⚡</div>
              <div className="achievement-content">
                <h4>Speed Demon</h4>
                <p>Completed a game in record time</p>
                <span className="achievement-date">1 week ago</span>
              </div>
            </div>
            <div className="achievement-card">
              <div className="achievement-icon">🌟</div>
              <div className="achievement-content">
                <h4>Rising Star</h4>
                <p>Reached level 5 in your first week</p>
                <span className="achievement-date">2 weeks ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardsPage;