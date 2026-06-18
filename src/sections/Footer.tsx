import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { MapPin, Mail, Clock, Instagram } from 'lucide-react';
import { openCookieSettings } from '@/components/CookieConsent';

const quickLinks = [
  { name: 'Home', to: '/' },
  { name: 'Menu', to: '/menu/' },
  { name: 'Gallery', to: '/gallery/' },
  { name: 'About us', to: '/about/' },
  { name: 'Contact', to: '/contact/' },
];

const openingHours = [
  { day: 'Monday – Friday', hours: '7:00 – 18:00' },
  { day: 'Saturday', hours: '7:30 – 18:00' },
  { day: 'Sunday', hours: '8:00 – 18:00' },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const columnsRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 1024) return;

    const ctx = gsap.context(() => {
      // Footer background fade
      if (footerRef.current) {
        gsap.fromTo(footerRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top 90%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // Logo glow in
      if (logoRef.current) {
        gsap.fromTo(logoRef.current,
          { opacity: 0, textShadow: '0 0 0px rgba(255,255,255,0)' },
          {
            opacity: 1,
            textShadow: '0 0 20px rgba(255,255,255,0.1)',
            duration: 0.6,
            delay: 0.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // Columns stagger slide up
      const columns = columnsRef.current?.querySelectorAll('.footer-column');
      if (columns && columns.length > 0) {
        gsap.fromTo(columns,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // Divider line draw
      if (dividerRef.current) {
        gsap.fromTo(dividerRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.8,
            delay: 0.8,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer 
      ref={footerRef}
      className="relative w-full bg-dark text-white py-9 md:py-16 lg:py-[4.5rem] xl:py-20"
    >
      <div className="section-padding">
        <div 
          ref={columnsRef}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-10 xl:gap-8 max-w-[1200px] mx-auto"
        >
          {/* Brand Column */}
          <div className="footer-column text-center md:col-span-2 md:text-left xl:col-span-1">
            <div ref={logoRef} className="mb-3 md:mb-6 group/logo flex items-center justify-center gap-3 md:justify-start md:gap-4 cursor-default">
              <img
                src="/responsive/logo-building-terracotta-280.webp"
                srcSet="/responsive/logo-building-terracotta-280.webp 280w, /responsive/logo-building-terracotta-560.webp 560w"
                sizes="(max-width: 768px) 58px, 72px"
                width={3665}
                height={3893}
                alt=""
                className="w-14 md:w-[4.5rem] h-auto shrink-0 object-contain opacity-90"
                style={{ filter: 'brightness(0) invert(1)' }}
                loading="lazy"
                decoding="async"
              />
              <h3 className="text-left text-xl tracking-wide md:text-2xl" style={{ transition: 'color 0.4s ease, text-shadow 0.4s ease' }}>
                <span className="font-display font-bold tracking-wider group-hover/logo:text-coral-on-dark transition-colors duration-400">COFFEE</span>
                <br />
                <span className="group-hover/logo:text-coral-on-dark transition-colors duration-400" style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic', fontWeight: 400 }}>MATTERS</span>
              </h3>
            </div>
            <p className="mx-auto max-w-[19rem] text-xs leading-relaxed text-gray-400 md:mx-0 md:max-w-none md:text-sm">
              Where passion meets community. Your local spot for specialty coffee, Greek bakes and Mediterranean-inspired brunch in Brick Lane, East London.
            </p>

            {/* Social / map links */}
            <div className="mt-4 flex items-center justify-center gap-3 md:mt-6 md:justify-start md:gap-4">
              <a
                href="https://www.instagram.com/coffeematterslondon"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Coffee Matters London on Instagram"
                className="inline-flex size-9 items-center justify-center rounded-full border border-coral-on-dark/35 bg-coral-on-dark/10 text-coral-on-dark transition-colors duration-300 hover:border-coral-on-dark/60 hover:bg-coral-on-dark/15 hover:text-white md:size-auto md:border-0 md:bg-transparent md:text-gray-400 md:hover:text-white"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.google.com/maps?ll=51.52556,-0.070537&z=15&t=m&hl=en-US&gl=US&mapclient=embed&cid=10714594583351249534"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Find Coffee Matters London on Google Maps"
                className="inline-flex size-9 items-center justify-center rounded-full border border-coral-on-dark/35 bg-coral-on-dark/10 text-coral-on-dark transition-colors duration-300 hover:border-coral-on-dark/60 hover:bg-coral-on-dark/15 hover:text-white md:size-auto md:border-0 md:bg-transparent md:text-gray-400 md:hover:text-white"
              >
                <MapPin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-column rounded-lg border border-white/10 bg-white/[0.03] p-3.5 md:border-0 md:bg-transparent md:p-0">
            <h4 className="mb-3 font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-300 md:mb-6 md:text-sm md:tracking-wider">
              Quick Links
            </h4>
            <ul className="grid grid-cols-2 gap-2 md:block md:space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    className="relative flex min-h-9 items-center justify-center rounded-full border border-white/10 px-3 py-1.5 text-xs text-gray-300 transition-colors duration-300 hover:border-white/25 hover:text-white md:inline-flex md:min-h-0 md:justify-start md:border-0 md:px-0 md:py-0 md:text-sm md:text-gray-400 group"
                  >
                    {link.name}
                    <span className="absolute -bottom-0.5 left-0 hidden w-full h-px bg-white transform origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 md:block" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-column rounded-lg border border-white/10 bg-white/[0.03] p-3.5 md:border-0 md:bg-transparent md:p-0">
            <h4 className="mb-3 font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-300 md:mb-6 md:text-sm md:tracking-wider">
              Contact
            </h4>
            <ul className="space-y-3 md:space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-coral-on-dark mt-0.5 flex-shrink-0 md:size-[18px]" />
                <a
                  href="https://www.google.com/maps?ll=51.52556,-0.070537&z=15&t=m&hl=en-US&gl=US&mapclient=embed&cid=10714594583351249534"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs leading-relaxed text-gray-400 hover:text-white transition-colors duration-300 md:text-sm"
                >
                  157 Bethnal Green Rd,<br />
                  London E2 7DG
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-coral-on-dark flex-shrink-0 md:size-[18px]" />
                <a 
                  href="mailto:info@coffeematterslondon.com"
                  className="break-all text-xs text-gray-400 hover:text-white transition-colors duration-300 md:text-sm"
                >
                  info@coffeematterslondon.com
                </a>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div className="footer-column rounded-lg border border-white/10 bg-white/[0.03] p-3.5 md:border-0 md:bg-transparent md:p-0">
            <h4 className="mb-3 font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-300 md:mb-6 md:text-sm md:tracking-wider">
              Opening Hours
            </h4>
            <ul className="space-y-2.5 md:space-y-3">
              {openingHours.map((item) => (
                <li key={item.day} className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <Clock size={16} className="text-coral-on-dark flex-shrink-0 md:size-[18px]" />
                    <span className="text-gray-300 text-xs block truncate md:text-sm">{item.day}</span>
                  </div>
                  <span className="text-gray-400 text-xs shrink-0 md:text-sm">{item.hours}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div 
          ref={dividerRef}
          className="max-w-[1200px] mx-auto mt-6 md:mt-12 pt-5 md:pt-8 border-t border-white/10 origin-left"
        >
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-3 text-center md:text-left">
            <p className="text-gray-400 text-xs md:text-sm">
              © {new Date().getFullYear()} Coffee Matters. All rights reserved.
            </p>
            <div className="flex flex-col items-center gap-2 font-body text-[11px] text-gray-400 tracking-wide sm:flex-row md:text-xs">
              <button
                type="button"
                className="text-gray-400 underline-offset-4 transition-colors duration-300 hover:text-white hover:underline"
                onClick={openCookieSettings}
              >
                Cookie settings
              </button>
              <span className="hidden sm:inline text-gray-600">/</span>
              <p>
                Website crafted by{' '}
                <a
                  href="https://pixelrebels.space"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors duration-300 hover:text-white"
                >
                  Pixel Rebels
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Logo glow animation */}
      <style>{`
        @keyframes logoGlow {
          0%, 100% { text-shadow: 0 0 10px rgba(255,255,255,0.05); }
          50% { text-shadow: 0 0 20px rgba(255,255,255,0.1); }
        }
      `}</style>
    </footer>
  );
}
