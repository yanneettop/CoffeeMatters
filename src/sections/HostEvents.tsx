import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

export default function HostEvents() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // Text card glassmorphism reveal
      if (textRef.current) {
        gsap.fromTo(textRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // Heading character stagger
      const headingChars = textRef.current?.querySelectorAll('.char');
      if (headingChars && headingChars.length > 0) {
        gsap.fromTo(headingChars,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.03,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // "EVENTS" scale pop
      const eventsWord = textRef.current?.querySelector('.events-word');
      if (eventsWord) {
        gsap.fromTo(eventsWord,
          { scale: 0.9, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 55%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // Body text fade up
      const bodyText = textRef.current?.querySelector('.body-text');
      if (bodyText) {
        gsap.fromTo(bodyText,
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 50%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // Button slide in
      if (buttonRef.current) {
        gsap.fromTo(buttonRef.current,
          { x: -30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.4,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 45%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // Image reveal
      if (imageRef.current) {
        if (isMobile) {
          // Simpler reveal for mobile: fade + slide
          gsap.fromTo(imageRef.current,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power2.out',
              force3D: true,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
                toggleActions: 'play none none none'
              }
            }
          );
        } else {
          gsap.fromTo(imageRef.current,
            { clipPath: 'circle(0% at 50% 50%)' },
            {
              clipPath: 'circle(100% at 50% 50%)',
              duration: 1.2,
              ease: 'expo.out',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 60%',
                toggleActions: 'play none none reverse'
              }
            }
          );
        }
      }

      // Parallax — skip on mobile/tablet for smooth scrolling
      if (!isMobile) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
          onUpdate: (self) => {
            const progress = self.progress;
            if (textRef.current) {
              gsap.set(textRef.current, { y: 20 - progress * 40, force3D: true });
            }
            if (imageRef.current) {
              gsap.set(imageRef.current, { y: -40 + progress * 80, force3D: true });
            }
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Split heading into characters
  const headingText = 'HOST YOUR';
  const chars = headingText.split('');

  return (
    <section 
      id="events"
      ref={sectionRef}
      className="relative w-full py-8 sm:py-24 md:py-36 bg-cream overflow-hidden"
    >
      <div className="section-padding">
        <div className="content-card">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-16 lg:gap-24 items-center max-w-7xl mx-auto">
          {/* Text Content */}
          <div 
            ref={textRef}
            className="relative z-10"
            style={{ willChange: 'transform' }}
          >
            {/* Glassmorphism card effect */}
            <div className="relative p-0 sm:p-8 lg:p-12 rounded-none sm:rounded-2xl bg-transparent sm:bg-white/30 backdrop-blur-none sm:backdrop-blur-sm">
              <div className="mb-8 group">
                <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                  <span className="block font-display font-light tracking-widest text-[var(--text-secondary)]">
                    {chars.map((char, i) => (
                      <span
                        key={i}
                        className="char inline-block"
                        style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
                      >
                        {char}
                      </span>
                    ))}
                  </span>
                  <span className="events-word block text-coral mt-1 transition-[filter] duration-700 ease-out group-hover:brightness-[1.2]" style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic', fontWeight: 400 }}>
                    EVENTS
                  </span>
                </h2>
                <div className="w-16 h-0.5 bg-coral/60 mt-4 transition-[width] duration-700 ease-out group-hover:w-24" />
              </div>
              
              <p className="body-text text-gray-700 font-body leading-relaxed lg:text-[1.05rem] lg:leading-[1.85] mb-8">
                Make Coffee Matters the canvas for your next special event. Our versatile venue transforms to suit your vision, whether you're planning an intimate gathering or a lively celebration.
              </p>

              {/* CTA Button */}
              <a
                ref={buttonRef}
                href="#contact"
                className="btn-outline group inline-flex items-center gap-3 text-coral border-coral hover:bg-coral hover:text-white transition-all duration-300"
              >
                <span>HIRE OUR VENUE</span>
                <ArrowRight 
                  size={18} 
                  className="transition-transform duration-300 group-hover:translate-x-2"
                />
              </a>
            </div>
          </div>

          {/* Image */}
          <div 
            ref={imageRef}
            className="relative"
            style={{ willChange: 'transform, clip-path' }}
          >
            <div className="relative overflow-hidden rounded-lg shadow-2xl img-hover animate-pulse-glow group">
              <img
                src="/events-gathering.jpg"
                alt="Private event gathering hosted at Coffee Matters café venue, London"
                className="img-content w-full h-auto object-cover aspect-square lg:aspect-[4/5]"
                loading="lazy"
              />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-coral/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-coral/15 rounded-full blur-3xl" />
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
