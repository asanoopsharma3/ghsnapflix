export interface PlayableVideo {
  title: string;
  videoUrl: string;
}

export type VideoPlayHandler = (video: PlayableVideo) => boolean;
