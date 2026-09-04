import { useEffect, useRef, useState } from 'react';

const PREVIEW_PLAY_MS = 2000;

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
 * When the card is on screen, play ~2s muted then pause on the last frame
 * so the card is never a blank box. Hover continues playback.
 */
export const useCardVideoPreview = (videoUrl: string, isHoverPlaying: boolean) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const burstDoneRef = useRef(false);
  const [inView, setInView] = useState(false);
  const [hasFrame, setHasFrame] = useState(false);

  useEffect(() => {
    burstDoneRef.current = false;
    setHasFrame(false);
  }, [videoUrl]);

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
      { rootMargin: '160px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [inView]);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl || !videoUrl || !inView) return undefined;

    assignVideoSrc(videoEl, videoUrl);
    videoEl.muted = true;
    videoEl.defaultMuted = true;
    videoEl.playsInline = true;

    let cancelled = false;
    let stopTimer: ReturnType<typeof setTimeout> | undefined;

    const markFrame = () => {
      if (!cancelled) {
        setHasFrame(true);
      }
    };

    const playBurstThenPause = () => {
      if (cancelled || isHoverPlaying || burstDoneRef.current) {
        markFrame();
        return;
      }

      const finishBurst = () => {
        burstDoneRef.current = true;
        if (!cancelled && !isHoverPlaying) {
          videoEl.pause();
        }
      };

      const playPromise = videoEl.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            markFrame();
            stopTimer = setTimeout(finishBurst, PREVIEW_PLAY_MS);
          })
          .catch(() => {
            burstDoneRef.current = true;
            markFrame();
          });
      } else {
        markFrame();
        stopTimer = setTimeout(finishBurst, PREVIEW_PLAY_MS);
      }
    };

    const onReady = () => {
      markFrame();
      if (isHoverPlaying) {
        videoEl.play().catch(() => {});
        return;
      }
      if (burstDoneRef.current) {
        videoEl.pause();
        return;
      }
      playBurstThenPause();
    };

    if (isHoverPlaying) {
      if (stopTimer) {
        clearTimeout(stopTimer);
      }
      markFrame();
      if (videoEl.readyState >= 2) {
        videoEl.play().catch(() => {});
      } else {
        videoEl.addEventListener('canplay', onReady, { once: true });
      }
    } else if (burstDoneRef.current) {
      videoEl.pause();
      markFrame();
    } else if (videoEl.readyState >= 2) {
      onReady();
    } else {
      videoEl.addEventListener('loadeddata', onReady, { once: true });
      videoEl.addEventListener('canplay', onReady, { once: true });
    }

    videoEl.addEventListener('playing', markFrame);

    return () => {
      cancelled = true;
      if (stopTimer) {
        clearTimeout(stopTimer);
      }
      videoEl.removeEventListener('playing', markFrame);
    };
  }, [videoUrl, isHoverPlaying, inView]);

  return { containerRef, videoRef, hasFrame };
};
