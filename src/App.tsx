import { lazy, Suspense, useEffect, useState, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import OurCoffee from './sections/OurCoffee';
import SweetsBrunch from './sections/SweetsBrunch';
import HostEvents from './sections/HostEvents';
import AboutUs from './sections/AboutUs';
import NewsletterCTA from './sections/NewsletterCTA';
import Footer from './sections/Footer';
import ScrollMarquee from './components/ScrollMarquee';
import { Toaster } from 'sonner';
import './App.css';

const MenuPage = lazy(() => import('./pages/MenuPage'));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));

gsap.registerPlugin(ScrollTrigger);

type Page = 'home' | 'menu' | 'about' | 'contact' | 'gallery';

/** Hashes that map to dedicated pages (not home-page sections) */
const PAGE_HASHES: Record<string, Page> = {
  '#menu': 'menu',
  '#about': 'about',
  '#contact': 'contact',
  '#gallery': 'gallery',
};

function App() {
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    const hash = window.location.hash;
    return PAGE_HASHES[hash] ?? 'home';
  });
  const pendingScrollRef = useRef<string | null>(null);

  /* ── Navigate helper ──────────────────────────────────── */
  const navigateTo = useCallback(
    (page: Page, hash: string) => {
      window.history.pushState(null, '', hash);

      if (page !== 'home') {
        setCurrentPage(page);
        window.scrollTo({ top: 0 });
      } else {
        if (currentPage !== 'home') {
          // Switching from sub-page → home: store target, render home first
          pendingScrollRef.current = hash;
          setCurrentPage('home');
        } else {
          // Already on home — just scroll
          const el = document.querySelector(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    [currentPage],
  );

  /* ── Intercept all # link clicks ──────────────────────── */
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;

      e.preventDefault();
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const destPage = PAGE_HASHES[href] ?? 'home';
      navigateTo(destPage, href);
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [navigateTo]);

  /* ── Browser back / forward ───────────────────────────── */
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash;
      const destPage = PAGE_HASHES[hash] ?? 'home';

      if (destPage !== 'home') {
        setCurrentPage(destPage);
        window.scrollTo({ top: 0 });
      } else {
        setCurrentPage('home');
        if (hash) {
          pendingScrollRef.current = hash;
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  /* ── Scroll to pending target after page switch ───────── */
  useEffect(() => {
    if (pendingScrollRef.current && currentPage === 'home') {
      const target = pendingScrollRef.current;
      pendingScrollRef.current = null;

      // Wait for React to render the home sections before scrolling
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const el = document.querySelector(target);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        });
      });
    }
  }, [currentPage]);

  /* ── Refresh ScrollTrigger when page changes ──────────── */
  useEffect(() => {
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 300);
    return () => clearTimeout(timeout);
  }, [currentPage]);

  return (
    <>
      <Toaster position="top-right" richColors />
      <Navbar forceGlass={currentPage !== 'home'} />
      <main className="relative w-full min-h-screen bg-cream overflow-x-hidden">
        <Suspense fallback={null}>
          {currentPage === 'menu' && <MenuPage />}
          {currentPage === 'about' && <AboutUsPage />}
          {currentPage === 'contact' && <ContactPage />}
          {currentPage === 'gallery' && <GalleryPage />}
        </Suspense>
        {currentPage === 'home' && (
          <>
            <Hero />
            <ScrollMarquee direction={-1} />
            <OurCoffee />
            <SweetsBrunch />
            <ScrollMarquee
              direction={1}
              text="SWEETS & PIES  ·  BRUNCH  ·  MEDITERRANEAN  ·  AUTHENTIC RECIPES  ·  BAKED DAILY  ·  "
            />
            <HostEvents />
            <AboutUs />
            <NewsletterCTA />
            <Footer />
          </>
        )}
      </main>
    </>
  );
}

export default App;
