import React, { useEffect, useRef } from 'react';
import './VideoPlayerModal.css';
import { PlayableVideo } from '../types/video';
import { getVideoMimeType } from '../utils/localVideos';

interface VideoPlayerModalProps {
  video: PlayableVideo;
  onClose: () => void;
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ video, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) {
      return;
    }

    el.currentTime = 0;
    const playPromise = el.play();
    if (playPromise) {
      playPromise.catch(() => {});
    }
  }, [video.videoUrl]);

  return (
    <div className="video-player-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="video-player-modal" onClick={(e) => e.stopPropagation()}>
        <button className="video-player-close" onClick={onClose} type="button" aria-label="Close">
          ×
        </button>

        <div className="video-player-header">
          <h2 className="video-player-title">{video.title}</h2>
        </div>

        <div className="video-player-stage">
          <video
            ref={videoRef}
            key={video.videoUrl}
            className="video-player-element"
            src={video.videoUrl}
            controls
            playsInline
            autoPlay
            preload="auto"
          >
            <source src={video.videoUrl} type={getVideoMimeType(video.videoUrl)} />
          </video>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerModal;
