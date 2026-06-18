import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Home', to: '/' },
  { name: 'Menu', to: '/menu/' },
  { name: 'Gallery', to: '/gallery/' },
  { name: 'About us', to: '/about/' },
  { name: 'Contact', to: '/contact/' },
];

interface NavbarProps {
  /** When true, nav starts with glass style (no transparent hero behind it) */
  forceGlass?: boolean;
}

export default function Navbar({ forceGlass = false }: NavbarProps) {
  const navRef = useRef<HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(forceGlass);
  const { pathname } = useLocation();
  const showSolidNav = navScrolled || mobileMenuOpen;

  // Scroll-based glassmorphism (only on home page where the transparent hero sits behind the nav)
  useEffect(() => {
    if (forceGlass) {
      setNavScrolled(true);
      return;
    }

    setNavScrolled(false);

    const hero = document.getElementById('home');
    if (!hero) return;

    const trigger = ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      end: '20% top',
      onUpdate: (self) => {
        setNavScrolled(self.progress > 0.5);
      },
    });

    return () => {
      trigger.kill();
    };
  }, [forceGlass]);

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        showSolidNav ? 'bg-[var(--cream)]/95 shadow-lg py-2.5 lg:py-3' : 'bg-transparent py-4 lg:py-5 xl:py-6'
      }`}
    >
      <div className="section-padding flex items-center justify-between">
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
        <div className="hidden lg:flex items-center gap-5 xl:gap-8 relative">
          {navLinks.map((link) => {
            const isActive = pathname === link.to;

            return (
              <Link
                key={link.name}
                to={link.to}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => handleLinkClick(link.to)}
                className={`relative text-[13px] xl:text-sm font-normal tracking-widest uppercase group transition-colors duration-300 ${
                  isActive
                    ? 'text-[var(--coral)]'
                    : showSolidNav
                    ? 'text-gray-800 hover:text-[var(--coral)]'
                    : 'text-white/90 hover:text-[var(--coral-on-dark)]'
                }`}
                style={{ transition: 'color 0.3s ease, letter-spacing 0.4s cubic-bezier(0.22,1,0.36,1)' }}
                onMouseEnter={(e) => { e.currentTarget.style.letterSpacing = '0.2em'; }}
                onMouseLeave={(e) => { e.currentTarget.style.letterSpacing = ''; }}
              >
                {link.name}
                <span
                  className={`absolute -bottom-1 left-0 w-full h-0.5 bg-[var(--coral)] transform origin-center transition-transform duration-300 ${
                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            );
          })}
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
