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
import ProfilePage from './components/ProfilePage';
import SubscriptionPage from './components/SubscriptionPage';
import NewsPage from './components/NewsPage';
import UnsubscribePage from './components/UnsubscribePage';
import SubscriptionManagementPage from './components/SubscriptionManagementPage';
import VideosPage from './components/VideosPage';
import FavoritesPage from './components/FavoritesPage';
import ExploreVideosPage from './components/ExploreVideosPage';
import FAQPage from './components/FAQPage';
import AboutPage from './components/AboutPage';
import VideoPlayerModal from './components/VideoPlayerModal';
import Notification from './components/Notification';
import ThemeToggle from './components/ThemeToggle';
import FloatingActionButton from './components/FloatingActionButton';
import Footer from './components/Footer';
import { TranslationProvider } from './contexts/TranslationContext';
import { AUTH_EXPIRED_EVENT } from './api/axiosClient';
import { NOTIFICATION_MESSAGES, NotificationType } from './constants/notifications';
import {
  activateLocalSubscription,
  INITIAL_OFFER_CODE,
  LOCAL_SUBSCRIPTION_ENABLED,
  normalizeGhanaMsisdn,
  shouldUseHeFlow,
  startCgwByNetwork,
  startHeSubscription,
} from './config/subscription';
import { getPlanByOfferCode, SubscriptionPlanConfig } from './config/subscriptionPlans';
import {
  clearLoginSession,
  loadAppSession,
  saveAuthToken,
  saveLoginSession,
  saveSubscription,
} from './utils/sessionStorage';
import { fetchSubscriptionStatus } from './services/subscriptionService';
import { PlayableVideo } from './types/video';
import LoadingSpinner from './components/LoadingSpinner';

type Page = 'home' | 'rewards' | 'profile' | 'subscription' | 'news' | 'unsubscribe' | 'subscription-management' | 'videos' | 'favorites' | 'explore' | 'faq' | 'about';

function AppContent() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('dark');
  const [activeVideo, setActiveVideo] = useState<PlayableVideo | null>(null);
  const [isHandlingCallback, setIsHandlingCallback] = useState(
    window.location.pathname.includes('/activation/callback')
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isCallback = window.location.pathname.includes('/activation/callback');

    const applySession = (subscribed?: boolean) => {
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
      const status = (params.get('status') || '').toLowerCase();
      const reason =
        params.get('reason') ||
        params.get('message') ||
        'We could not complete your subscription.';
      const offerCode =
        params.get('offerCode') || localStorage.getItem('offerCode') || INITIAL_OFFER_CODE;
      const msisdn = normalizeGhanaMsisdn(
        params.get('msisdn') || localStorage.getItem('phone') || ''
      );
      const isSuccess =
        status === 'success' ||
        status === 'successful' ||
        params.get('success') === 'true' ||
        params.get('subscribed') === 'true';

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
          message: NOTIFICATION_MESSAGES.OTP_VERIFIED_SUCCESS,
          type: 'success',
        });
        setIsHandlingCallback(false);
        return;
      }

      localStorage.removeItem('payment_done');
      applySession(false);
      setShowLoginModal(true);
      setNotification({
        message: reason,
        type: 'error',
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

  const handleVideoPlay = useCallback((video: PlayableVideo): boolean => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return false;
    }

    const saved = loadAppSession();
    setIsSubscribed(saved.isSubscribed);

    if (!saved.isSubscribed) {
      setShowLoginModal(true);
      return false;
    }

    setActiveVideo(video);
    return true;
  }, [isLoggedIn]);

  const handleCloseVideoPlayer = useCallback(() => {
    setActiveVideo(null);
  }, []);

  const handleSubscribeSuccess = useCallback((plan: SubscriptionPlanConfig) => {
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

  const startCgwForMsisdn = useCallback(async (msisdn: string) => {
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

  const handleLoginSubmit = useCallback(async (msisdn: string) => {
    if (shouldUseHeFlow()) {
      startHeSubscription(INITIAL_OFFER_CODE);
      return;
    }

    setPhoneNumber(msisdn);
    saveLoginSession(msisdn);
    setIsLoggedIn(true);

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

  const handleNotify = useCallback((message: string, type: NotificationType) => {
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

  const handleNavigate = useCallback((page: string) => {
    if (page === 'login') {
      setShowLoginModal(true);
      return;
    }

    if (page === 'subscription') {
      handleSubscribeEntry();
      return;
    }

    setCurrentPage(page as Page);
  }, [handleSubscribeEntry]);

  const handleCloseNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const handleThemeChange = useCallback((theme: 'light' | 'dark') => {
    setCurrentTheme(theme);
  }, []);

  const handleQuickAction = useCallback(() => {
    setNotification({
      message: 'Quick action activated! ⚡',
      type: 'info'
    });
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'rewards':
        return <RewardsPage />;
      case 'profile':
        return <ProfilePage />;
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
        return <SubscriptionManagementPage onNavigate={handleNavigate} />;
      case 'videos':
        return <VideosPage onVideoPlay={handleVideoPlay} />;
      case 'favorites':
        return <FavoritesPage onVideoPlay={handleVideoPlay} />;
      case 'explore':
        return <ExploreVideosPage />;
      case 'faq':
        return <FAQPage />;
      case 'about':
        return <AboutPage />;
      default:
        return (
          <>
            <InteractiveCarousel onVideoPlay={handleVideoPlay} />
            <FavoritesSection onVideoPlay={handleVideoPlay} onNavigate={handleNavigate} />
            <VideoCategories onVideoPlay={handleVideoPlay} onNavigate={handleNavigate} />
            <VideosSection />
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

  return (
    <div className="App" data-theme={currentTheme}>
      {/* Particle background disabled for performance - was causing crashes */}
      {/* <SimpleParticleBackground /> */}
      
      {isLoggedIn ? (
        <PostLoginHeader 
          onLogout={handleLogout} 
          onNavigate={handleNavigate}
          currentPage={currentPage}
          isSubscribed={isSubscribed}
          onAlreadySubscribed={handleAlreadySubscribed}
          onSubscribeClick={handleSubscribeEntry}
        />
      ) : (
        <Header 
          onNavigate={handleNavigate}
          currentPage={currentPage}
          onSubscribeClick={handleSubscribeEntry}
        />
      )}
      
      
      {renderPage()}
      
      <Footer />
      
      {showLoginModal && (
        <LoginModal
          hidePhoneInput={shouldUseHeFlow()}
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
      
      <ThemeToggle onThemeChange={handleThemeChange} />
      <FloatingActionButton onQuickAction={handleQuickAction} />
    </div>
  );
}

function App() {
  return (
    <TranslationProvider>
      <AppContent />
    </TranslationProvider>
  );
}

export default App;