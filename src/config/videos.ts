/**
 * Video source configuration – GHSnapflix S3 MP4 library.
 * URLs are defined in snapflixVideoUrls.ts (proper encoding for spaces in filenames).
 *
 * If a link downloads or won’t play: set S3 metadata Content-Disposition = inline,
 * Content-Type = video/mp4 (or video/quicktime for .mov). See S3_VIDEO_SETUP.md.
 */
import { SNAPFLIX_S3_VIDEO_URLS } from './snapflixVideoUrls';

export const VIDEOS_CONFIG: {
  s3VideoUrls: string[];
} = {
  s3VideoUrls: SNAPFLIX_S3_VIDEO_URLS,
};
