import { SNAPFLIX_S3_VIDEO_URLS } from './snapflixVideoUrls.js';

export const ANIME_THUMBNAILS_COLLECTION = [
  '/thumbnails/zoro.jpg',
  '/thumbnails/jinwoo.jpg',
  '/thumbnails/naruto.jpg',
  '/thumbnails/gojo.jpg',
  '/thumbnails/danger_heart.jpg',
  '/thumbnails/jjk.jpg',
  '/thumbnails/luffy.jpg',
  '/thumbnails/tunnel_summer.jpg',
  '/thumbnails/cyberpunk.jpg',
  '/thumbnails/eren_aot.jpg',
  '/thumbnails/bluelock.jpg',
  '/thumbnails/demon_slayer.jpg',
  '/thumbnails/vinland.jpg',
];

export const getMatchingAnimeThumbnail = (title = '', fallbackIndex = 0) => {
  const t = title.toLowerCase();
  if (t.includes('zoro') || t.includes('swordsman')) return '/thumbnails/zoro.jpg';
  if (t.includes('jin woo') || t.includes('jinwoo') || t.includes('solo leveling') || t.includes('thomas andre') || t.includes('sung')) return '/thumbnails/jinwoo.jpg';
  if (t.includes('naruto') || t.includes('orochimaru') || t.includes('sasuke') || t.includes('hinata')) return '/thumbnails/naruto.jpg';
  if (t.includes('gojo') || t.includes('satoro') || t.includes('satao')) return '/thumbnails/gojo.jpg';
  if (t.includes('jujutsu') || t.includes('sukuna') || t.includes('jjk')) return '/thumbnails/jjk.jpg';
  if (t.includes('danger in my heart') || t.includes('dangers in my heart')) return '/thumbnails/danger_heart.jpg';
  if (
    t.includes('luffy') ||
    t.includes('onepiece') ||
    t.includes('one piece') ||
    t.includes('roger') ||
    t.includes('garp') ||
    t.includes('sanji') ||
    t.includes('marineford') ||
    t.includes('imu')
  ) {
    return '/thumbnails/luffy.jpg';
  }
  if (t.includes('tunnel to summer') || t.includes('tunnel')) return '/thumbnails/tunnel_summer.jpg';
  if (t.includes('somebody watching me') || t.includes('cyberpunk') || t.includes('lone wolf')) return '/thumbnails/cyberpunk.jpg';
  if (t.includes('titan') || t.includes('eren') || t.includes('erin')) return '/thumbnails/eren_aot.jpg';
  if (t.includes('blue lock')) return '/thumbnails/bluelock.jpg';
  if (t.includes('demon slayer') || t.includes('demon slayed') || t.includes('slayer')) return '/thumbnails/demon_slayer.jpg';
  if (t.includes('vinland')) return '/thumbnails/vinland.jpg';

  return ANIME_THUMBNAILS_COLLECTION[fallbackIndex % ANIME_THUMBNAILS_COLLECTION.length];
};

export const findS3Url = (substring, fallbackIndex = 0) => {
  if (!substring) return SNAPFLIX_S3_VIDEO_URLS[fallbackIndex] || '';
  const normQuery = substring.toLowerCase().replace(/[^a-z0-9]/g, '');
  const found = SNAPFLIX_S3_VIDEO_URLS.find((url) => {
    const decoded = decodeURIComponent(url).toLowerCase().replace(/[^a-z0-9]/g, '');
    return decoded.includes(normQuery);
  });
  return found || SNAPFLIX_S3_VIDEO_URLS[fallbackIndex] || '';
};

export const TRENDING_ANIME_VIDEOS = [
  {
    id: 'trend-1',
    title: 'The Promise Of Zoro',
    duration: '02:14',
    views: '1.2M',
    timestamp: '2 weeks ago',
    thumbnail: '/thumbnails/zoro.jpg',
    videoUrl: findS3Url('108 - The Promise Of Zoro'),
    category: 'Action',
  },
  {
    id: 'trend-2',
    title: 'Sung Jin Woo Aura',
    duration: '01:56',
    views: '896K',
    timestamp: '1 month ago',
    thumbnail: '/thumbnails/jinwoo.jpg',
    videoUrl: findS3Url('11 - Sung Jin Woo Aura'),
    category: 'Action',
  },
  {
    id: 'trend-3',
    title: 'The Tale Of Naruto Uzumaki',
    duration: '03:21',
    views: '2.4M',
    timestamp: '3 weeks ago',
    thumbnail: '/thumbnails/naruto.jpg',
    videoUrl: findS3Url('110 - The Tale Of Naruto Uzumaki'),
    category: 'Adventure',
  },
  {
    id: 'trend-4',
    title: 'Gojo The Strongest',
    duration: '01:45',
    views: '1.7M',
    timestamp: '1 month ago',
    thumbnail: '/thumbnails/gojo.jpg',
    videoUrl: findS3Url('129 - Satoro Gojo Edit'),
    category: 'Fighting',
  },
];

export const FEATURED_ANIME_VIDEOS = [
  {
    id: 'feat-1',
    title: 'The Danger In My Heart',
    duration: '02:10',
    views: '1.3M',
    timestamp: '2 weeks ago',
    thumbnail: '/thumbnails/danger_heart.jpg',
    videoUrl: findS3Url('14 - The Danger In My Heart'),
    isFeatured: true,
    category: 'Romance',
  },
  {
    id: 'feat-2',
    title: 'Jujutsu Kaisen Best Scene',
    duration: '02:08',
    views: '2.8M',
    timestamp: '1 month ago',
    thumbnail: '/thumbnails/jjk.jpg',
    videoUrl: findS3Url('144 - Jujutsu Kaisen Best Scene'),
    isFeatured: true,
    category: 'Fighting',
  },
  {
    id: 'feat-3',
    title: 'Luffy In Skypiea',
    duration: '01:35',
    views: '1.9M',
    timestamp: '2 weeks ago',
    thumbnail: '/thumbnails/luffy.jpg',
    videoUrl: findS3Url('143 - Luffy In Skypia'),
    isFeatured: true,
    category: 'Adventure',
  },
  {
    id: 'feat-4',
    title: 'Solo Leveling Badass Moment',
    duration: '02:26',
    views: '2.1M',
    timestamp: '1 month ago',
    thumbnail: '/thumbnails/jinwoo.jpg',
    videoUrl: findS3Url('173 - Solo Leveling Badass Moment'),
    isFeatured: true,
    category: 'Action',
  },
];

export const RECENT_ANIME_VIDEOS = [
  {
    id: 'rec-1',
    title: 'The Tunnel To Summer',
    duration: '01:52',
    views: '620K',
    timestamp: '1 month ago',
    thumbnail: '/thumbnails/tunnel_summer.jpg',
    videoUrl: findS3Url('123. - The Tunnel To Summer'),
    category: 'Sci-Fi',
  },
  {
    id: 'rec-2',
    title: 'Somebody Watching Me',
    duration: '02:49',
    views: '448K',
    timestamp: '3 weeks ago',
    thumbnail: '/thumbnails/cyberpunk.jpg',
    videoUrl: findS3Url('117 - Somebody Watching Me Edit'),
    category: 'Thriller',
  },
  {
    id: 'rec-3',
    title: 'Attack On Titan Epic Fight',
    duration: '02:15',
    views: '2.3M',
    timestamp: '1 month ago',
    thumbnail: '/thumbnails/eren_aot.jpg',
    videoUrl: findS3Url('142 - Attack On Titan Fight Edit'),
    category: 'Action',
  },
  {
    id: 'rec-4',
    title: 'Blue Lock Aura',
    duration: '01:36',
    views: '1.4M',
    timestamp: '1 month ago',
    thumbnail: '/thumbnails/bluelock.jpg',
    videoUrl: findS3Url('12 - Blue Lock Aura'),
    category: 'Action',
  },
];
