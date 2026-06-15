import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { MapPin, Mail, Clock, Instagram } from 'lucide-react';
import { openCookieSettings } from '@/components/CookieConsent';

const quickLinks = [
  { name: 'Home', to: '/' },
  { name: 'Menu', to: '/menu' },
  { name: 'Gallery', to: '/gallery' },
  { name: 'About us', to: '/about' },
  { name: 'Contact', to: '/contact' },
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
      className="relative w-full bg-dark text-white py-14 md:py-16 lg:py-[4.5rem] xl:py-20"
    >
      <div className="section-padding">
        <div 
          ref={columnsRef}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 md:gap-10 xl:gap-8 max-w-[1200px] mx-auto"
        >
          {/* Brand Column */}
          <div className="footer-column md:col-span-2 xl:col-span-1">
            <div ref={logoRef} className="mb-6 group/logo cursor-default">
              <h3 className="text-2xl tracking-wide" style={{ transition: 'color 0.4s ease, text-shadow 0.4s ease' }}>
                <span className="font-display font-bold tracking-wider group-hover/logo:text-coral-on-dark transition-colors duration-400">COFFEE</span>
                <br />
                <span className="group-hover/logo:text-coral-on-dark transition-colors duration-400" style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic', fontWeight: 400 }}>MATTERS</span>
              </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Where passion meets community. Your local spot for specialty coffee, Greek bakes and Mediterranean-inspired brunch in Brick Lane, East London.
            </p>

            {/* Social / map links */}
            <div className="mt-6 flex items-center gap-4">
              <a
                href="https://www.instagram.com/coffeematterslondon"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Coffee Matters London on Instagram"
                className="text-gray-400 transition-colors duration-300 hover:text-white"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.google.com/maps?ll=51.52556,-0.070537&z=15&t=m&hl=en-US&gl=US&mapclient=embed&cid=10714594583351249534"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Find Coffee Matters London on Google Maps"
                className="text-gray-400 transition-colors duration-300 hover:text-white"
              >
                <MapPin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-column">
            <h4 className="font-body text-sm font-semibold tracking-wider uppercase mb-6 text-gray-300">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    className="text-gray-400 text-sm hover:text-white transition-colors duration-300 relative group"
                  >
                    {link.name}
                    <span className="absolute -bottom-0.5 left-0 w-full h-px bg-white transform origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-column">
            <h4 className="font-body text-sm font-semibold tracking-wider uppercase mb-6 text-gray-300">
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-coral-on-dark mt-0.5 flex-shrink-0" />
                <a
                  href="https://www.google.com/maps?ll=51.52556,-0.070537&z=15&t=m&hl=en-US&gl=US&mapclient=embed&cid=10714594583351249534"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 text-sm hover:text-white transition-colors duration-300"
                >
                  157 Bethnal Green Rd,<br />
                  London E2 7DG
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-coral-on-dark flex-shrink-0" />
                <a 
                  href="mailto:info@coffeematterslondon.com"
                  className="text-gray-400 text-sm hover:text-white transition-colors duration-300"
                >
                  info@coffeematterslondon.com
                </a>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div className="footer-column">
            <h4 className="font-body text-sm font-semibold tracking-wider uppercase mb-6 text-gray-300">
              Opening Hours
            </h4>
            <ul className="space-y-3">
              {openingHours.map((item) => (
                <li key={item.day} className="flex items-start gap-3">
                  <Clock size={18} className="text-coral-on-dark mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-gray-300 text-sm block">{item.day}</span>
                    <span className="text-gray-400 text-sm">{item.hours}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div 
          ref={dividerRef}
          className="max-w-[1200px] mx-auto mt-10 md:mt-12 pt-8 border-t border-white/10 origin-left"
        >
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-3 text-center md:text-left">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Coffee Matters. All rights reserved.
            </p>
            <div className="flex flex-col items-center gap-2 font-body text-xs text-gray-400 tracking-wide sm:flex-row">
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
