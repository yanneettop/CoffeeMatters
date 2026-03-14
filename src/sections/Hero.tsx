import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouseCurrent = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseTarget.current = {
      x: (e.clientX / window.innerWidth - 0.5) * 2,
      y: (e.clientY / window.innerHeight - 0.5) * 2,
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const isMobile = window.innerWidth < 768;
    // On mobile we keep things simpler: static Ken Burns, light scroll parallax, no GSAP timelines.
    if (isMobile) {
      if (imgRef.current) {
        imgRef.current.style.opacity = '1';
      }

      const handleScroll = () => {
        if (!heroRef.current || !contentRef.current || !bgRef.current) return;
        const rect = heroRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const progress = Math.min(Math.max(-rect.top / (viewportHeight * 0.6), 0), 1);

        // Very light counter parallax between background and content
        bgRef.current.style.transform = `translate3d(0, ${progress * 8}px, 0)`;
        contentRef.current.style.transform = `translate3d(0, ${progress * -12}px, 0)`;
      };

      window.addEventListener('scroll', handleScroll);
      handleScroll();

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }

    // --- Mouse parallax (rAF only — no GSAP on bgRef transform) ---
    window.addEventListener('mousemove', handleMouseMove);

    // Ken Burns scale lives in a ref so rAF can read it without fighting GSAP
    const kbScale = { value: 1.05 };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const loop = () => {
      mouseCurrent.current.x = lerp(mouseCurrent.current.x, mouseTarget.current.x, 0.05);
      mouseCurrent.current.y = lerp(mouseCurrent.current.y, mouseTarget.current.y, 0.05);

      if (bgRef.current) {
        bgRef.current.style.transform =
          `translate3d(${-mouseCurrent.current.x * 12}px, ${-mouseCurrent.current.y * 8}px, 0) scale(${kbScale.value})`;
      }

      rafId.current = requestAnimationFrame(loop);
    };
    rafId.current = requestAnimationFrame(loop);

    // --- GSAP animations (no transform on bgRef — only on children / other refs) ---
    const ctx = gsap.context(() => {

      // Ken Burns drift — animates the scale value read by the rAF loop
      gsap.fromTo(kbScale, { value: 1.08 }, {
        value: 1.05,
        duration: 2,
        ease: 'expo.out',
      });
      gsap.to(kbScale, {
        value: 1.1,
        duration: 25,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 2,
      });

      // Background fade in
      gsap.fromTo(imgRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.5, ease: 'power2.out' }
      );

      // Heading stagger reveal — per letter
      if (headingRef.current) {
        const letters = headingRef.current.querySelectorAll('.word');
        gsap.fromTo(letters,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.03, delay: 0.6, ease: 'expo.out' }
        );
      }

      // Overlay breathing — very slow opacity shift
      gsap.to(overlayRef.current, {
        opacity: 0.65,
        duration: 8,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });

      // Heading letter-spacing pulse
      if (headingRef.current) {
        gsap.to(headingRef.current, {
          letterSpacing: '0.08em',
          duration: 6,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: 2,
        });
      }

      // Divider expand
      gsap.fromTo(dividerRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.8, delay: 1.2, ease: 'expo.out' }
      );

      // Divider shimmer loop
      gsap.to(dividerRef.current, {
        backgroundPosition: '200% center',
        duration: 3,
        ease: 'none',
        repeat: -1,
        delay: 2,
      });

      // Subheading word-by-word reveal
      if (subheadingRef.current) {
        const subWords = subheadingRef.current.querySelectorAll('.sub-word');
        gsap.fromTo(subWords,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.04, delay: 1.4, ease: 'power2.out' }
        );
      }

      // Scroll indicator
      gsap.fromTo(scrollIndicatorRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, delay: 2, ease: 'power2.out' }
      );

      // Scroll fade-out: content blurs + fades, scroll indicator disappears
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: '50% top',
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          if (contentRef.current) {
            contentRef.current.style.opacity = String(1 - p * 0.7);
            contentRef.current.style.filter = `blur(${p * 4}px)`;
          }
          if (scrollIndicatorRef.current) {
            scrollIndicatorRef.current.style.opacity = String(1 - p * 3);
          }
        }
      });

    }, heroRef);

    return () => {
      ctx.revert();
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId.current);
    };
  }, [handleMouseMove]);

  const handleScrollIndicatorClick = () => {
    const heroEl = heroRef.current;
    if (!heroEl) return;
    const nextSection = heroEl.nextElementSibling as HTMLElement | null;
    const targetOffset = nextSection ? nextSection.offsetTop : heroEl.offsetTop + heroEl.offsetHeight;
    window.scrollTo({ top: targetOffset, behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative w-full h-[85vh] sm:h-screen overflow-hidden"
    >
      {/* Background Image — oversized for parallax + Ken Burns */}
      <div
        ref={bgRef}
        className="absolute inset-[-20px] w-[calc(100%+40px)] h-[calc(100%+40px)]"
        style={{ willChange: 'transform' }}
      >
        <img
          ref={imgRef}
          src="/hero-bg.webp"
          alt="Coffee Matters café interior at Brick Lane, London"
          className="img-content w-full h-full object-cover object-[50%_30%] sm:object-center animate-fade-in sm:animate-none"
          fetchPriority="high"
          decoding="async"
        />
      </div>

      {/* Dark overlay — breathing */}
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.5) 100%)',
          opacity: 0.85,
        }}
      />

      {/* Bokeh particles — white, behind content */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => {
          const size = 5 + (i % 8) * 4;
          return (
            <div
              key={`w-${i}`}
              className="absolute rounded-full"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${(i * 2.5) % 96}%`,
                top: `${(i * 4.3) % 90}%`,
                background: 'radial-gradient(circle, rgba(255,255,255,0.35) 0%, transparent 70%)',
                filter: `blur(${1 + (i % 3)}px)`,
                animation: `heroBokeh ${7 + (i % 10) * 1.5}s ease-in-out ${-i * 0.6}s infinite`,
              }}
            />
          );
        })}
      </div>

      {/* Static vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 120px 50px rgba(0,0,0,0.25)',
        }}
      />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 h-full flex flex-col items-center justify-center text-center section-padding"
      >
        {/* Subtle steam above logo on mobile */}
        <div className="sm:hidden mb-2 h-6 flex items-end justify-center pointer-events-none">
          <div className="hero-steam" />
        </div>

        {/* Mobile heading — stacked lines, no per-letter animation */}
        <h1
          className="font-display text-3xl xs:text-4xl text-white mb-3 tracking-wide leading-snug sm:hidden"
        >
          <span className="block">COFFEE</span>
          <span className="block">MATTERS</span>
          <span className="sr-only"> — Specialty Coffee Shop in Brick Lane, London</span>
        </h1>

        {/* Desktop / tablet heading — animated per letter */}
        <h1
          ref={headingRef}
          className="hidden sm:block font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-4 tracking-wide"
        >
          {'COFFEE MATTERS'.split('').map((char, i) => (
            <span
              key={i}
              className={`word inline-block cursor-default select-none transition-all duration-300 ease-out hover:-translate-y-[2px] hover:text-[#c25b3a] ${char === ' ' ? 'w-[0.3em]' : ''}`}
              style={{
                textShadow: '0 2px 20px rgba(0,0,0,0.4)',
                transitionDelay: '0ms',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.textShadow = '0 2px 25px rgba(194,91,58,0.7), 0 0 50px rgba(194,91,58,0.4)';
                // Glow neighbors
                const prev = el.previousElementSibling as HTMLElement | null;
                const next = el.nextElementSibling as HTMLElement | null;
                if (prev) {
                  prev.style.textShadow = '0 2px 20px rgba(194,91,58,0.35), 0 0 25px rgba(194,91,58,0.15)';
                  prev.style.color = 'rgba(220,160,130,1)';
                }
                if (next) {
                  next.style.textShadow = '0 2px 20px rgba(194,91,58,0.35), 0 0 25px rgba(194,91,58,0.15)';
                  next.style.color = 'rgba(220,160,130,1)';
                }
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.textShadow = '0 2px 20px rgba(0,0,0,0.4)';
                const prev = el.previousElementSibling as HTMLElement | null;
                const next = el.nextElementSibling as HTMLElement | null;
                if (prev) { prev.style.textShadow = '0 2px 20px rgba(0,0,0,0.4)'; prev.style.color = ''; }
                if (next) { next.style.textShadow = '0 2px 20px rgba(0,0,0,0.4)'; next.style.color = ''; }
              }}
            >{char === ' ' ? '\u00A0' : char}</span>
          ))}
          <span className="sr-only"> — Specialty Coffee Shop in Brick Lane, London</span>
        </h1>

        <div
          ref={dividerRef}
          className="w-24 h-[1px] mb-5 origin-center"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), rgba(194,91,58,0.6), rgba(255,255,255,0.8), transparent)',
            backgroundSize: '200% 100%',
          }}
        />

        <p
          ref={subheadingRef}
          className="max-w-2xl text-base sm:text-lg text-white/90 font-body leading-relaxed px-4 mb-6 relative"
        >
          {'Dive in heavenly Greek pies, pastries, and coffee delights in the vibrant heart of Bricklane.'.split(' ').map((word, i) => {
            const playfulWords = ['Greek', 'pies,', 'coffee', 'delights'];
            const isPlayful = playfulWords.includes(word.replace(/[^a-zA-Z,]/g, ''));
            return (
              <span
                key={i}
                className="sub-word inline-block mr-[0.3em] cursor-default"
                style={{ transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1), color 0.3s ease, text-shadow 0.3s ease, letter-spacing 0.3s ease' }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = 'scale(1.18) translateY(-2px)';
                  el.style.color = '#fff';
                  el.style.textShadow = '0 0 12px rgba(194,91,58,0.6), 0 0 30px rgba(194,91,58,0.25)';
                  el.style.letterSpacing = '0.03em';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = '';
                  el.style.color = '';
                  el.style.textShadow = '';
                  el.style.letterSpacing = '';
                }}
                onClick={isPlayful ? (e) => {
                  const el = e.currentTarget;
                  el.style.transform = 'scale(1.12) translateY(-1px)';
                  el.style.color = '#fff';
                  el.style.textShadow = '0 0 10px rgba(194,91,58,0.6)';
                  setTimeout(() => {
                    el.style.transform = '';
                    el.style.color = '';
                    el.style.textShadow = '';
                  }, 220);
                } : undefined}
              >
                {word}
              </span>
            );
          })}
          {/* Shimmer overlay — soft glow sweep */}
          <span
            className="absolute inset-[-10px] pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, transparent 30%, rgba(194,91,58,0.3) 45%, rgba(194,91,58,0.35) 50%, rgba(194,91,58,0.3) 55%, transparent 70%, transparent 100%)',
              backgroundSize: '400% 100%',
              animation: 'subtitleShimmer 8s ease-in-out infinite',
              filter: 'blur(8px)',
              borderRadius: '50%',
              mixBlendMode: 'screen',
            }}
          />
        </p>

        {/* Scroll Indicator */}
        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 sm:gap-2 text-white/60"
          onClick={handleScrollIndicatorClick}
        >
          <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase font-body">Scroll</span>
          <div className="relative w-4 h-8 sm:w-5 sm:h-9 border border-white/40 rounded-full flex justify-center overflow-hidden">
            <div
              className="w-[3px] h-[3px] bg-white/80 rounded-full mt-2"
              style={{
                animation: 'scrollDot 2s ease-in-out infinite',
              }}
            />
          </div>
        </div>
      </div>
      {/* Terracotta bokeh — clustered at heading edges (COF... and ...ERS) */}
      <div className="hidden sm:block absolute inset-0 z-20 pointer-events-none overflow-hidden">
        {[...Array(40)].map((_, i) => {
          const size = 15 + (i % 6) * 10;
          const colors = [
            'radial-gradient(circle, rgba(194,91,58,0.7) 0%, rgba(194,91,58,0.2) 50%, transparent 70%)',
            'radial-gradient(circle, rgba(210,105,65,0.65) 0%, rgba(210,105,65,0.15) 50%, transparent 70%)',
            'radial-gradient(circle, rgba(180,75,45,0.6) 0%, rgba(180,75,45,0.15) 50%, transparent 70%)',
          ];
          // Cluster: first half around left edge (COF), second half around right edge (ERS)
          const isLeft = i < 20;
          const baseLeft = isLeft
            ? 5 + (i * 1.3) % 18     // 5%–23% — left cluster
            : 72 + (i * 1.1) % 20;   // 72%–92% — right cluster
          const baseTop = 35 + (i * 1.7) % 25; // 35%–60% — heading vertical zone
          return (
            <div
              key={`t-${i}`}
              className="absolute rounded-full"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${baseLeft}%`,
                top: `${baseTop}%`,
                background: colors[i % 3],
                filter: `blur(${2 + (i % 3)}px)`,
                animation: `heroBokeh ${8 + (i % 8) * 2}s ease-in-out ${-i * 0.6}s infinite`,
              }}
            />
          );
        })}
      </div>
    </section>
  );
}
