import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Instagram } from 'lucide-react';

export default function NewsletterCTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const decorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    if (window.innerWidth < 1024) {
      const ctx = gsap.context(() => {
        const st = { trigger: sectionRef.current, start: 'top 80%', once: true };
        const words = headingRef.current?.querySelectorAll('.word');
        if (words?.length) {
          gsap.fromTo(words, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: 'expo.out', scrollTrigger: st });
        }
        if (buttonRef.current) {
          gsap.fromTo(buttonRef.current, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, delay: 0.2, ease: 'power2.out', scrollTrigger: st });
        }
      }, sectionRef);
      return () => ctx.revert();
    }

    const ctx = gsap.context(() => {
      // Background gradient sweep
      if (sectionRef.current) {
        gsap.fromTo(sectionRef.current,
          { backgroundPosition: '-100% 0%' },
          {
            backgroundPosition: '0% 0%',
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // Heading words stagger rise
      const words = headingRef.current?.querySelectorAll('.word');
      if (words && words.length > 0) {
        gsap.fromTo(words,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.05,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // Button pop in
      if (buttonRef.current) {
        gsap.fromTo(buttonRef.current,
          { scale: 0.8, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // Decorative lines draw in
      const lines = decorRef.current?.querySelectorAll('.decor-line');
      if (lines && lines.length > 0) {
        gsap.fromTo(lines,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 55%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // Subtle scale on scroll
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          if (headingRef.current) {
            gsap.set(headingRef.current, { 
              scale: 0.98 + progress * 0.04 
            });
          }
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const headingLines = [
    'Follow our daily rituals,',
    'fresh bakes & East London moments',
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative w-full py-20 md:py-32 lg:py-36 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #c25b3a 0%, #a34b30 50%, #c25b3a 100%)',
        backgroundSize: '200% 200%',
      }}
    >
      {/* Decorative Lines */}
      <div ref={decorRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="decor-line absolute top-10 left-0 w-32 h-px bg-white/20 origin-left"
        />
        <div 
          className="decor-line absolute top-20 right-0 w-48 h-px bg-white/20 origin-right"
        />
        <div 
          className="decor-line absolute bottom-16 left-10 w-24 h-px bg-white/20 origin-left"
        />
        <div 
          className="decor-line absolute bottom-10 right-20 w-40 h-px bg-white/20 origin-right"
        />
      </div>

      <div className="section-padding relative z-10 flex items-center justify-center">
        <div className="max-w-4xl mx-auto text-center">
          <h2 
            ref={headingRef}
            className="font-display text-[1.8rem] sm:text-[2.2rem] md:text-[2.8rem] lg:text-[3.2rem] text-white font-light leading-snug tracking-[0.01em] mb-4 sm:mb-6 max-w-3xl mx-auto text-balance"
            style={window.innerWidth >= 1024 ? { willChange: 'transform' } : undefined}
          >
            {headingLines.map((line, lineIndex) => (
              <span
                key={lineIndex}
                className="block md:whitespace-nowrap"
              >
                {line.split(' ').map((word, wordIndex) => (
                  <span
                    key={`${lineIndex}-${wordIndex}`}
                    className="word inline-block mr-[0.25em]"
                  >
                    {word}
                  </span>
                ))}
              </span>
            ))}
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-white/75 max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed font-body" style={{ fontWeight: 300 }}>
            Join a community that savours the small things — specialty pours, homemade Greek pastries, and the warmth of Brick Lane mornings.
          </p>

          {/* CTA Button */}
          <a
            ref={buttonRef}
            href="https://www.instagram.com/coffeematterslondon"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 sm:gap-3 px-6 sm:px-7 py-2.5 sm:py-3 border border-white/80 bg-white/5 text-white rounded-full text-[0.75rem] sm:text-sm font-medium tracking-[0.06em] transition-all duration-300 hover:bg-white hover:text-coral hover:shadow-lg/40 hover:shadow-black/30 hover:-translate-y-[1px]"
            style={{ 
              animation: 'pulse 3s ease-in-out infinite',
            }}
          >
            <Instagram size={20} />
            <span>Follow @coffeematterslondon</span>
            <ArrowRight 
              size={18} 
              className="transition-transform duration-300 group-hover:translate-x-2"
            />
          </a>
        </div>
      </div>

      {/* Subtle gradient animation */}
      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </section>
  );
}
