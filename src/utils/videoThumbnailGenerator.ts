/**
 * Video Thumbnail Generator
 * Generates thumbnails from video URLs (Google Drive videos)
 */

/**
 * Generate a thumbnail from a video file
 * @param videoUrl - URL to the video file (Google Drive direct URL)
 * @param timeInSeconds - Time in seconds to capture the thumbnail (default: 1 second)
 * @returns Promise<string> - Base64 encoded thumbnail image
 */
export const generateVideoThumbnail = (
  videoUrl: string,
  timeInSeconds: number = 1
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    video.crossOrigin = 'anonymous';
    video.preload = 'metadata';
    
    // Add timeout - reduced for better performance
    const timeout = setTimeout(() => {
      video.src = '';
      video.load();
      reject(new Error('Thumbnail generation timeout'));
    }, 10000); // 10 seconds timeout

    video.onloadedmetadata = () => {
      clearTimeout(timeout);
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth || 800;
      canvas.height = video.videoHeight || 450;

      // Set video time to capture frame
      const seekTime = video.duration > 0 ? Math.min(timeInSeconds, video.duration * 0.1) : timeInSeconds;
      video.currentTime = seekTime;
    };

    video.onseeked = () => {
      try {
        clearTimeout(timeout);
        // Draw the video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to base64 image
        const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
        resolve(thumbnail);
        
        // Cleanup
        video.src = '';
        video.load();
      } catch (error) {
        clearTimeout(timeout);
        reject(error);
      }
    };

    video.onerror = (error) => {
      clearTimeout(timeout);
      video.src = '';
      video.load();
      reject(new Error(`Failed to load video for thumbnail: ${videoUrl}`));
    };

    // Load the video
    video.src = videoUrl;
    video.load();
  });
};

/**
 * Get video thumbnail (with caching)
 */
const thumbnailCache: Map<string, string> = new Map();

export const getVideoThumbnail = async (
  videoUrl: string,
  timeInSeconds: number = 1
): Promise<string> => {
  const cacheKey = `${videoUrl}_${timeInSeconds}`;
  
  // Check memory cache
  if (thumbnailCache.has(cacheKey)) {
    return thumbnailCache.get(cacheKey)!;
  }

  // Check localStorage cache
  try {
    const cached = localStorage.getItem(`thumbnail_${cacheKey}`);
    if (cached) {
      thumbnailCache.set(cacheKey, cached);
      return cached;
    }
  } catch (e) {
    // localStorage might not be available
  }

  try {
    // Generate thumbnail
    const thumbnail = await generateVideoThumbnail(videoUrl, timeInSeconds);
    
    // Cache it
    thumbnailCache.set(cacheKey, thumbnail);
    try {
      localStorage.setItem(`thumbnail_${cacheKey}`, thumbnail);
    } catch (e) {
      // localStorage might be full or unavailable
    }
    
    return thumbnail;
  } catch (error) {
    console.error('Failed to generate thumbnail:', error);
    // Return a placeholder
    return getPlaceholderThumbnail();
  }
};

/**
 * Get a placeholder thumbnail
 */
const getPlaceholderThumbnail = (): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 450;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    // Dark gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1a1a1a');
    gradient.addColorStop(1, '#2d2d2d');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Play icon
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(350, 150);
    ctx.lineTo(350, 300);
    ctx.lineTo(450, 225);
    ctx.closePath();
    ctx.fill();
  }
  
  return canvas.toDataURL('image/jpeg', 0.8);
};

