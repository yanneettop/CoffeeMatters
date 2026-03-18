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

    if (isMobile) {
      if (imgRef.current) {
        imgRef.current.style.opacity = '1';
      }

      // Entrance animations for mobile hero content
      const mobileCtx = gsap.context(() => {
        const heading = contentRef.current?.querySelector('h1');
        const subheading = contentRef.current?.querySelector('p');
        const buttons = contentRef.current?.querySelectorAll('a');
        const tl = gsap.timeline({ delay: 0.3 });
        if (heading) tl.fromTo(heading, { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out' });
        if (subheading) tl.fromTo(subheading, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.3');
        if (buttons?.length) tl.fromTo(buttons, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.08, ease: 'power2.out' }, '-=0.25');
      }, heroRef);

      const handleScroll = () => {
        if (!heroRef.current || !contentRef.current || !bgRef.current) return;
        const rect = heroRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const progress = Math.min(Math.max(-rect.top / (viewportHeight * 0.6), 0), 1);

        bgRef.current.style.transform = `translate3d(0, ${progress * 8}px, 0)`;
        contentRef.current.style.transform = `translate3d(0, ${progress * -12}px, 0)`;
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();

      return () => {
        mobileCtx.revert();
        window.removeEventListener('scroll', handleScroll);
      };
    }

    // --- Mouse parallax (rAF only — no GSAP on bgRef transform) ---
    window.addEventListener('mousemove', handleMouseMove);

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

    const ctx = gsap.context(() => {

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

      gsap.fromTo(imgRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.5, ease: 'power2.out' }
      );

      if (headingRef.current) {
        const letters = headingRef.current.querySelectorAll('.word');
        gsap.fromTo(letters,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.03, delay: 0.6, ease: 'expo.out' }
        );
      }

      gsap.to(overlayRef.current, {
        opacity: 0.65,
        duration: 8,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });

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

      gsap.fromTo(dividerRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.8, delay: 1.2, ease: 'expo.out' }
      );

      gsap.to(dividerRef.current, {
        backgroundPosition: '200% center',
        duration: 3,
        ease: 'none',
        repeat: -1,
        delay: 2,
      });

      if (subheadingRef.current) {
        const subWords = subheadingRef.current.querySelectorAll('.sub-word');
        gsap.fromTo(subWords,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.04, delay: 1.4, ease: 'power2.out' }
        );
      }

      // CTA buttons entrance
      const ctaButtons = heroRef.current?.querySelectorAll('.hero-cta');
      if (ctaButtons && ctaButtons.length > 0) {
        gsap.fromTo(ctaButtons,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, delay: 1.8, ease: 'power2.out' }
        );
      }

      gsap.fromTo(scrollIndicatorRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, delay: 2.2, ease: 'power2.out' }
      );

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
      className="relative w-full h-[100dvh] sm:h-screen overflow-hidden"
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

      {/* Base overlay — shared desktop breathing animation */}
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.5) 100%)',
          opacity: 0.85,
        }}
      />

      {/* Mobile-specific strong gradient overlay for readability */}
      <div
        className="sm:hidden absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(12,8,6,0.88) 0%, rgba(12,8,6,0.65) 30%, rgba(12,8,6,0.25) 60%, rgba(12,8,6,0.15) 100%)',
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

      {/* ── MOBILE CONTENT ───────────────────────────────────────── */}
      <div
        ref={contentRef}
        className="sm:hidden absolute inset-0 z-10 flex flex-col"
        style={{ willChange: 'transform' }}
      >
        {/* Top area — subtle location tag */}
        <div className="flex justify-center pt-[calc(env(safe-area-inset-top,0px)+80px)]">
          <div className="flex items-center gap-2">
            <div className="w-4 h-px bg-white/30" />
            <span
              className="font-body text-white/45 uppercase tracking-[0.32em]"
              style={{ fontSize: '9px' }}
            >
              Est. Brick Lane, London
            </span>
            <div className="w-4 h-px bg-white/30" />
          </div>
        </div>

        {/* Main content — pushed toward bottom */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">

          {/* Brand title */}
          <h1
            className="font-display text-[2.8rem] text-white tracking-[0.04em] leading-none mb-4"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}
          >
            COFFEE MATTERS
          </h1>

          {/* Divider */}
          <div
            className="mb-4 mx-auto"
            style={{
              width: '48px',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(194,91,58,0.6), rgba(255,255,255,0.4), rgba(194,91,58,0.6), transparent)',
            }}
          />

          {/* Subheading */}
          <p
            className="font-body text-white/70 leading-relaxed mb-8"
            style={{ fontSize: '0.84rem', maxWidth: '270px' }}
          >
            Specialty coffee, homemade bakes &amp; Greek warmth in the heart of Brick Lane.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <a
              href="#menu"
              className="font-body uppercase tracking-[0.2em] text-white rounded-full transition-all duration-200 active:scale-95"
              style={{
                fontSize: '10px',
                padding: '10px 22px',
                background: '#c25b3a',
                boxShadow: '0 4px 20px rgba(194,91,58,0.35)',
              }}
            >
              View Menu
            </a>
            <a
              href="#contact"
              className="font-body uppercase tracking-[0.2em] text-white/90 rounded-full transition-all duration-200 active:scale-95"
              style={{
                fontSize: '10px',
                padding: '9px 22px',
                border: '1px solid rgba(255,255,255,0.38)',
                backdropFilter: 'blur(4px)',
              }}
            >
              Find Us
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/50 cursor-pointer"
          onClick={handleScrollIndicatorClick}
        >
          <span style={{ fontSize: '8px' }} className="tracking-[0.32em] uppercase font-body">Scroll</span>
          <div className="relative w-4 h-7 border border-white/30 rounded-full flex justify-center overflow-hidden">
            <div
              className="w-[3px] h-[3px] bg-white/70 rounded-full mt-1.5"
              style={{ animation: 'scrollDot 2s ease-in-out infinite' }}
            />
          </div>
        </div>
      </div>

      {/* ── DESKTOP CONTENT ──────────────────────────────────────── */}
      <div
        className="hidden sm:flex relative z-10 h-full flex-col items-center justify-center text-center section-padding pb-16"
        style={{ willChange: 'transform' }}
      >
        {/* Location tag */}
        <div className="absolute top-28 left-1/2 -translate-x-1/2 flex items-center gap-3">
          <div className="w-8 h-px bg-white/25" />
          <span className="font-body text-white/40 uppercase tracking-[0.35em]" style={{ fontSize: '10px' }}>
            Est. Brick Lane, London
          </span>
          <div className="w-8 h-px bg-white/25" />
        </div>

        {/* Animated per-letter heading */}
        <h1
          ref={headingRef}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-bold text-white mb-5 tracking-wide"
        >
          {'COFFEE MATTERS'.split('').map((char, i) => (
            <span
              key={i}
              className={`word inline-block cursor-default select-none transition-all duration-300 ease-out hover:-translate-y-[2px] hover:text-[#c25b3a] ${char === ' ' ? 'w-[0.3em]' : ''}`}
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.4)', transitionDelay: '0ms' }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.textShadow = '0 2px 25px rgba(194,91,58,0.7), 0 0 50px rgba(194,91,58,0.4)';
                const prev = el.previousElementSibling as HTMLElement | null;
                const next = el.nextElementSibling as HTMLElement | null;
                if (prev) { prev.style.textShadow = '0 2px 20px rgba(194,91,58,0.35), 0 0 25px rgba(194,91,58,0.15)'; prev.style.color = 'rgba(220,160,130,1)'; }
                if (next) { next.style.textShadow = '0 2px 20px rgba(194,91,58,0.35), 0 0 25px rgba(194,91,58,0.15)'; next.style.color = 'rgba(220,160,130,1)'; }
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
          className="w-20 h-[1px] mb-5 origin-center"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), rgba(194,91,58,0.6), rgba(255,255,255,0.8), transparent)',
            backgroundSize: '200% 100%',
          }}
        />

        <p
          ref={subheadingRef}
          className="max-w-lg text-base md:text-lg text-white/80 font-body leading-relaxed px-4 mb-9 relative"
          style={{ fontWeight: 300 }}
        >
          {'Specialty coffee, homemade bakes & Greek warmth in the heart of Brick Lane.'.split(' ').map((word, i) => (
            <span
              key={i}
              className="sub-word inline-block mr-[0.3em] cursor-default"
              style={{ transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1), color 0.3s ease' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.color = '';
              }}
            >
              {word}
            </span>
          ))}
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4">
          <a
            href="#menu"
            className="hero-cta font-body uppercase tracking-[0.18em] text-white rounded-full transition-all duration-300 hover:scale-[1.03] hover:shadow-lg"
            style={{
              fontSize: '11px',
              padding: '13px 32px',
              background: '#c25b3a',
              boxShadow: '0 4px 24px rgba(194,91,58,0.3)',
            }}
          >
            View Menu
          </a>
          <a
            href="#contact"
            className="hero-cta font-body uppercase tracking-[0.18em] text-white/90 rounded-full transition-all duration-300 hover:bg-white/10 hover:scale-[1.03]"
            style={{
              fontSize: '11px',
              padding: '12px 32px',
              border: '1px solid rgba(255,255,255,0.35)',
              backdropFilter: 'blur(4px)',
            }}
          >
            Find Us
          </a>
        </div>

        {/* Desktop scroll indicator */}
        <div
          className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/45 cursor-pointer"
          onClick={handleScrollIndicatorClick}
        >
          <span className="text-[9px] tracking-[0.3em] uppercase font-body">Scroll</span>
          <div className="relative w-[18px] h-8 border border-white/25 rounded-full flex justify-center overflow-hidden">
            <div
              className="w-[2.5px] h-[2.5px] bg-white/60 rounded-full mt-1.5"
              style={{ animation: 'scrollDot 2s ease-in-out infinite' }}
            />
          </div>
        </div>
      </div>

      {/* Terracotta bokeh — desktop only, clustered at heading edges */}
      <div className="hidden sm:block absolute inset-0 z-20 pointer-events-none overflow-hidden">
        {[...Array(40)].map((_, i) => {
          const size = 15 + (i % 6) * 10;
          const colors = [
            'radial-gradient(circle, rgba(194,91,58,0.7) 0%, rgba(194,91,58,0.2) 50%, transparent 70%)',
            'radial-gradient(circle, rgba(210,105,65,0.65) 0%, rgba(210,105,65,0.15) 50%, transparent 70%)',
            'radial-gradient(circle, rgba(180,75,45,0.6) 0%, rgba(180,75,45,0.15) 50%, transparent 70%)',
          ];
          const isLeft = i < 20;
          const baseLeft = isLeft ? 5 + (i * 1.3) % 18 : 72 + (i * 1.1) % 20;
          const baseTop = 35 + (i * 1.7) % 25;
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
