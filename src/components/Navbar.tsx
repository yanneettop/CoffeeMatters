import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Home', to: '/' },
  { name: 'Menu', to: '/menu/' },
  { name: 'Gallery', to: '/gallery/' },
  { name: 'About us', to: '/about/' },
  { name: 'Contact', to: '/contact/' },
];

const DIRECTIONS_URL = 'https://maps.google.com/?q=Coffee+Matters+London+Brick+Lane';

interface NavbarProps {
  /** When true, nav starts with glass style (no transparent hero behind it) */
  forceGlass?: boolean;
  /** Element id for pages that should start transparent over a dark hero */
  transparentHeroId?: string;
}

export default function Navbar({ forceGlass = false, transparentHeroId = 'home' }: NavbarProps) {
  const navRef = useRef<HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const { pathname } = useLocation();
  const showSolidNav = forceGlass || navScrolled || mobileMenuOpen;

  // Scroll-based glassmorphism (only on home page where the transparent hero sits behind the nav)
  useEffect(() => {
    if (forceGlass) {
      return;
    }

    const resetFrame = window.requestAnimationFrame(() => setNavScrolled(false));

    const hero = document.getElementById(transparentHeroId);
    if (!hero) {
      return () => window.cancelAnimationFrame(resetFrame);
    }

    const trigger = ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      end: '20% top',
      onUpdate: (self) => {
        setNavScrolled(self.progress > 0.5);
      },
    });

    return () => {
      window.cancelAnimationFrame(resetFrame);
      trigger.kill();
    };
  }, [forceGlass, transparentHeroId]);

  // GSAP entrance animation (once on mount)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!navRef.current) return;

    gsap.fromTo(
      navRef.current,
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, delay: 0.3, ease: 'expo.out' },
    );
  }, []);

  // Close mobile menu on any link click
  const handleLinkClick = (to?: string) => {
    if (to && to === pathname) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-500 ${
        showSolidNav
          ? 'border-[var(--sandstone)]/55 bg-[var(--cream)]/90 py-2 shadow-[0_12px_34px_rgba(43,38,35,0.08)] backdrop-blur-md lg:py-2.5'
          : 'border-transparent bg-transparent py-3 lg:py-4'
      }`}
    >
      <div className="section-padding grid grid-cols-[auto_auto] items-center justify-between lg:grid-cols-[minmax(160px,1fr)_auto_minmax(160px,1fr)]">
        {/* Logo */}
        <Link
          to="/"
          aria-label="Coffee Matters London — home"
          className="group relative transition-transform duration-300 hover:scale-105 h-10 lg:h-11 xl:h-12"
        >
          <img
            src="/responsive/minimal-logowhite-400.webp"
            srcSet="/responsive/minimal-logowhite-400.webp 400w, /responsive/minimal-logowhite-800.webp 800w, /responsive/minimal-logowhite-1200.webp 1200w"
            sizes="(max-width: 768px) 40px, 48px"
            alt="Coffee Matters"
            width={403}
            height={403}
            loading="eager"
            decoding="async"
            className={`h-10 lg:h-11 xl:h-12 w-auto object-contain transition-opacity duration-500 ${
              showSolidNav ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'
            }`}
          />
          <img
            src="/responsive/minimal-logowhiteracota-400.webp"
            srcSet="/responsive/minimal-logowhiteracota-400.webp 400w, /responsive/minimal-logowhiteracota-800.webp 800w, /responsive/minimal-logowhiteracota-1200.webp 1200w"
            sizes="(max-width: 768px) 40px, 48px"
            alt="Coffee Matters"
            width={403}
            height={403}
            loading="eager"
            decoding="async"
            className={`h-10 lg:h-11 xl:h-12 w-auto object-contain absolute top-0 left-0 transition-opacity duration-500 ${
              showSolidNav ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="relative hidden items-center justify-center gap-5 lg:flex xl:gap-7">
          {navLinks.map((link) => {
            const isActive = pathname === link.to;
            const linkTone = isActive
              ? showSolidNav
                ? 'text-[var(--coral)]'
                : 'text-white'
              : showSolidNav
                ? 'text-[var(--dark)]/80 hover:text-[var(--coral)]'
                : 'text-white/[0.82] hover:text-white';
            const underlineTone = showSolidNav ? 'bg-[var(--coral)]' : 'bg-[var(--coral-on-dark)]';

            return (
              <Link
                key={link.name}
                to={link.to}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => handleLinkClick(link.to)}
                className={`group relative px-1 py-2 text-[12px] font-normal uppercase tracking-[0.18em] transition-colors duration-300 xl:text-[13px] ${linkTone}`}
              >
                {link.name}
                <span
                  className={`absolute bottom-0 left-1 right-1 h-px ${underlineTone} origin-center transform transition-transform duration-300 ${
                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {/* Desktop CTA */}
        <div className="hidden justify-end lg:flex">
          <a
            href={DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`group inline-flex h-10 items-center gap-2 rounded-full border px-4 text-[11px] font-medium uppercase tracking-[0.16em] transition-all duration-300 ${
              showSolidNav
                ? 'border-[var(--coral)]/35 bg-white/35 text-[var(--coral)] hover:border-[var(--coral)] hover:bg-[var(--coral)] hover:text-white'
                : 'border-white/45 bg-white/[0.08] text-white hover:border-white/80 hover:bg-white/[0.14]'
            }`}
          >
            <MapPin className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden="true" />
            <span>Directions</span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`lg:hidden inline-flex size-11 items-center justify-center rounded-full transition-colors duration-300 ${
            showSolidNav
              ? 'text-[var(--coral)] hover:bg-[var(--coral)]/10'
              : 'text-white hover:bg-white/10'
          }`}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute left-4 right-4 top-[calc(100%+0.4rem)] overflow-hidden rounded-xl border border-[var(--sandstone)]/70 bg-[var(--cream)] shadow-[0_18px_50px_rgba(43,38,35,0.18)]">
          <div className="h-1 bg-[linear-gradient(90deg,var(--coral),var(--coral-on-dark),var(--olive))]" />
          <div className="p-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              aria-current={pathname === link.to ? 'page' : undefined}
              onClick={() => handleLinkClick(link.to)}
              className={`block rounded-lg px-4 py-2.5 font-body text-xs uppercase tracking-[0.18em] transition-colors duration-300 ${
                pathname === link.to
                  ? 'bg-[var(--coral)]/10 text-[var(--coral)]'
                  : 'text-[var(--dark)] hover:bg-white/55 hover:text-[var(--coral)]'
              }`}
            >
              {link.name}
            </Link>
          ))}
          </div>
        </div>
      )}
    </nav>
  );
}
