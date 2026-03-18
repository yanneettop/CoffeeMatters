import { lazy, Suspense, useEffect, useState, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import SignatureSection from './sections/SignatureSection';
import OurCoffee from './sections/OurCoffee';
import SweetsBrunch from './sections/SweetsBrunch';
import HostEvents from './sections/HostEvents';
import AboutUs from './sections/AboutUs';
import NewsletterCTA from './sections/NewsletterCTA';
import GoogleReviews from './sections/GoogleReviews';
import Footer from './sections/Footer';
import ScrollMarquee from './components/ScrollMarquee';
import BackToTop from './components/BackToTop';
import LoadingScreen from './components/LoadingScreen';

import { Toaster } from 'sonner';
import './App.css';

const MenuPage = lazy(() => import('./pages/MenuPage'));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

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
  const [loading, setLoading] = useState(() => {
    // Only show loader on initial home page load
    const hash = window.location.hash;
    return !hash || hash === '#home';
  });
  const pendingScrollRef = useRef<string | null>(null);
  const transitionRef = useRef<HTMLDivElement>(null);
  const isTransitioning = useRef(false);

  /* ── Page transition animation ─────────────────────────── */
  const transitionTo = useCallback(
    (page: Page, hash: string) => {
      if (isTransitioning.current) return;
      isTransitioning.current = true;

      const overlay = transitionRef.current;
      if (!overlay) {
        // Fallback: no animation
        window.history.pushState(null, '', hash);
        setCurrentPage(page);
        window.scrollTo({ top: 0 });
        isTransitioning.current = false;
        return;
      }

      // Phase 1: fade in overlay
      gsap.to(overlay, {
        opacity: 1,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: () => {
          // Switch page while overlay covers screen
          window.history.pushState(null, '', hash);
          window.scrollTo({ top: 0 });

          if (page === 'home' && hash !== '#home') {
            pendingScrollRef.current = hash;
          }
          setCurrentPage(page);

          // Phase 2: fade out overlay after a brief pause
          requestAnimationFrame(() => {
            gsap.to(overlay, {
              opacity: 0,
              duration: 0.4,
              delay: 0.1,
              ease: 'power2.out',
              onComplete: () => {
                isTransitioning.current = false;
              },
            });
          });
        },
      });
    },
    [],
  );

  /* ── Navigate helper ──────────────────────────────────── */
  const navigateTo = useCallback(
    (page: Page, hash: string) => {
      if (page !== 'home') {
        // Page switch → use transition
        if (currentPage !== page) {
          transitionTo(page, hash);
        }
      } else {
        if (currentPage !== 'home') {
          // Sub-page → home: use transition
          transitionTo('home', hash);
        } else {
          // Already on home — just smooth scroll
          const el = document.querySelector(hash);
          if (el) {
            gsap.to(window, {
              scrollTo: { y: el, offsetY: 0 },
              duration: 1,
              ease: 'power3.inOut',
            });
          }
        }
      }
    },
    [currentPage, transitionTo],
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

      // Animate page transition for back/forward
      const overlay = transitionRef.current;
      if (overlay && destPage !== currentPage) {
        gsap.to(overlay, {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            window.scrollTo({ top: 0 });
            if (destPage === 'home' && hash) {
              pendingScrollRef.current = hash;
            }
            setCurrentPage(destPage);
            requestAnimationFrame(() => {
              gsap.to(overlay, {
                opacity: 0,
                duration: 0.35,
                delay: 0.1,
                ease: 'power2.out',
              });
            });
          },
        });
      } else {
        setCurrentPage(destPage);
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

  /* ── Global subtle parallax drift on all sections ──────── */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (currentPage !== 'home') return;
    if (window.innerWidth < 1024) return; // Skip on mobile/tablet — too expensive

    let ctx: gsap.Context | null = null;

    const timeout = setTimeout(() => {
      ctx = gsap.context(() => {
        // Apply upward drift to each section — they start slightly below and float up
        const sections = document.querySelectorAll('main section');

        sections.forEach((section) => {
          // Skip hero — has its own parallax
          if (section.id === 'home') return;

          gsap.fromTo(section,
            { y: 120 },
            {
              y: -60,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
              },
            }
          );
        });
      });
    }, 600);

    return () => {
      clearTimeout(timeout);
      ctx?.revert();
    };
  }, [currentPage]);

  return (
    <>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      <Toaster position="top-right" richColors />
      <Navbar forceGlass={currentPage !== 'home'} />
      {/* Page transition overlay */}
      <div
        ref={transitionRef}
        className="fixed inset-0 z-[999] pointer-events-none bg-[#1a1a1a]"
        style={{ opacity: 0 }}
      />
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
            <SignatureSection />
            <div className="hidden lg:block"><ScrollMarquee direction={-1} /></div>
            <OurCoffee />
            <SweetsBrunch />
            <div className="hidden lg:block"><ScrollMarquee
              direction={1}
              text="SWEETS & PIES  ·  BRUNCH  ·  MEDITERRANEAN  ·  AUTHENTIC RECIPES  ·  BAKED DAILY  ·  "
            /></div>
            <HostEvents />
            <AboutUs />
            <GoogleReviews />
            <NewsletterCTA />
            <Footer />
          </>
        )}
      </main>
      <BackToTop />
    </>
  );
}

export default App;
