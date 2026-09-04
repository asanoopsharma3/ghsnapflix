import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const FIRST_FRAME_SECONDS = 0.35;

const assignVideoSrc = (videoEl: HTMLVideoElement, videoUrl: string) => {
  try {
    const next = new URL(videoUrl).href;
    if (videoEl.src !== next) {
      videoEl.src = videoUrl;
      videoEl.load();
    }
  } catch {
    if (videoEl.getAttribute('src') !== videoUrl) {
      videoEl.src = videoUrl;
      videoEl.load();
    }
  }
};

/**
 * Keep the video src loaded so the first frame is the card thumbnail.
 * Hover plays; leave pauses and returns to that frame (no placeholder clapper).
 */
export const useCardVideoPreview = (videoUrl: string, isPlaying: boolean) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [hasFrame, setHasFrame] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || inView) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '120px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [inView]);

  useLayoutEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl || !videoUrl || !inView) return undefined;

    assignVideoSrc(videoEl, videoUrl);

    const seekToPoster = () => {
      const duration = videoEl.duration;
      const time =
        Number.isFinite(duration) && duration > 0
          ? Math.min(FIRST_FRAME_SECONDS, duration * 0.08)
          : FIRST_FRAME_SECONDS;
      try {
        videoEl.currentTime = time;
      } catch {
        /* ignore seek until data is ready */
      }
    };

    const markFrame = () => {
      setHasFrame(true);
    };

    const onLoadedData = () => {
      seekToPoster();
      if (videoEl.readyState >= 2) {
        markFrame();
      }
    };

    videoEl.addEventListener('loadeddata', onLoadedData);
    videoEl.addEventListener('seeked', markFrame);

    if (videoEl.readyState >= 2) {
      onLoadedData();
    }

    if (isPlaying) {
      const tryPlay = () => {
        videoEl.currentTime = 0;
        videoEl.play().catch(() => {});
      };
      if (videoEl.readyState >= 2) {
        tryPlay();
      } else {
        videoEl.addEventListener('canplay', tryPlay, { once: true });
      }
    } else {
      videoEl.pause();
      if (videoEl.readyState >= 2) {
        seekToPoster();
      }
    }

    return () => {
      videoEl.removeEventListener('loadeddata', onLoadedData);
      videoEl.removeEventListener('seeked', markFrame);
    };
  }, [videoUrl, isPlaying, inView]);

  return { containerRef, videoRef, hasFrame };
};
