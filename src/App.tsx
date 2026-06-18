import { lazy, Suspense, useEffect, useLayoutEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactPage from './pages/ContactPage';
import GalleryPage from './pages/GalleryPage';
import BackToTop from './components/BackToTop';
import LoadingScreen from './components/LoadingScreen';
import CookieConsent, { hasAnalyticsConsent } from './components/CookieConsent';
import { initializeAnalytics, initializeAnalyticsConsent, sendPageView, trackCafeLinkClick } from './lib/analytics';

import './App.css';

const AppToaster = lazy(() => import('./components/AppToaster'));

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

/** Legacy hash anchors → real routes (e.g. /#menu → /menu/) */
const LEGACY_HASH_ROUTES: Record<string, string> = {
  '#menu': '/menu/',
  '#gallery': '/gallery/',
  '#about': '/about/',
  '#contact': '/contact/',
  '#home': '/',
};

/** Redirect old hash URLs to their real route, once, on load. */
function LegacyHashRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    const target = LEGACY_HASH_ROUTES[hash];
    if (target) {
      navigate(target, { replace: true });
    }
  }, [navigate]);

  return null;
}

/** Scroll to top and refresh scroll triggers on every route change. */
function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useLayoutEffect(() => {
    const scrollToPageTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    scrollToPageTop();

    const frameOne = requestAnimationFrame(() => {
      scrollToPageTop();
      requestAnimationFrame(scrollToPageTop);
    });

    const timeout = setTimeout(() => {
      scrollToPageTop();
      ScrollTrigger.refresh();
    }, 300);

    return () => {
      cancelAnimationFrame(frameOne);
      clearTimeout(timeout);
    };
  }, [location.key, location.pathname]);

  return null;
}

function App() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  const [loading, setLoading] = useState(() => isHome && typeof window !== 'undefined' && !window.location.hash);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* Track important cafe actions on existing links */
  useEffect(() => {
    const handleTrackedClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;
      trackCafeLinkClick(anchor);
    };

    document.addEventListener('click', handleTrackedClick);
    return () => document.removeEventListener('click', handleTrackedClick);
  }, []);

  /* Queue default denied consent mode before analytics is accepted */
  useEffect(() => {
    initializeAnalyticsConsent();
  }, []);

  /* GA4 page views, gated by stored analytics consent */
  useEffect(() => {
    if (!hasAnalyticsConsent()) return;
    initializeAnalytics();
    sendPageView();
  }, [location.pathname]);

  return (
    <>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      {mounted && (
        <Suspense fallback={null}>
          <AppToaster />
        </Suspense>
      )}
      <LegacyHashRedirect />
      <ScrollToTop />
      <Navbar forceGlass={!isHome} />
      <main className="relative w-full min-h-screen bg-cream overflow-x-hidden">
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/menu/" element={<MenuPage />} />
            <Route path="/about/" element={<AboutUsPage />} />
            <Route path="/contact/" element={<ContactPage />} />
            <Route path="/gallery/" element={<GalleryPage />} />
            {/* Unknown paths fall back to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <BackToTop />
      {mounted && <CookieConsent />}
    </>
  );
}

export default App;
