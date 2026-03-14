import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);
import { Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Menu', href: '#menu' },
  { name: 'Gallery', href: '#gallery' },
  { name: 'About us', href: '#about' },
  { name: 'Contact', href: '#contact' },
];

interface NavbarProps {
  /** When true, nav starts with glass style (no transparent hero behind it) */
  forceGlass?: boolean;
}

export default function Navbar({ forceGlass = false }: NavbarProps) {
  const navRef = useRef<HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(forceGlass);
  const [activeSection, setActiveSection] = useState<string>('home');

  // Scroll-based glassmorphism (only on home page)
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

  // Track active section for nav indicator
  useEffect(() => {
    if (forceGlass) return; // Only on home page

    const sectionIds = ['home', 'menu', 'gallery', 'about', 'contact'];
    
    const triggers = sectionIds.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;

      return ScrollTrigger.create({
        trigger: el,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => setActiveSection(id),
        onEnterBack: () => setActiveSection(id),
      });
    }).filter(Boolean) as ScrollTrigger[];

    return () => {
      triggers.forEach(t => t.kill());
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
  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        navScrolled ? 'glass shadow-lg py-3' : 'bg-transparent py-6'
      }`}
    >
      <div className="section-padding flex items-center justify-between">
        {/* Logo */}
        <a
          href="#home"
          className="group relative transition-transform duration-300 hover:scale-105 h-12"
        >
          <img
            src="/minimal-logowhite.png"
            alt="Coffee Matters"
            className={`h-12 w-auto object-contain transition-opacity duration-500 ${
              navScrolled ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'
            }`}
          />
          <img
            src="/minimal-logowhiteracota.png"
            alt="Coffee Matters"
            className={`h-12 w-auto object-contain absolute top-0 left-0 transition-opacity duration-500 ${
              navScrolled ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
          />
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 relative">
          {navLinks.map((link) => {
            const sectionId = link.href.slice(1); // Remove # from href
            const isActive = activeSection === sectionId;
            
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  const target = document.querySelector(link.href);
                  if (target) {
                    e.preventDefault();
                    e.stopPropagation();
                    gsap.to(window, {
                      scrollTo: { y: target, offsetY: 0 },
                      duration: 1,
                      ease: 'power3.inOut',
                    });
                  }
                }}
                className={`relative text-sm font-normal tracking-widest uppercase group transition-colors duration-300 ${
                  isActive
                    ? navScrolled
                      ? 'text-[#C25B3A]'
                      : 'text-[#C25B3A]'
                    : navScrolled
                    ? 'text-gray-800 hover:text-[#C25B3A]'
                    : 'text-white/90 hover:text-[#C25B3A]'
                }`}
                style={{ transition: 'color 0.3s ease, letter-spacing 0.4s cubic-bezier(0.22,1,0.36,1)' }}
                onMouseEnter={(e) => { e.currentTarget.style.letterSpacing = '0.2em'; }}
                onMouseLeave={(e) => { e.currentTarget.style.letterSpacing = ''; }}
              >
                {link.name}
                <span
                  className={`absolute -bottom-1 left-0 w-full h-0.5 bg-[#C25B3A] transform origin-center transition-transform duration-300 ${
                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </a>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`md:hidden p-2 transition-colors ${
            navScrolled ? 'text-black' : 'text-white'
          }`}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass absolute top-full left-0 right-0 py-4 px-6 shadow-lg">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick();
                const target = document.querySelector(link.href);
                if (target) {
                  gsap.to(window, {
                    scrollTo: { y: target, offsetY: 0 },
                    duration: 1,
                    ease: 'power3.inOut',
                  });
                }
              }}
              className="block py-3 text-gray-800 hover:text-[#C25B3A] font-normal tracking-widest uppercase text-sm border-b border-gray-200 last:border-0"
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
