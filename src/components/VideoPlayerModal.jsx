import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import './VideoPlayerModal.css';
import { getVideoMimeType } from '../utils/localVideos';
import { useFavorites } from '../hooks/useFavorites';
import {
  FaHeart,
  FaRegHeart,
  FaXmark,
  FaArrowLeft,
  FaRotateRight,
  FaTriangleExclamation,
  FaFilm,
  FaExpand,
  FaCompress,
  FaPlay,
  FaPause,
  FaVolumeHigh,
  FaVolumeLow,
  FaVolumeXmark,
  FaArrowRotateLeft,
  FaArrowRotateRight,
} from 'react-icons/fa6';

/**
 * Intelligent parser to detect whether the video source is:
 * 1. An iframe embed (YouTube, Vimeo, raw iframe tag, embed URL)
 * 2. A direct HTML5 video stream (MP4, WebM, MOV, S3 link)
 */
function parseVideoSource(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { type: 'unknown', url: '' };
  }

  const trimmed = rawUrl.trim();

  // 1. Raw <iframe> tag string: <iframe ... src="..." ...>
  if (trimmed.startsWith('<iframe') || trimmed.includes('<iframe')) {
    const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      return { type: 'iframe', url: srcMatch[1] };
    }
  }

  // 2. YouTube URLs:
  const ytRegex = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
  const ytMatch = trimmed.match(ytRegex);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'iframe',
      url: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,
      platform: 'youtube',
    };
  }

  // 3. Vimeo URLs:
  const vimeoRegex = /(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)([0-9]+)/i;
  const vimeoMatch = trimmed.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    return {
      type: 'iframe',
      url: `https://player.vimeo.com/video/${videoId}?autoplay=1&playsinline=1`,
      platform: 'vimeo',
    };
  }

  // 4. Other Embed / Iframe URLs
  if (trimmed.includes('/embed/') || trimmed.includes('player.')) {
    return { type: 'iframe', url: trimmed, platform: 'embed' };
  }

  // 5. Standard Direct Video File (.mp4, .webm, .mov, S3 streaming bucket)
  return { type: 'video', url: trimmed, platform: 'native' };
}

/**
 * Helper to format seconds into mm:ss
 */
function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

const VideoPlayerModal = ({ video, onClose }) => {
  const videoRef = useRef(null);
  const stageRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const splashTimerRef = useRef(null);

  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Orientation & Auto-Adjust state: default to 270deg if explicitly flagged
  const initialShouldAuto = Boolean(video?.autoAdjust || video?.isSideways);
  const [rotation, setRotation] = useState(() => (initialShouldAuto ? 270 : 0));
  const [isAutoAdjusted, setIsAutoAdjusted] = useState(() => initialShouldAuto);

  // Fullscreen & Mobile View states
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobileLandscape, setIsMobileLandscape] = useState(false);

  // Playback & Controls states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [centerSplash, setCenterSplash] = useState(null);

  const { isFavorite, toggleFavorite } = useFavorites();
  const videoKey = video?.title || video?.name || video?.id || '';
  const isFavorited = isFavorite(videoKey);

  const sourceInfo = useMemo(() => {
    return parseVideoSource(video?.videoUrl || video?.url || '');
  }, [video]);

  // Reset states when video source changes
  useEffect(() => {
    const shouldAuto = Boolean(video?.autoAdjust || video?.isSideways);
    setRotation(shouldAuto ? 270 : 0);
    setIsAutoAdjusted(shouldAuto);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setBuffered(0);
    setIsMobileLandscape(false);
    setCenterSplash(null);
    setShowControls(true);
    setHasError(false);
    setIsLoading(true);
  }, [video?.videoUrl, video?.url, video?.autoAdjust, video?.isSideways]);

  // Splash indicator for play/pause
  const triggerSplash = (type) => {
    setCenterSplash(type);
    if (splashTimerRef.current) clearTimeout(splashTimerRef.current);
    splashTimerRef.current = setTimeout(() => setCenterSplash(null), 600);
  };

  // Auto-hide controls during playback
  const resetControlsTimeout = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    } else {
      resetControlsTimeout();
    }
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying, resetControlsTimeout]);

  // Transform style for video / iframe rotation
  // When rotated 90°/270° inside a 16:9 stage, scale by 16/9 (1.77778) to completely fill landscape display
  const rotationStyle = useMemo(() => {
    if (rotation === 0) {
      return {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
      };
    }
    const isRotated90 = rotation % 180 !== 0;
    const scale = isRotated90 ? 1.777778 : 1;
    return {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      transform: `rotate(${rotation}deg) scale(${scale})`,
      transformOrigin: 'center center',
      transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
    };
  }, [rotation]);

  // Sync fullscreen state
  useEffect(() => {
    const handleFsChange = () => {
      const fs = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
      setIsFullscreen(fs);
      if (!fs) {
        setIsMobileLandscape(false);
        try {
          window.screen?.orientation?.unlock?.();
        } catch {}
      }
    };

    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  const handleRotate = (e) => {
    if (e) e.stopPropagation();
    setIsAutoAdjusted(false);
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleToggleFullscreen = async (e) => {
    if (e) e.stopPropagation();
    const isMobile = window.innerWidth <= 768;
    const target = stageRef.current || document.documentElement;
    const currentlyFs = Boolean(document.fullscreenElement || document.webkitFullscreenElement);

    if (!currentlyFs) {
      if (isMobile) {
        setIsMobileLandscape((prev) => !prev);
        try {
          if (window.screen?.orientation?.lock) {
            await window.screen.orientation.lock('landscape');
          }
        } catch {}

        if (sourceInfo.type === 'video' && videoRef.current?.webkitEnterFullscreen) {
          try {
            videoRef.current.webkitEnterFullscreen();
            return;
          } catch {}
        }
      }

      try {
        if (target.requestFullscreen) {
          await target.requestFullscreen();
        } else if (target.webkitRequestFullscreen) {
          await target.webkitRequestFullscreen();
        } else if (videoRef.current?.requestFullscreen) {
          await videoRef.current.requestFullscreen();
        }
      } catch (err) {
        console.warn('Fullscreen request failed:', err);
      }
    } else {
      if (isMobile) {
        setIsMobileLandscape(false);
        try {
          window.screen?.orientation?.unlock?.();
        } catch {}
      }
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        }
      } catch (err) {
        console.warn('Exit fullscreen failed:', err);
      }
    }
  };

  // Play / Pause toggle
  const togglePlay = (e) => {
    if (e) e.stopPropagation();
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      el.play().catch(() => {});
      triggerSplash('play');
    } else {
      el.pause();
      triggerSplash('pause');
    }
  };

  // Seek skip +/- 10s
  const handleSkip = (seconds, e) => {
    if (e) e.stopPropagation();
    const el = videoRef.current;
    if (!el) return;
    const target = Math.max(0, Math.min(duration || 0, el.currentTime + seconds));
    el.currentTime = target;
    setCurrentTime(target);
    resetControlsTimeout();
  };

  // Timeline scrubber click / drag
  const handleSeek = (e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    if (videoRef.current && duration > 0) {
      const targetTime = pct * duration;
      videoRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
      resetControlsTimeout();
    }
  };

  // Volume slider
  const handleVolumeChange = (e) => {
    e.stopPropagation();
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
    resetControlsTimeout();
  };

  // Mute / Unmute toggle
  const handleToggleMute = (e) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
      if (!nextMuted && volume === 0) {
        setVolume(0.8);
        videoRef.current.volume = 0.8;
      }
    }
    resetControlsTimeout();
  };

  // Detect vertical / sideways video when metadata loads
  const handleLoadedMetadata = (e) => {
    setIsLoading(false);
    const el = e.currentTarget;
    if (!el) return;
    if (el.duration) setDuration(el.duration);
    const vw = el.videoWidth;
    const vh = el.videoHeight;
    // If video is vertical (e.g. 9:16 AMVs where width < height), auto-adjust to 270deg (upright)
    if (vw > 0 && vh > 0 && vw < vh) {
      setRotation(270);
      setIsAutoAdjusted(true);
    }
  };

  // Track playback time & buffering
  const handleTimeUpdate = (e) => {
    const el = e.currentTarget;
    if (!el) return;
    setCurrentTime(el.currentTime);
    if (el.buffered && el.buffered.length > 0) {
      try {
        setBuffered(el.buffered.end(el.buffered.length - 1));
      } catch {}
    }
  };

  // Keyboard shortcuts listener
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (isFullscreen) {
          handleToggleFullscreen();
        } else {
          onClose();
        }
      } else if (event.key === ' ' && sourceInfo.type === 'video') {
        if (event.target.tagName !== 'BUTTON' && event.target.tagName !== 'INPUT') {
          event.preventDefault();
          togglePlay();
        }
      } else if (event.key === 'r' || event.key === 'R') {
        if (event.target.tagName !== 'BUTTON' && event.target.tagName !== 'INPUT') {
          event.preventDefault();
          handleRotate();
        }
      } else if (event.key === 'f' || event.key === 'F') {
        if (event.target.tagName !== 'BUTTON' && event.target.tagName !== 'INPUT') {
          event.preventDefault();
          handleToggleFullscreen();
        }
      } else if (event.key === 'm' || event.key === 'M') {
        if (event.target.tagName !== 'BUTTON' && event.target.tagName !== 'INPUT') {
          event.preventDefault();
          handleToggleMute();
        }
      } else if (event.key === 'ArrowLeft' && sourceInfo.type === 'video') {
        event.preventDefault();
        handleSkip(-10);
      } else if (event.key === 'ArrowRight' && sourceInfo.type === 'video') {
        event.preventDefault();
        handleSkip(10);
      } else if (event.key === 'ArrowUp' && sourceInfo.type === 'video') {
        event.preventDefault();
        const nextVol = Math.min(1, volume + 0.1);
        setVolume(nextVol);
        if (videoRef.current) videoRef.current.volume = nextVol;
      } else if (event.key === 'ArrowDown' && sourceInfo.type === 'video') {
        event.preventDefault();
        const nextVol = Math.max(0, volume - 0.1);
        setVolume(nextVol);
        if (videoRef.current) videoRef.current.volume = nextVol;
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, sourceInfo.type, isFullscreen, volume, isMuted, duration]);

  // Autoplay native video on mount or URL change
  useEffect(() => {
    setHasError(false);
    setIsLoading(true);

    if (sourceInfo.type === 'video') {
      const el = videoRef.current;
      if (!el) return;
      el.currentTime = 0;
      const playPromise = el.play();
      if (playPromise) {
        playPromise
          .then(() => {
            setIsLoading(false);
            setIsPlaying(true);
          })
          .catch(() => {
            setIsLoading(false);
            setIsPlaying(false);
          });
      }
    } else {
      const timer = setTimeout(() => setIsLoading(false), 600);
      return () => clearTimeout(timer);
    }
  }, [sourceInfo]);

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    if (sourceInfo.type === 'video' && videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <div
      className="video-player-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={video?.title || 'Video Player'}
    >
      <div
        className={`video-player-modal ${isFullscreen ? 'is-fullscreen' : ''} ${
          isMobileLandscape ? 'is-mobile-landscape' : ''
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <header className="video-player-header">
          {/* Mobile Back / Close Button */}
          <button
            type="button"
            className="mobile-back-btn"
            onClick={onClose}
            aria-label="Back to videos"
            title="Close video"
          >
            <FaArrowLeft />
          </button>

          {/* Left: Category Badge & Title */}
          <div className="header-meta-left">
            {video?.category && (
              <span className="player-category-pill">
                <FaFilm className="pill-icon" />
                {video.category}
              </span>
            )}
            <h2 className="video-player-title" title={video?.title}>
              {video?.title || 'Anime Video'}
            </h2>
          </div>

          {/* Right: Rotate Screen, Fullscreen/Expand, Favorite & Close */}
          <div className="header-actions-right">
            {/* Rotate Screen Button - Available on both Window & Mobile */}
            <button
              type="button"
              className={`player-rotate-btn ${rotation !== 0 ? 'is-rotated' : ''}`}
              onClick={handleRotate}
              title={
                rotation !== 0
                  ? `Rotated ${rotation}°. Click to rotate further (Shortcut: R)`
                  : 'Rotate video 90° to Landscape (Shortcut: R)'
              }
              aria-label="Rotate screen"
            >
              <FaRotateRight
                className="rotate-icon"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: 'transform 0.3s ease',
                }}
              />
              <span className="rotate-label">
                {isAutoAdjusted && rotation === 270 ? 'Auto Landscape' : rotation !== 0 ? `${rotation}°` : 'Rotate'}
              </span>
            </button>

            {/* Expand / Fullscreen Button - Spans across full display landscape */}
            <button
              type="button"
              className={`player-expand-btn ${isFullscreen ? 'is-active' : ''}`}
              onClick={handleToggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen (F)' : 'Expand Fullscreen Landscape (F)'}
              aria-label="Toggle Fullscreen Landscape"
            >
              {isFullscreen ? <FaCompress className="expand-icon" /> : <FaExpand className="expand-icon" />}
              <span className="expand-label">{isFullscreen ? 'Exit' : 'Expand'}</span>
            </button>

            <button
              type="button"
              className={`player-fav-btn ${isFavorited ? 'is-favorited' : ''}`}
              onClick={() => toggleFavorite(video)}
              title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorited ? <FaHeart className="fav-icon" /> : <FaRegHeart className="fav-icon" />}
              <span className="fav-label">{isFavorited ? 'Favorited' : 'Favorite'}</span>
            </button>

            <button
              type="button"
              className="desktop-close-btn"
              onClick={onClose}
              aria-label="Close video player"
              title="Close (Esc)"
            >
              <FaXmark />
            </button>
          </div>
        </header>

        {/* Video Stage Frame (16:9 Responsive Container for both Video & Iframe) */}
        <div
          className="video-player-stage"
          ref={stageRef}
          onClick={sourceInfo.type === 'video' ? togglePlay : undefined}
          onMouseMove={resetControlsTimeout}
          onTouchStart={resetControlsTimeout}
        >
          {/* Loading Spinner */}
          {isLoading && !hasError && (
            <div className="stage-loading-overlay">
              <div className="stage-spinner" />
              <span className="stage-loading-text">Loading stream...</span>
            </div>
          )}

          {/* Error State */}
          {hasError && (
            <div className="stage-error-overlay" onClick={(e) => e.stopPropagation()}>
              <FaTriangleExclamation className="error-icon" />
              <h3>Unable to Play Video</h3>
              <p>The video format or stream could not be loaded at this time.</p>
              <div className="error-actions">
                <button type="button" className="btn-error-retry" onClick={handleRetry}>
                  <FaRotateRight /> Retry
                </button>
                <button type="button" className="btn-error-close" onClick={onClose}>
                  Close
                </button>
              </div>
            </div>
          )}

          {/* 1. Iframe Embed (YouTube, Vimeo, Embed URL) */}
          {sourceInfo.type === 'iframe' && (
            <iframe
              className="video-player-iframe"
              src={sourceInfo.url}
              title={video?.title || 'Video Player'}
              frameBorder="0"
              style={rotationStyle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onLoad={() => setIsLoading(false)}
            />
          )}

          {/* 2. Direct HTML5 Video (.mp4, .webm, .mov, S3 streaming URL) */}
          {sourceInfo.type === 'video' && (
            <video
              ref={videoRef}
              key={sourceInfo.url}
              className="video-player-element"
              src={sourceInfo.url}
              style={rotationStyle}
              playsInline
              autoPlay
              preload="auto"
              poster={video?.thumbnail || video?.thumbnailUrl || undefined}
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              onLoadedData={() => setIsLoading(false)}
              onWaiting={() => setIsLoading(true)}
              onPlaying={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
            >
              <source src={sourceInfo.url} type={getVideoMimeType(sourceInfo.url)} />
              Your browser does not support HTML5 video streaming.
            </video>
          )}

          {/* Center Play/Pause Animated Splash Indicator */}
          {centerSplash && (
            <div className={`center-play-splash ${centerSplash}`}>
              {centerSplash === 'play' ? <FaPlay /> : <FaPause />}
            </div>
          )}

          {/* Custom Player Controls Bar - Stays in NORMAL horizontal position at the bottom */}
          {sourceInfo.type === 'video' && !hasError && (
            <div
              className={`custom-player-controls ${showControls || !isPlaying ? 'is-visible' : 'is-hidden'}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Interactive Timeline Scrubber Slider */}
              <div
                className="timeline-slider-wrapper"
                onClick={handleSeek}
                role="slider"
                aria-label="Seek time"
                aria-valuemin="0"
                aria-valuemax={duration || 0}
                aria-valuenow={currentTime}
              >
                <div className="timeline-track">
                  <div
                    className="timeline-buffered"
                    style={{ width: `${duration > 0 ? (buffered / duration) * 100 : 0}%` }}
                  />
                  <div
                    className="timeline-played"
                    style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                  >
                    <span className="timeline-scrubber-thumb" />
                  </div>
                </div>
              </div>

              {/* Controls Bar Row: Play/Pause, Skip, Volume, Time, Rotate, Fullscreen */}
              <div className="controls-row">
                <div className="controls-left">
                  {/* Play / Pause Toggle */}
                  <button
                    type="button"
                    className="ctrl-btn ctrl-play-btn"
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                    title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                  >
                    {isPlaying ? <FaPause /> : <FaPlay />}
                  </button>

                  {/* 10s Rewind */}
                  <button
                    type="button"
                    className="ctrl-btn ctrl-skip-btn"
                    onClick={(e) => handleSkip(-10, e)}
                    aria-label="Rewind 10 seconds"
                    title="Rewind 10s (Left Arrow)"
                  >
                    <FaArrowRotateLeft />
                    <span className="skip-sec">10</span>
                  </button>

                  {/* 10s Forward */}
                  <button
                    type="button"
                    className="ctrl-btn ctrl-skip-btn"
                    onClick={(e) => handleSkip(10, e)}
                    aria-label="Forward 10 seconds"
                    title="Forward 10s (Right Arrow)"
                  >
                    <FaArrowRotateRight />
                    <span className="skip-sec">10</span>
                  </button>

                  {/* Volume Control Group */}
                  <div className="volume-control-group">
                    <button
                      type="button"
                      className="ctrl-btn ctrl-volume-btn"
                      onClick={handleToggleMute}
                      aria-label={isMuted || volume === 0 ? 'Unmute' : 'Mute'}
                      title={isMuted || volume === 0 ? 'Unmute (M)' : 'Mute (M)'}
                    >
                      {isMuted || volume === 0 ? (
                        <FaVolumeXmark />
                      ) : volume < 0.5 ? (
                        <FaVolumeLow />
                      ) : (
                        <FaVolumeHigh />
                      )}
                    </button>
                    <input
                      type="range"
                      className="volume-slider"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      aria-label="Volume"
                    />
                  </div>

                  {/* Formatted Time Readout */}
                  <span className="time-readout">
                    <span className="current-time">{formatTime(currentTime)}</span>
                    <span className="time-sep">/</span>
                    <span className="total-time">{formatTime(duration)}</span>
                  </span>
                </div>

                <div className="controls-right">
                  {/* Rotate / Orientation Override */}
                  <button
                    type="button"
                    className={`ctrl-btn ctrl-rotate-btn ${rotation !== 0 ? 'active' : ''}`}
                    onClick={handleRotate}
                    title={`Orientation: ${rotation}°. Click to cycle (Shortcut: R)`}
                    aria-label="Rotate video"
                  >
                    <FaRotateRight />
                    <span className="rotate-btn-badge">
                      {isAutoAdjusted && rotation === 270 ? 'AUTO 16:9' : `${rotation}°`}
                    </span>
                  </button>

                  {/* Fullscreen Landscape Toggle */}
                  <button
                    type="button"
                    className="ctrl-btn ctrl-expand-btn"
                    onClick={handleToggleFullscreen}
                    aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Landscape'}
                    title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen Landscape (F)'}
                  >
                    {isFullscreen ? <FaCompress /> : <FaExpand />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Meta Bar (Views, Timestamp, Duration, Brand tag) */}
        <footer className="video-player-footer">
          <div className="footer-info-meta">
            {video?.views && <span className="meta-views">👁 {video.views} views</span>}
            {video?.views && video?.timestamp && <span className="meta-dot">•</span>}
            {video?.timestamp && <span className="meta-time">{video.timestamp}</span>}
            {video?.duration && (video?.views || video?.timestamp) && <span className="meta-dot">•</span>}
            {video?.duration && <span className="meta-dur">⏱ {video.duration}</span>}
          </div>

          <div className="footer-brand-badge">
            <span className="brand-dot" />
            <span className="brand-name">GHSNAPFLIX PLAYER</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default VideoPlayerModal;
