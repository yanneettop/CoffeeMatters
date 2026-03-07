import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const gradientMeshRef = useRef<HTMLDivElement>(null);
  const steamParticlesRef = useRef<HTMLDivElement>(null);
  const lightOrbsRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouseLerped = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);


  // Mouse parallax handler — just stores target, no heavy work
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseTarget.current = {
      x: (e.clientX / window.innerWidth - 0.5) * 2,
      y: (e.clientY / window.innerHeight - 0.5) * 2,
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    window.addEventListener('mousemove', handleMouseMove);

    // Smooth rAF lerp loop — paused when hero is off-screen
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    let heroVisible = true;
    const parallaxLoop = () => {
      if (!heroVisible) {
        rafId.current = requestAnimationFrame(parallaxLoop);
        return;
      }
      const smoothing = 0.06;
      mouseLerped.current.x = lerp(mouseLerped.current.x, mouseTarget.current.x, smoothing);
      mouseLerped.current.y = lerp(mouseLerped.current.y, mouseTarget.current.y, smoothing);
      const { x, y } = mouseLerped.current;

      if (bgRef.current) {
        bgRef.current.style.transform =
          `translate3d(${-x * 15}px, ${-y * 10}px, 0) scale(${bgRef.current.dataset.scale || '1.05'})`;
      }
      if (contentRef.current) {
        contentRef.current.style.transform =
          `translate3d(${x * 8}px, ${y * 5}px, 0)`;
      }
      rafId.current = requestAnimationFrame(parallaxLoop);
    };
    rafId.current = requestAnimationFrame(parallaxLoop);

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => { heroVisible = entry.isIntersecting; },
      { threshold: 0 }
    );
    if (heroRef.current) visibilityObserver.observe(heroRef.current);

    const ctx = gsap.context(() => {
      // Background Ken Burns entrance — scale down + fade in
      gsap.fromTo(bgRef.current,
        { scale: 1.15, opacity: 0 },
        { scale: 1.05, opacity: 1, duration: 2, ease: 'expo.out' }
      );

      // Continuous slow Ken Burns drift
      gsap.to(bgRef.current, {
        scale: 1.12,
        duration: 25,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 2,
      });

      // Overlay gradient breathing
      gsap.to(overlayRef.current, {
        opacity: 0.7,
        duration: 6,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });

      // Animated gradient mesh - slow morphing movement
      if (gradientMeshRef.current) {
        const meshLayers = gradientMeshRef.current.querySelectorAll('.mesh-layer');
        meshLayers.forEach((layer, i) => {
          gsap.to(layer, {
            x: `${30 + i * 20}`,
            y: `${-20 + i * 15}`,
            scale: 1.2,
            duration: 15 + i * 5,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: i * 2,
          });
          gsap.to(layer, {
            opacity: 0.15 + i * 0.05,
            duration: 8 + i * 3,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: i * 1.5,
          });
        });
      }

      // Steam particles - rising animation
      if (steamParticlesRef.current) {
        const steamParticles = steamParticlesRef.current.querySelectorAll('.steam-particle');
        steamParticles.forEach((particle, i) => {
          gsap.fromTo(particle,
            { y: 100, opacity: 0, scale: 0.5 },
            {
              y: -150 - Math.random() * 100,
              opacity: 0.4,
              scale: 1.5,
              duration: 8 + Math.random() * 6,
              ease: 'power1.out',
              repeat: -1,
              delay: i * 1.2,
            }
          );
          gsap.to(particle, {
            x: `+=${-30 + Math.random() * 60}`,
            duration: 6 + Math.random() * 4,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: i * 0.8,
          });
        });
      }

      // Floating light orbs - gentle drift
      if (lightOrbsRef.current) {
        const orbs = lightOrbsRef.current.querySelectorAll('.light-orb');
        orbs.forEach((orb, i) => {
          gsap.to(orb, {
            x: `${100 + i * 50}`,
            y: `${-50 + i * 30}`,
            duration: 20 + i * 8,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: i * 3,
          });
          gsap.to(orb, {
            scale: 1.3,
            opacity: 0.6,
            duration: 10 + i * 4,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: i * 2,
          });
        });
      }

      // Vignette pulse effect
      gsap.to(vignetteRef.current, {
        boxShadow: 'inset 0 0 180px 80px rgba(0,0,0,0.4)',
        duration: 4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });


      // Heading animation — letter-style stagger with lift + rotation
      if (headingRef.current) {
        const words = headingRef.current.querySelectorAll('.word');
        gsap.fromTo(words,
          { y: 80, opacity: 0, rotateX: -20, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            scale: 1,
            duration: 1.0,
            stagger: 0.2,
            delay: 0.8,
            ease: 'expo.out'
          }
        );

        // Subtle continuous float on heading
        gsap.to(words, {
          y: -4,
          duration: 3,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          stagger: 0.5,
          delay: 2.2,
        });

        // Hover effects on each word
        words.forEach((word) => {
          word.addEventListener('mouseenter', () => {
            gsap.to(word, {
              scale: 1.08,
              rotation: Math.random() > 0.5 ? 3 : -3,
              color: '#C25B3A',
              skewX: -2,
              letterSpacing: '0.06em',
              textShadow: '0 0 25px rgba(194,91,58,0.5), 0 0 50px rgba(194,91,58,0.3)',
              duration: 0.35,
              ease: 'back.out(1.7)',
              overwrite: 'auto',
            });
          });
          word.addEventListener('mouseleave', () => {
            gsap.to(word, {
              scale: 1,
              rotation: 0,
              color: '#ffffff',
              skewX: 0,
              letterSpacing: '0.025em',
              textShadow: 'none',
              duration: 0.5,
              ease: 'power2.out',
              overwrite: 'auto',
            });
          });
        });
      }

      // Divider line expands from center
      gsap.fromTo(dividerRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.8, delay: 1.6, ease: 'expo.out' }
      );

      // Divider shimmer loop
      gsap.to(dividerRef.current, {
        backgroundPosition: '200% center',
        duration: 3,
        ease: 'none',
        repeat: -1,
        delay: 2.4,
      });

      // Subheading blur reveal
      gsap.fromTo(subheadingRef.current,
        { filter: 'blur(12px)', opacity: 0, y: 30 },
        { filter: 'blur(0px)', opacity: 1, y: 0, duration: 0.8, delay: 1.8, ease: 'power2.out' }
      );

      // Scroll indicator entrance
      gsap.fromTo(scrollIndicatorRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 2.4, ease: 'power2.out' }
      );

      // Scroll-triggered effects — store scale in data attr for rAF loop
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: '50% top',
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          if (bgRef.current) {
            bgRef.current.dataset.scale = String(1.05 + progress * 0.1);
            bgRef.current.style.marginTop = `${-progress * 60}px`;
          }
          if (contentRef.current) {
            contentRef.current.style.opacity = String(1 - progress * 0.6);
            contentRef.current.style.filter = `blur(${progress * 4}px)`;
          }
          if (scrollIndicatorRef.current) {
            scrollIndicatorRef.current.style.opacity = String(1 - progress * 3);
          }
        }
      });
    }, heroRef);

    return () => {
      ctx.revert();
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId.current);
      visibilityObserver.disconnect();
    };
  }, [handleMouseMove]);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative w-full h-screen overflow-hidden"
    >
      {/* Background Image with Ken Burns */}
      <div
        ref={bgRef}
        className="absolute inset-[-30px] w-[calc(100%+60px)] h-[calc(100%+60px)]"
        style={{ willChange: 'transform' }}
      >
        <img
          src="/hero-bg.webp"
          alt="Coffee Matters café interior at Brick Lane, London"
          className="img-content w-full h-full object-cover"
          fetchPriority="high"
          decoding="async"
        />
      </div>

      {/* Gradient Overlay — breathing */}
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.5) 100%)',
          opacity: 0.85,
        }}
      />

      {/* Floating bokeh / light particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => {
          const size = 6 + Math.random() * 18;
          return (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${5 + Math.random() * 90}%`,
                top: `${10 + Math.random() * 80}%`,
                background: i % 3 === 0
                  ? 'radial-gradient(circle, rgba(255,220,180,0.4) 0%, transparent 70%)'
                  : i % 3 === 1
                  ? 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(194,91,58,0.25) 0%, transparent 70%)',
                filter: `blur(${1 + Math.random() * 2}px)`,
                animation: `heroBokeh ${10 + Math.random() * 15}s ease-in-out infinite`,
                animationDelay: `${Math.random() * -10}s`,
              }}
            />
          );
        })}
      </div>

      {/* Animated Gradient Mesh Overlay */}
      <div
        ref={gradientMeshRef}
        className="absolute inset-0 pointer-events-none overflow-hidden opacity-60"
      >
        <div
          className="mesh-layer absolute w-[150%] h-[150%] -top-1/4 -left-1/4 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(194,91,58,0.15) 0%, transparent 60%)',
          }}
        />
        <div
          className="mesh-layer absolute w-[120%] h-[120%] top-1/3 -right-1/4 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255,220,180,0.12) 0%, transparent 55%)',
          }}
        />
        <div
          className="mesh-layer absolute w-[100%] h-[100%] -bottom-1/4 left-1/4 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(111,127,99,0.1) 0%, transparent 50%)',
          }}
        />
      </div>

      {/* Steam/Dust Particles */}
      <div
        ref={steamParticlesRef}
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        {[...Array(8)].map((_, i) => (
          <div
            key={`steam-${i}`}
            className="steam-particle absolute rounded-full"
            style={{
              width: `${20 + Math.random() * 40}px`,
              height: `${20 + Math.random() * 40}px`,
              left: `${10 + i * 12}%`,
              bottom: '10%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
              filter: 'blur(8px)',
            }}
          />
        ))}
      </div>

      {/* Floating Light Orbs */}
      <div
        ref={lightOrbsRef}
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        {[...Array(5)].map((_, i) => {
          const size = 80 + i * 40;
          return (
            <div
              key={`orb-${i}`}
              className="light-orb absolute rounded-full"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${15 + i * 18}%`,
                top: `${20 + (i % 3) * 25}%`,
                background: i % 2 === 0
                  ? 'radial-gradient(circle, rgba(255,220,180,0.2) 0%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(194,91,58,0.15) 0%, transparent 70%)',
                filter: `blur(${20 + i * 5}px)`,
              }}
            />
          );
        })}
      </div>

      {/* Vignette edge with pulse */}
      <div
        ref={vignetteRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 150px 60px rgba(0,0,0,0.3)',
        }}
      />


      {/* Hero Content */}
      <div
        ref={contentRef}
        className="relative z-10 h-full flex flex-col items-center justify-center text-center section-padding"
        style={{ willChange: 'transform, opacity' }}
      >
        <h1
          ref={headingRef}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-4 tracking-wide"
          style={{ perspective: '1000px' }}
        >
          <span className="word inline-block drop-shadow-[0_2px_20px_rgba(0,0,0,0.4)] cursor-default select-none">COFFEE</span>{' '}
          <span className="word inline-block drop-shadow-[0_2px_20px_rgba(0,0,0,0.4)] cursor-default select-none">MATTERS</span>
          <span className="sr-only"> — Specialty Coffee Shop in Brick Lane, London</span>
        </h1>

        {/* Animated divider line */}
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
          className="max-w-2xl text-base sm:text-lg text-white/90 font-body leading-relaxed px-4 mb-6"
        >
          Dive in heavenly Greek pies, pastries, and coffee delights in the vibrant heart of Bricklane.
        </p>

        {/* Scroll Indicator */}
        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase font-body">Scroll</span>
          <div className="relative w-5 h-9 border border-white/40 rounded-full flex justify-center overflow-hidden">
            <div
              className="w-[3px] h-[3px] bg-white/80 rounded-full mt-2"
              style={{
                animation: 'scrollDot 2s ease-in-out infinite',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
