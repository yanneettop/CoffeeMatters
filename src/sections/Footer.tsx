import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { MapPin, Mail, Clock } from 'lucide-react';

const quickLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Menu', href: '#menu' },
  { name: 'Gallery', href: '#gallery' },
  { name: 'About us', href: '#about' },
  { name: 'Contact', href: '#contact' },
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
      className="relative w-full bg-dark text-white py-16 md:py-20"
    >
      <div className="section-padding">
        <div 
          ref={columnsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 max-w-7xl mx-auto"
        >
          {/* Brand Column */}
          <div className="footer-column sm:col-span-2 lg:col-span-1">
            <div ref={logoRef} className="mb-6">
              <h3 className="text-2xl tracking-wide">
                <span className="font-display font-bold tracking-wider">COFFEE</span>
                <br />
                <span style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic', fontWeight: 400 }}>MATTERS</span>
              </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Where passion meets community. Your local spot for exceptional brews and Mediterranean-inspired treats.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-column">
            <h4 className="font-body text-sm font-semibold tracking-wider uppercase mb-6 text-gray-300">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-white transition-colors duration-300 relative group"
                  >
                    {link.name}
                    <span className="absolute -bottom-0.5 left-0 w-full h-px bg-white transform origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                  </a>
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
                <MapPin size={18} className="text-coral mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  157 Bethnal Green Rd,<br />
                  London E2 7DG
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-coral flex-shrink-0" />
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
                  <Clock size={18} className="text-coral mt-0.5 flex-shrink-0" />
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
          className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 origin-left"
        >
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Coffee Matters. All rights reserved.
          </p>
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
