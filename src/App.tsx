import React, { useState, useCallback, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import PostLoginHeader from './components/PostLoginHeader';
import HeroSection from './components/HeroSection';
import InteractiveCarousel from './components/InteractiveCarousel';
import VideoCategories from './components/GameCategories';
import VideosSection from './components/VideosSection';
import FavoritesSection from './components/FavoritesSection';
import LoginModal from './components/LoginModal';
import OTPModal from './components/OTPModal';
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
import ParticleBackground from './components/ParticleBackground';
import SimpleParticleBackground from './components/SimpleParticleBackground';
import FloatingActionButton from './components/FloatingActionButton';
import Footer from './components/Footer';
import { TranslationProvider } from './contexts/TranslationContext';
import { SendOtpResponse } from './types/auth';
import { NOTIFICATION_MESSAGES, NotificationType } from './constants/notifications';
import {
  clearLoginSession,
  loadAppSession,
  saveLoginSession,
  saveSubscription,
} from './utils/sessionStorage';
import { SubscriptionPlanConfig } from './config/subscriptionPlans';
import { PlayableVideo } from './types/video';

type Page = 'home' | 'rewards' | 'profile' | 'subscription' | 'news' | 'unsubscribe' | 'subscription-management' | 'videos' | 'favorites' | 'explore' | 'faq' | 'about';

function AppContent() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSession, setOtpSession] = useState<SendOtpResponse | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('dark');
  const [activeVideo, setActiveVideo] = useState<PlayableVideo | null>(null);

  useEffect(() => {
    const syncSession = () => {
      const saved = loadAppSession();
      setPhoneNumber(saved.msisdn);
      setIsLoggedIn(saved.isLoggedIn);
      setIsSubscribed(saved.isSubscribed);
    };

    syncSession();

    const intervalId = window.setInterval(syncSession, 60 * 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  const handleVideoPlay = useCallback((video: PlayableVideo): boolean => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return false;
    }

    const saved = loadAppSession();
    setIsSubscribed(saved.isSubscribed);

    if (!saved.isSubscribed) {
      setCurrentPage('subscription');
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

  const handleLoginSubmit = useCallback((msisdn: string, otpResponse: SendOtpResponse) => {
    setPhoneNumber(msisdn);
    setOtpSession(otpResponse);
    setShowLoginModal(false);
    setShowOTPModal(true);
    setNotification({
      message: NOTIFICATION_MESSAGES.OTP_SENT_SUCCESS,
      type: 'success',
    });
  }, []);

  const handleNotify = useCallback((message: string, type: NotificationType) => {
    setNotification({ message, type });
  }, []);

  const handleOTPVerify = useCallback(() => {
    setShowOTPModal(false);
    setIsLoggedIn(true);
    saveLoginSession(phoneNumber);

    const saved = loadAppSession();
    setIsSubscribed(saved.isSubscribed);

    setCurrentPage(saved.isSubscribed ? 'home' : 'subscription');
    setNotification({
      message: NOTIFICATION_MESSAGES.OTP_VERIFIED_SUCCESS,
      type: 'success',
    });
  }, [phoneNumber]);

  const handleOTPBack = useCallback(() => {
    setShowOTPModal(false);
    setShowLoginModal(true);
  }, []);

  const handleCloseModals = useCallback(() => {
    setShowLoginModal(false);
    setShowOTPModal(false);
  }, []);

  const handleLogout = useCallback(() => {
    clearLoginSession();
    setIsLoggedIn(false);
    setIsSubscribed(false);
    setPhoneNumber('');
    setOtpSession(null);
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

    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    setCurrentPage('subscription');
  }, [isLoggedIn]);

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
          onSubmit={handleLoginSubmit}
          onNotify={handleNotify}
          onClose={handleCloseModals}
        />
      )}
      
      {showOTPModal && (
        <OTPModal 
          phoneNumber={phoneNumber}
          otpSession={otpSession}
          onVerify={handleOTPVerify}
          onBack={handleOTPBack}
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