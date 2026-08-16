import React from 'react';
import './VideosSection.css';
import { useTranslation } from '../contexts/TranslationContext';
import { allVideos, getVideoUrl, getVideoMimeType } from '../utils/localVideos';

const HOME_PREVIEW_COUNT = 9;

const VideosSection: React.FC = () => {
  const { t } = useTranslation();
  const preview = allVideos.slice(0, HOME_PREVIEW_COUNT);

  return (
    <div className="videos-section">
      <div className="videos-container">
        <h2 className="videos-title">{t('homepage.videos.title')}</h2>
        <div className="videos-content">
          <p className="videos-description">
            {t('homepage.videos.subtitle')}
          </p>
          <div className="videos-grid">
            {preview.map((v) => {
              const url = getVideoUrl(v.videoPath);
              return (
                <div key={v.id} className="home-video-card">
                  <div className="home-video-wrap">
                    <video
                      className="home-video-preview"
                      src={url}
                      muted
                      playsInline
                      loop
                      autoPlay
                      preload="metadata"
                    >
                      <source src={url} type={getVideoMimeType(url)} />
                    </video>
                  </div>
                  <h3 className="home-video-title">{v.name}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideosSection;
