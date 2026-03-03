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

  const headingText = 'JOIN COFFEE MATTERS AND BE ONE OF THE FIRST TO HEAR ABOUT OUR SPECIAL OFFERS AND EVENTS';
  const words = headingText.split(' ');

  return (
    <section 
      ref={sectionRef}
      className="relative w-full py-20 md:py-28 overflow-hidden"
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

      <div className="section-padding relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 
            ref={headingRef}
            className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight mb-10"
            style={{ willChange: 'transform' }}
          >
            {words.map((word, i) => (
              <span key={i} className="word inline-block mr-[0.25em]">
                {word}
              </span>
            ))}
          </h2>

          {/* CTA Button */}
          <a
            ref={buttonRef}
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-8 py-4 border-2 border-white text-white rounded-full text-sm font-medium tracking-wide uppercase transition-all duration-300 hover:bg-white hover:text-coral hover:scale-105"
            style={{ 
              animation: 'pulse 3s ease-in-out infinite',
            }}
          >
            <Instagram size={20} />
            <span>FOLLOW US ON INSTAGRAM</span>
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
