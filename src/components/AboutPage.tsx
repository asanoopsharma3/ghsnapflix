import React from 'react';
import './AboutPage.css';
import { useTranslation } from '../contexts/TranslationContext';

const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
      bio: 'Gaming industry veteran with 15+ years experience'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      bio: 'Tech innovator passionate about cloud gaming'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Content',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
      bio: 'Creative visionary behind our exclusive games'
    },
    {
      name: 'David Park',
      role: 'Lead Developer',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
      bio: 'Full-stack developer with gaming expertise'
    }
  ];

  const milestones = [
    {
      year: '2020',
      title: 'Company Founded',
      description: 'GHSnapflix was born from a vision to revolutionize gaming'
    },
    {
      year: '2021',
      title: 'First 1M Users',
      description: 'Reached our first million registered users milestone'
    },
    {
      year: '2022',
      title: 'Cloud Gaming Launch',
      description: 'Introduced cutting-edge cloud gaming technology'
    },
    {
      year: '2023',
      title: 'Global Expansion',
      description: 'Expanded to 50+ countries worldwide'
    },
    {
      year: '2024',
      title: 'AI Integration',
      description: 'Launched AI-powered game recommendations'
    }
  ];

  const values = [
    {
      icon: '🎮',
      title: 'Gaming First',
      description: 'We put gamers at the center of everything we do'
    },
    {
      icon: '🚀',
      title: 'Innovation',
      description: 'Constantly pushing the boundaries of what\'s possible'
    },
    {
      icon: '🌍',
      title: 'Accessibility',
      description: 'Making gaming accessible to everyone, everywhere'
    },
    {
      icon: '🤝',
      title: 'Community',
      description: 'Building connections between gamers worldwide'
    }
  ];

  const stats = [
    { number: '10M+', label: 'Active Users' },
    { number: '50K+', label: 'Games Available' },
    { number: '180+', label: 'Countries' },
    { number: '99.9%', label: 'Uptime' }
  ];

  return (
    <div className="about-page">
      <div className="about-container">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">About GHSnapflix</h1>
            <p className="hero-subtitle">
              We're revolutionizing the gaming industry with innovative cloud technology, 
              exclusive content, and an unparalleled gaming experience for millions worldwide.
            </p>
          </div>
          <div className="hero-stats">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <span className="stat-number">{stat.number}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Section */}
        <div className="mission-section">
          <div className="section-content">
            <h2 className="section-title">Our Mission</h2>
            <p className="section-description">
              At GHSnapflix, we believe gaming should be accessible to everyone, everywhere. 
              Our mission is to break down barriers and create a seamless gaming experience 
              that connects players across the globe through cutting-edge cloud technology 
              and an ever-expanding library of amazing games.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="values-section">
          <h2 className="section-title">Our Values</h2>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">{value.icon}</div>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-description">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Section */}
        <div className="timeline-section">
          <h2 className="section-title">Our Journey</h2>
          <div className="timeline">
            {milestones.map((milestone, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <div className="timeline-year">{milestone.year}</div>
                  <h3 className="timeline-title">{milestone.title}</h3>
                  <p className="timeline-description">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        {/* <div className="team-section">
          <h2 className="section-title">Meet Our Team</h2>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-image-container">
                  <img src={member.image} alt={member.name} className="team-image" />
                  <div className="team-overlay">
                    <p className="team-bio">{member.bio}</p>
                  </div>
                </div>
                <div className="team-info">
                  <h3 className="team-name">{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div> */}

        {/* Technology Section */}
        <div className="technology-section">
          <div className="tech-content">
            <div className="tech-text">
              <h2 className="section-title">Cutting-Edge Technology</h2>
              <p className="section-description">
                We leverage the latest in cloud computing, AI, and streaming technology 
                to deliver low-latency gaming experiences. Our proprietary compression 
                algorithms and global CDN ensure smooth gameplay regardless of your location.
              </p>
              <div className="tech-features">
                <div className="tech-feature">
                  <span className="tech-icon">☁️</span>
                  <span>Cloud Gaming Infrastructure</span>
                </div>
                <div className="tech-feature">
                  <span className="tech-icon">🤖</span>
                  <span>AI-Powered Recommendations</span>
                </div>
                <div className="tech-feature">
                  <span className="tech-icon">🌐</span>
                  <span>Global Content Delivery</span>
                </div>
                <div className="tech-feature">
                  <span className="tech-icon">🔒</span>
                  <span>Enterprise-Grade Security</span>
                </div>
              </div>
            </div>
            <div className="tech-visual">
              <div className="tech-animation">
                <div className="floating-element element-1">🎮</div>
                <div className="floating-element element-2">⚡</div>
                <div className="floating-element element-3">🌟</div>
                <div className="floating-element element-4">🚀</div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="contact-section">
          <div className="contact-card">
            <h2 className="contact-title">Get in Touch</h2>
            <p className="contact-description">
              Have questions or want to partner with us? We'd love to hear from you!
            </p>
            <div className="contact-methods">
              <a href="mailto:hello@ghsnapflix.com" className="contact-method">
                <span className="contact-icon">📧</span>
                <span>hello@ghsnapflix.com</span>
              </a>
              <a href="tel:+1234567890" className="contact-method">
                <span className="contact-icon">📞</span>
                <span>+1 (234) 567-8900</span>
              </a>
              <a href="#" className="contact-method">
                <span className="contact-icon">📍</span>
                <span>San Francisco, CA</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
