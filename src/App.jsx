import React, { useState, useCallback, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import PostLoginHeader from './components/PostLoginHeader';
import InteractiveCarousel from './components/InteractiveCarousel';
import VideoCategories from './components/GameCategories';
import VideosSection from './components/VideosSection';
import FavoritesSection from './components/FavoritesSection';
import LoginModal from './components/LoginModal';
import RewardsPage from './components/RewardsPage';
import SubscriptionPage from './components/SubscriptionPage';
import NewsPage from './components/NewsPage';
import UnsubscribePage from './components/UnsubscribePage';
import SubscriptionManagementPage from './components/SubscriptionManagementPage';
import VideosPage from './components/VideosPage';
import FavoritesPage from './components/FavoritesPage';
import ExploreVideosPage from './components/ExploreVideosPage';
import VideoPlayerModal from './components/VideoPlayerModal';
import Notification from './components/Notification';
import Footer from './components/Footer';
import AnimeHeader from './components/AnimeHeader/AnimeHeader';
import HeroBanner from './components/HeroBanner/HeroBanner';
import CategoryNav from './components/CategoryNav/CategoryNav';
import VideoSection from './components/VideoSection/VideoSection';
import MembershipBanner from './components/MembershipBanner/MembershipBanner';
import DualPromo from './components/DualPromo/DualPromo';
import ValueProps from './components/ValueProps/ValueProps';
import AnimeFooter from './components/Footer/AnimeFooter';
import LegalSupportModal from './components/LegalSupportModal/LegalSupportModal';
import { FaFire, FaStar } from 'react-icons/fa6';
import {
  TRENDING_ANIME_VIDEOS,
  FEATURED_ANIME_VIDEOS,
} from './config/animeCatalog';
import { TranslationProvider } from './contexts/TranslationContext';
import { AUTH_EXPIRED_EVENT } from './api/axiosClient';
import { NOTIFICATION_MESSAGES } from './constants/notifications';
import {
  activateLocalSubscription,
  INITIAL_OFFER_CODE,
  LOCAL_SUBSCRIPTION_ENABLED,
  normalizeGhanaMsisdn,
  shouldUseHeFlow,
  startCgwByNetwork,
  startHeSubscription,
  subscribeToNetworkFlowChange,
} from './config/subscription';
import { getPlanByOfferCode } from './config/subscriptionPlans';
import {
  clearLoginSession,
  loadAppSession,
  saveAuthToken,
  saveLoginSession,
  saveSubscription,
} from './utils/sessionStorage';
import { fetchSubscriptionStatus } from './services/subscriptionService';
import { resolveCgwCallbackNotice } from './utils/cgwStatus';
import LoadingSpinner from './components/LoadingSpinner';
import { addToWatchHistory } from './utils/watchHistory';

// Security: permanently purge any legacy demo subscription tokens
try {
  localStorage.removeItem('is_demo_subscription');
} catch {}

function AppContent() {
  const [showLoginModal, setShowLoginModal] = useState(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      return p.get('login') === '1' || p.get('page') === 'login';
    } catch {
      return false;
    }
  });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [currentPage, setCurrentPage] = useState(() => {
    try {
      const p = new URLSearchParams(window.location.search).get('page');
      return p || 'home';
    } catch {
      return 'home';
    }
  });
  const [legalModalTab, setLegalModalTab] = useState(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      const legal = p.get('legal');
      const page = p.get('page');
      if (['help', 'terms', 'privacy', 'subscription-policy', 'subscription'].includes(legal)) {
        return legal === 'subscription-policy' ? 'subscription' : legal;
      }
      if (['terms', 'privacy', 'help'].includes(page)) {
        return page;
      }
      return null;
    } catch {
      return null;
    }
  });
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState(null);
  const [currentTheme, setCurrentTheme] = useState('light');
  const [activeVideo, setActiveVideo] = useState(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      const videoParam = p.get('video') || p.get('play');
      if (!videoParam) return null;

      // Security check: only allow immediate playback if user has an active, valid subscription
      const session = loadAppSession();
      if (!session.isLoggedIn || !session.isSubscribed) {
        return null;
      }

      if (videoParam === 'youtube') {
        return {
          id: 'yt-1',
          title: 'Demon Slayer - Official Anime Opening',
          duration: '03:15',
          views: '5.8M',
          timestamp: '3 days ago',
          thumbnail: '/thumbnails/demon_slayer.jpg',
          videoUrl: 'https://www.youtube.com/watch?v=VQGCKyvzIM4',
          category: 'Anime Trailer',
        };
      }
      return {
        id: 'trend-1',
        title: 'The Promise Of Zoro',
        duration: '02:14',
        views: '1.2M',
        timestamp: '2 weeks ago',
        thumbnail: '/thumbnails/zoro.jpg',
        videoUrl: 'https://snapflix-mp4.s3.ap-southeast-2.amazonaws.com/Anime_mp4/108%20-%20The%20Promise%20Of%20Zoro.mp4',
        category: 'Action',
      };
    } catch {
      return null;
    }
  });
  const [pendingVideo, setPendingVideo] = useState(null);
  const [isHandlingCallback, setIsHandlingCallback] = useState(
    window.location.pathname.includes('/activation/callback')
  );
  const [useHeFlow, setUseHeFlow] = useState(() => shouldUseHeFlow());

  // If a video URL query param was visited by an unsubscribed user, prompt login and queue the video
  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      const videoParam = p.get('video') || p.get('play');
      if (videoParam) {
        const session = loadAppSession();
        if (!session.isLoggedIn || !session.isSubscribed) {
          const videoToQueue =
            videoParam === 'youtube'
              ? {
                  id: 'yt-1',
                  title: 'Demon Slayer - Official Anime Opening',
                  duration: '03:15',
                  views: '5.8M',
                  timestamp: '3 days ago',
                  thumbnail: '/thumbnails/demon_slayer.jpg',
                  videoUrl: 'https://www.youtube.com/watch?v=VQGCKyvzIM4',
                  category: 'Anime Trailer',
                }
              : {
                  id: 'trend-1',
                  title: 'The Promise Of Zoro',
                  duration: '02:14',
                  views: '1.2M',
                  timestamp: '2 weeks ago',
                  thumbnail: '/thumbnails/zoro.jpg',
                  videoUrl:
                    'https://snapflix-mp4.s3.ap-southeast-2.amazonaws.com/Anime_mp4/108%20-%20The%20Promise%20Of%20Zoro.mp4',
                  category: 'Action',
                };
          setPendingVideo(videoToQueue);
          setShowLoginModal(true);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    const syncNetworkFlow = () => setUseHeFlow(shouldUseHeFlow());
    syncNetworkFlow();
    return subscribeToNetworkFlowChange(syncNetworkFlow);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isCallback = window.location.pathname.includes('/activation/callback');

    const applySession = (subscribed) => {
      const saved = loadAppSession();
      setPhoneNumber(saved.msisdn);
      setIsLoggedIn(saved.isLoggedIn);
      setIsSubscribed(subscribed ?? saved.isSubscribed);

      if (saved.accessExpired) {
        setShowLoginModal(true);
        setNotification({
          message: NOTIFICATION_MESSAGES.SUBSCRIPTION_EXPIRED,
          type: 'info',
        });
      }
    };

    const handleActivationCallback = async () => {
      const token = params.get('token');
      const notice = resolveCgwCallbackNotice(params);
      const offerCode =
        params.get('offerCode') || localStorage.getItem('offerCode') || INITIAL_OFFER_CODE;
      const msisdn = normalizeGhanaMsisdn(
        params.get('msisdn') || localStorage.getItem('phone') || ''
      );
      const isSuccess = notice.success && Boolean(token);

      window.history.replaceState({}, '', '/');

      if (isSuccess && token) {
        saveAuthToken(token, msisdn);
        if (msisdn) {
          saveLoginSession(msisdn);
          const plan = getPlanByOfferCode(offerCode);
          if (plan) {
            saveSubscription(msisdn, { ...plan, durationDays: 1 });
          }
        }
        localStorage.setItem('offerCode', offerCode);
        applySession(true);
        setCurrentPage('home');
        setNotification({
          message:
            notice.message === 'Success'
              ? NOTIFICATION_MESSAGES.OTP_VERIFIED_SUCCESS
              : notice.message,
          type: notice.type === 'info' ? 'info' : 'success',
        });
        setIsHandlingCallback(false);
        return;
      }

      localStorage.removeItem('payment_done');
      applySession(false);
      setShowLoginModal(true);
      setNotification({
        message: notice.message,
        type: notice.type,
      });
      setIsHandlingCallback(false);
    };

    const syncFromBackend = async () => {
      const saved = loadAppSession();
      applySession();
      if (!localStorage.getItem('token')) {
        return;
      }

      try {
        const subscription = await fetchSubscriptionStatus();
        const active = subscription?.subscriptionStatus === 'active';
        if (!active) {
          clearLoginSession();
          applySession();
          setShowLoginModal(true);
          setNotification({
            message: NOTIFICATION_MESSAGES.SUBSCRIPTION_EXPIRED,
            type: 'info',
          });
          return;
        }
        setIsSubscribed(true);
        if (saved.msisdn) {
          const plan = getPlanByOfferCode(localStorage.getItem('offerCode') || INITIAL_OFFER_CODE);
          if (plan) {
            saveSubscription(saved.msisdn, { ...plan, durationDays: 1 });
          }
        }
      } catch {
        applySession();
      }
    };

    if (isCallback) {
      void handleActivationCallback();
      return;
    }

    void syncFromBackend();
    const intervalId = window.setInterval(() => applySession(), 60 * 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const onUnauthorized = () => {
      clearLoginSession();
      setIsLoggedIn(false);
      setIsSubscribed(false);
      setPhoneNumber('');
      setCurrentPage('home');
      setShowLoginModal(true);
      setNotification({
        message: NOTIFICATION_MESSAGES.SUBSCRIPTION_EXPIRED,
        type: 'info',
      });
    };

    window.addEventListener(AUTH_EXPIRED_EVENT, onUnauthorized);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, onUnauthorized);
  }, []);

  // Secure Video Player: requires valid login AND active subscription
  const handleVideoPlay = useCallback((video) => {
    const saved = loadAppSession();
    setIsLoggedIn(saved.isLoggedIn);
    setIsSubscribed(saved.isSubscribed);

    if (!saved.isLoggedIn || !saved.isSubscribed) {
      setPendingVideo(video);
      setShowLoginModal(true);
      return false;
    }

    setActiveVideo(video);
    addToWatchHistory({
      id: video.id,
      title: video.title,
      videoUrl: video.videoUrl,
      category: video.category || 'Anime',
      thumbnail: video.thumbnail || video.thumbnailUrl,
    });
    return true;
  }, []);

  const handleAnimeVideoPlay = useCallback((item) => {
    handleVideoPlay({
      id: item.id,
      title: item.title,
      videoUrl: item.videoUrl,
      category: item.category || 'Anime',
      thumbnailUrl: item.thumbnail,
    });
  }, [handleVideoPlay]);

  const handleCloseVideoPlayer = useCallback(() => {
    setActiveVideo(null);
  }, []);

  const handleSubscribeSuccess = useCallback((plan) => {
    if (phoneNumber) {
      saveSubscription(phoneNumber, plan);
    }
    setIsSubscribed(true);
    setCurrentPage('home');
  }, [phoneNumber]);

  const handleAlreadySubscribed = useCallback(() => {
    setNotification({
      message: NOTIFICATION_MESSAGES.ALREADY_SUBSCRIBED,
      type: 'info',
    });
  }, []);

  const startCgwForMsisdn = useCallback(async (msisdn) => {
    localStorage.setItem('phone', msisdn);
    localStorage.setItem('offerCode', INITIAL_OFFER_CODE);

    if (LOCAL_SUBSCRIPTION_ENABLED) {
      const result = await activateLocalSubscription(msisdn, INITIAL_OFFER_CODE);
      const params = new URLSearchParams({
        token: result.token,
        status: 'success',
        offerCode: result.offerCode || INITIAL_OFFER_CODE,
        msisdn: result.msisdn || msisdn,
      });
      window.location.href = `/activation/callback?${params.toString()}`;
      return;
    }

    startCgwByNetwork(msisdn, INITIAL_OFFER_CODE);
  }, []);

  const handleLoginSubmit = useCallback(async (msisdn) => {
    if (shouldUseHeFlow()) {
      startHeSubscription(INITIAL_OFFER_CODE);
      return;
    }

    setPhoneNumber(msisdn);
    saveLoginSession(msisdn);
    setIsLoggedIn(true);

    if (!LOCAL_SUBSCRIPTION_ENABLED) {
      startCgwByNetwork(msisdn, INITIAL_OFFER_CODE);
      return;
    }

    try {
      await startCgwForMsisdn(msisdn);
    } catch {
      setShowLoginModal(false);
      setNotification({
        message: NOTIFICATION_MESSAGES.SUBSCRIBE_ERROR,
        type: 'error',
      });
    }
  }, [startCgwForMsisdn]);


  const handleNotify = useCallback((message, type) => {
    setNotification({ message, type });
  }, []);

  const handleCloseModals = useCallback(() => {
    setShowLoginModal(false);
  }, []);

  const handleLogout = useCallback(() => {
    clearLoginSession();
    setIsLoggedIn(false);
    setIsSubscribed(false);
    setPhoneNumber('');
    setCurrentPage('home');
  }, []);

  const handleSubscribeEntry = useCallback(() => {
    const saved = loadAppSession();

    if (saved.isSubscribed) {
      setNotification({
        message: NOTIFICATION_MESSAGES.ALREADY_SUBSCRIBED,
        type: 'info',
      });
      return;
    }

    setShowLoginModal(true);
  }, []);

  const handleNavigate = useCallback((page) => {
    if (page === 'login') {
      setShowLoginModal(true);
      return;
    }

    if (['help', 'terms', 'privacy', 'subscription-policy'].includes(page)) {
      setLegalModalTab(page === 'subscription-policy' ? 'subscription' : page);
      return;
    }

    if (page === 'subscription') {
      handleSubscribeEntry();
      return;
    }

    if (page === 'categories') {
      setCurrentPage('videos');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Protected routes requiring active authentication
    if (['unsubscribe', 'subscription-management'].includes(page)) {
      const session = loadAppSession();
      if (!session.isLoggedIn) {
        setShowLoginModal(true);
        setNotification({
          message: 'Please sign in with your phone number to access this section.',
          type: 'info',
        });
        return;
      }
    }

    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [handleSubscribeEntry]);

  const handleCloseNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const handleThemeChange = useCallback((theme) => {
    setCurrentTheme(theme);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'rewards':
        return <RewardsPage onNavigate={handleNavigate} />;
      case 'subscription':
        return (
          <SubscriptionPage
            msisdn={phoneNumber}
            onSubscribeSuccess={handleSubscribeSuccess}
            onNotify={handleNotify}
          />
        );
      case 'news':
        return <NewsPage />;
      case 'unsubscribe':
        return <UnsubscribePage onNavigate={handleNavigate} onLogout={handleLogout} />;
      case 'subscription-management':
        return (
          <SubscriptionManagementPage
            onNavigate={handleNavigate}
            phoneNumber={phoneNumber}
            isSubscribed={isSubscribed}
            onSubscribeClick={handleSubscribeEntry}
            onNotify={handleNotify}
          />
        );
      case 'videos':
      case 'categories':
      case 'trending':
        return (
          <VideosPage
            onVideoPlay={handleAnimeVideoPlay}
            initialCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        );
      case 'favorites':
        return <FavoritesPage onVideoPlay={handleAnimeVideoPlay} onNavigate={handleNavigate} />;
      case 'explore':
        return <ExploreVideosPage onVideoPlay={handleAnimeVideoPlay} onNavigate={handleNavigate} />;
      case 'home':
      default:
        return (
          <>
            <HeroBanner onVideoPlay={handleAnimeVideoPlay} onNavigate={handleNavigate} />
            <div className="anime-content-canvas">
              <VideoSection
                title="Trending Now"
                subtitle="The most popular anime releases this week"
                icon={<FaFire />}
                videos={TRENDING_ANIME_VIDEOS}
                onViewAll={() => handleNavigate('videos')}
                onVideoPlay={handleAnimeVideoPlay}
              />
              <MembershipBanner onSubscribeClick={handleSubscribeEntry} />
              <VideoSection
                title="Featured Videos"
                subtitle="Handpicked anime series just for you"
                icon={<FaStar />}
                videos={FEATURED_ANIME_VIDEOS}
                onViewAll={() => handleNavigate('videos')}
                onVideoPlay={handleAnimeVideoPlay}
              />
              <DualPromo
                onSelectGenre={(genre) => {
                  setActiveCategory(genre);
                  handleNavigate('videos');
                }}
              />
              <ValueProps />
            </div>
          </>
        );
    }
  };

  if (isHandlingCallback) {
    return (
      <div className="App" data-theme={currentTheme}>
        <LoadingSpinner />
      </div>
    );
  }

  const isFooterView = (() => {
    try {
      return new URLSearchParams(window.location.search).get('view') === 'footer';
    } catch {
      return false;
    }
  })();

  if (isFooterView) {
    return (
      <div style={{ background: '#07080d', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <AnimeFooter onNavigate={handleNavigate} onOpenLegalModal={(t) => setLegalModalTab(t)} />
        {legalModalTab && (
          <LegalSupportModal isOpen={!!legalModalTab} initialTab={legalModalTab} onClose={() => setLegalModalTab(null)} />
        )}
      </div>
    );
  }

  return (
    <div className="App" data-theme={currentTheme}>
      <AnimeHeader
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onSubscribeClick={handleSubscribeEntry}
        onLoginClick={() => setShowLoginModal(true)}
        isLoggedIn={isLoggedIn}
        isSubscribed={isSubscribed}
        onSearch={(query) => {
          setSearchQuery(query);
          handleNavigate('videos');
        }}
      />
      
      {renderPage()}
      
      <AnimeFooter
        onNavigate={handleNavigate}
        onOpenLegalModal={(tab) => setLegalModalTab(tab)}
      />
      
      {legalModalTab && (
        <LegalSupportModal
          isOpen={!!legalModalTab}
          initialTab={legalModalTab}
          onClose={() => setLegalModalTab(null)}
        />
      )}
      
      {showLoginModal && (
        <LoginModal
          hidePhoneInput={useHeFlow}
          onSubmit={handleLoginSubmit}
          onNotify={handleNotify}
          onClose={handleCloseModals}
        />
      )}
      
      {activeVideo && (
        <VideoPlayerModal video={activeVideo} onClose={handleCloseVideoPlayer} />
      )}

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleCloseNotification}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <TranslationProvider>
      <AppContent />
    </TranslationProvider>
  );
}

