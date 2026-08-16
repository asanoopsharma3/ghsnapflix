import { useState, useEffect, useRef } from 'react';
import { getVideoThumbnail } from '../utils/videoThumbnailGenerator';

// Global queue to limit concurrent thumbnail generation
let activeThumbnailGenerations = 0;
const MAX_CONCURRENT_THUMBNAILS = 2;
const thumbnailQueue: Array<() => void> = [];

const processThumbnailQueue = () => {
  if (activeThumbnailGenerations < MAX_CONCURRENT_THUMBNAILS && thumbnailQueue.length > 0) {
    activeThumbnailGenerations++;
    const next = thumbnailQueue.shift();
    if (next) {
      next();
    }
  }
};

/**
 * React hook to generate and use video thumbnails
 * Heavily optimized to prevent crashes - limits concurrent generations
 */
export const useVideoThumbnail = (videoUrl: string | undefined): string | null => {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!videoUrl) {
      setThumbnail(null);
      return;
    }

    let cancelled = false;

    // Check cache first
    const cacheKey = `thumbnail_${videoUrl}_1`;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        setThumbnail(cached);
        return;
      }
    } catch (e) {
      // localStorage might be unavailable
    }

    // Queue thumbnail generation to limit concurrent operations
    const generateThumbnail = async () => {
      if (cancelled || !mountedRef.current) {
        activeThumbnailGenerations--;
        processThumbnailQueue();
        return;
      }

      try {
        const thumb = await getVideoThumbnail(videoUrl, 1);
        if (!cancelled && mountedRef.current) {
          setThumbnail(thumb);
          // Cache it
          try {
            localStorage.setItem(cacheKey, thumb);
          } catch (e) {
            // localStorage might be full
          }
        }
      } catch (error) {
        // Silently fail
      } finally {
        activeThumbnailGenerations--;
        processThumbnailQueue();
      }
    };

    // Add to queue with delay
    const timeoutId = setTimeout(() => {
      if (!cancelled && mountedRef.current) {
        thumbnailQueue.push(generateThumbnail);
        processThumbnailQueue();
      }
    }, 500); // Longer delay to reduce load

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [videoUrl]);

  return thumbnail;
};

