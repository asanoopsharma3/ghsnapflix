import { useEffect, useRef, useState } from 'react';

const MAX_CONCURRENT_POSTERS = 2;
const POSTER_MIN_SECONDS = 2.4;

type PosterJob = () => Promise<void>;

let activePosterJobs = 0;
const posterQueue: PosterJob[] = [];

const runPosterQueue = () => {
  while (activePosterJobs < MAX_CONCURRENT_POSTERS && posterQueue.length > 0) {
    const job = posterQueue.shift();
    if (!job) return;
    activePosterJobs += 1;
    job()
      .catch(() => undefined)
      .finally(() => {
        activePosterJobs -= 1;
        runPosterQueue();
      });
  }
};

const enqueuePosterJob = (job: PosterJob): void => {
  posterQueue.push(job);
  runPosterQueue();
};

const posterTimeForDuration = (duration: number): number => {
  if (!Number.isFinite(duration) || duration <= 0) {
    return POSTER_MIN_SECONDS;
  }
  const laterFrame = Math.max(POSTER_MIN_SECONDS, duration * 0.3);
  return Math.min(laterFrame, Math.max(0.2, duration - 0.2));
};

const waitForEvent = (
  videoEl: HTMLVideoElement,
  eventName: string,
  timeoutMs: number
): Promise<boolean> =>
  new Promise((resolve) => {
    let settled = false;

    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      videoEl.removeEventListener(eventName, onOk);
      videoEl.removeEventListener('error', onErr);
      resolve(ok);
    };

    const onOk = () => finish(true);
    const onErr = () => finish(false);
    const timer = window.setTimeout(() => finish(false), timeoutMs);

    if (eventName === 'loadedmetadata' && videoEl.readyState >= 1) {
      finish(true);
      return;
    }

    videoEl.addEventListener(eventName, onOk, { once: true });
    videoEl.addEventListener('error', onErr, { once: true });
  });

const seekTo = (videoEl: HTMLVideoElement, time: number): Promise<void> =>
  new Promise((resolve) => {
    if (videoEl.readyState < 1) {
      resolve();
      return;
    }

    const finish = () => {
      window.clearTimeout(timer);
      videoEl.removeEventListener('seeked', onSeeked);
      resolve();
    };

    const onSeeked = () => finish();
    const timer = window.setTimeout(finish, 4000);

    videoEl.addEventListener('seeked', onSeeked, { once: true });
    try {
      videoEl.currentTime = time;
    } catch {
      finish();
    }
  });

/**
 * Queue in-view cards and freeze a later frame. Timeouts never throw.
 */
export const useCardVideoPreview = (videoUrl: string, isHoverPlaying: boolean) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const posterTimeRef = useRef(POSTER_MIN_SECONDS);
  const [inView, setInView] = useState(false);
  const [hasFrame, setHasFrame] = useState(false);

  useEffect(() => {
    setHasFrame(false);
    posterTimeRef.current = POSTER_MIN_SECONDS;
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
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [inView]);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl || !videoUrl || !inView) return undefined;

    let cancelled = false;

    const paintPoster = async () => {
      if (cancelled) return;

      try {
        videoEl.preload = 'metadata';
        videoEl.muted = true;
        videoEl.defaultMuted = true;
        videoEl.playsInline = true;

        if (videoEl.getAttribute('src') !== videoUrl && videoEl.src !== videoUrl) {
          videoEl.src = videoUrl;
          videoEl.load();
        }

        const ready = await waitForEvent(videoEl, 'loadedmetadata', 8000);
        if (cancelled) return;

        if (ready && videoEl.readyState >= 1) {
          const time = posterTimeForDuration(videoEl.duration);
          posterTimeRef.current = time;
          await seekTo(videoEl, time);
          if (cancelled) return;
          videoEl.pause();
        }

        if (!cancelled) {
          setHasFrame(true);
        }
      } catch {
        if (!cancelled) {
          setHasFrame(true);
        }
      }
    };

    enqueuePosterJob(paintPoster);

    return () => {
      cancelled = true;
    };
  }, [videoUrl, inView]);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl || !inView) return undefined;

    if (isHoverPlaying) {
      const playPreview = () => {
        videoEl.currentTime = 0;
        videoEl.play().catch(() => undefined);
      };
      if (videoEl.readyState >= 2) {
        playPreview();
      } else {
        videoEl.addEventListener('canplay', playPreview, { once: true });
        return () => videoEl.removeEventListener('canplay', playPreview);
      }
      return undefined;
    }

    videoEl.pause();
    if (videoEl.readyState >= 1 && hasFrame) {
      try {
        videoEl.currentTime = posterTimeRef.current;
      } catch {
        /* keep last painted frame */
      }
    }
    return undefined;
  }, [isHoverPlaying, inView, hasFrame]);

  return { containerRef, videoRef, hasFrame };
};
