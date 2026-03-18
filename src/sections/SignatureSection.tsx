import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const highlights = [
  {
    label: 'Specialty Coffee',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
        <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
        <line x1="6" y1="2" x2="6" y2="4" />
        <line x1="10" y1="2" x2="10" y2="4" />
        <line x1="14" y1="2" x2="14" y2="4" />
      </svg>
    ),
  },
  {
    label: 'Homemade Bakes',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11l19-9-9 19-2-8-8-2z" />
      </svg>
    ),
  },
  {
    label: 'Brick Lane Vibes',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
];

export default function SignatureSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 1024) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      });

      tl.fromTo('.sig-ornament',
        { opacity: 0, scaleX: 0 },
        { opacity: 1, scaleX: 1, duration: 0.6, ease: 'expo.out' }
      )
        .fromTo('.sig-eyebrow',
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          '-=0.2'
        )
        .fromTo('.sig-statement',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' },
          '-=0.25'
        )
        .fromTo('.sig-divider',
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.5, ease: 'expo.out' },
          '-=0.2'
        )
        .fromTo('.sig-badge',
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' },
          '-=0.15'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#EFE6DC] py-12 sm:py-20 md:py-28 overflow-hidden"
      aria-label="Brand highlights"
    >
      {/* Subtle warm texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(194,91,58,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-sm sm:max-w-2xl mx-auto px-6 text-center">

        {/* Top ornament */}
        <div className="sig-ornament flex items-center justify-center gap-3 sm:gap-4 mb-7 sm:mb-10 origin-center">
          <div className="h-px bg-gradient-to-r from-transparent to-[#c25b3a]/35" style={{ width: '36px' }} />
          <div className="w-1 h-1 rounded-full bg-[#c25b3a]/55" />
          <div className="h-px bg-gradient-to-l from-transparent to-[#c25b3a]/35" style={{ width: '36px' }} />
        </div>

        {/* Eyebrow */}
        <p
          className="sig-eyebrow font-body uppercase tracking-[0.3em] sm:tracking-[0.35em] text-[#B9896B] mb-4 sm:mb-6"
          style={{ fontSize: '9px' }}
        >
          A place to slow down
        </p>

        {/* Brand statement */}
        <div className="sig-statement mb-7 sm:mb-10">
          <p
            className="font-accent text-[#2B2623] leading-[1.2]"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}
          >
            Coffee. Brunch.
          </p>
          <p
            className="font-accent text-[#c25b3a] leading-[1.2]"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}
          >
            Greek touch.
          </p>
        </div>

        {/* Divider */}
        <div
          className="sig-divider mx-auto mb-8 sm:mb-12 origin-center"
          style={{
            width: '40px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(194,91,58,0.5), transparent)',
          }}
        />

        {/* Highlight badges */}
        <div className="flex items-center justify-center">
          {highlights.map((item, i) => (
            <div key={item.label} className="flex items-center">
              {/* Badge */}
              <div className="sig-badge flex flex-col items-center gap-2.5 sm:gap-3 px-4 sm:px-8">
                <span className="text-[#c25b3a]/80">{item.icon}</span>
                <span
                  className="font-body uppercase tracking-[0.18em] sm:tracking-[0.22em] text-[#5a4a3f]/80 leading-tight"
                  style={{ fontSize: '9px' }}
                >
                  {item.label}
                </span>
              </div>

              {/* Separator between badges */}
              {i < highlights.length - 1 && (
                <div
                  className="self-stretch w-px"
                  style={{
                    background: 'linear-gradient(to bottom, transparent, rgba(194,91,58,0.2), transparent)',
                    minHeight: '36px',
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Bottom ornament */}
        <div className="sig-ornament flex items-center justify-center gap-3 sm:gap-4 mt-7 sm:mt-10 origin-center">
          <div className="h-px bg-gradient-to-r from-transparent to-[#c25b3a]/35" style={{ width: '36px' }} />
          <div className="w-1 h-1 rounded-full bg-[#c25b3a]/55" />
          <div className="h-px bg-gradient-to-l from-transparent to-[#c25b3a]/35" style={{ width: '36px' }} />
        </div>
      </div>
    </section>
  );
}
