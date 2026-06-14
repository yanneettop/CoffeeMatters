import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star } from 'lucide-react';
import ButtonWithIcon from '@/components/ui/button-witn-icon';

gsap.registerPlugin(ScrollTrigger);

type ReviewSource = 'Google' | 'TripAdvisor';

interface Review {
  name: string;
  rating: number;
  text: string;
  source: ReviewSource;
}

const reviews: Review[] = [
  {
    name: 'Sofia M.',
    rating: 5,
    text: 'The Freddo Espresso is unlike anything I\'ve had in London. The Greek touch makes it special.',
    source: 'Google',
  },
  {
    name: 'James R.',
    rating: 5,
    text: 'A hidden gem on Brick Lane. Beautiful space, excellent coffee, and the pastries are homemade and delicious.',
    source: 'Google',
  },
  {
    name: 'Maria L.',
    rating: 5,
    text: 'Visited on a rainy afternoon and instantly felt at home. The staff are incredibly warm and the brunch is outstanding.',
    source: 'TripAdvisor',
  },
  {
    name: 'Niko P.',
    rating: 5,
    text: 'Authentic Greek flavours done right. The spanakopita and freddo combo has become my weekly ritual.',
    source: 'Google',
  },
  {
    name: 'Hannah W.',
    rating: 5,
    text: 'Cosy spot with genuinely friendly staff. The coffee is excellent and the homemade cakes sell out fast.',
    source: 'TripAdvisor',
  },
  {
    name: 'Daniel K.',
    rating: 5,
    text: 'Great little café just off the main drag. Relaxed atmosphere, strong coffee, and generous brunch portions.',
    source: 'Google',
  },
];

const RATING_AVG = 4.7;
const RATING_COUNT = 570;
const REVIEWS_URL =
  'https://www.google.com/search?si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOZRvzI1h5HRC6S0CKC-L_K7B-ylURyMF4oSIxrJF5XkYHM-bxwZImmjWDcsWhJhkc4xq2jNdwNya_xL2USDeDPsloqOc&q=Coffee+Matters+Reviews';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={15}
          className={i < rating ? 'fill-[var(--coral)] text-[var(--coral)]' : 'fill-gray-200 text-gray-200'}
        />
      ))}
    </div>
  );
}

function GoogleLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="flex-shrink-0" aria-hidden>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function AggregateStars({ rating }: { rating: number }) {
  const pct = (rating / 5) * 100;
  return (
    <div className="relative inline-flex" aria-label={`${rating} out of 5 stars`}>
      {/* Empty base */}
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={18} className="fill-gray-200 text-gray-200" />
        ))}
      </div>
      {/* Filled overlay, clipped to rating */}
      <div className="absolute inset-0 overflow-hidden flex gap-0.5" style={{ width: `${pct}%` }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={18} className="fill-[var(--coral)] text-[var(--coral)] flex-shrink-0" />
        ))}
      </div>
    </div>
  );
}

function SourceBadge({ source }: { source: ReviewSource }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--cream)] border border-[var(--sandstone)]/60 px-2.5 py-1 font-body text-[10px] uppercase tracking-[0.12em] text-[var(--text-secondary)]">
      {source === 'Google' ? (
        <svg width="12" height="12" viewBox="0 0 24 24" className="flex-shrink-0" aria-hidden>
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 24 24" className="flex-shrink-0" aria-hidden>
          <circle cx="12" cy="12" r="11" fill="#34E0A1" />
          <circle cx="8" cy="13" r="3" fill="#fff" />
          <circle cx="16" cy="13" r="3" fill="#fff" />
          <circle cx="8" cy="13" r="1.3" fill="#000" />
          <circle cx="16" cy="13" r="1.3" fill="#000" />
          <path d="M12 8.5c1.6-1.2 3.7-1.9 6-1.9-1 .7-1.7 1.7-2 2.9M12 8.5C10.4 7.3 8.3 6.6 6 6.6c1 .7 1.7 1.7 2 2.9" stroke="#000" strokeWidth="0.9" fill="none" strokeLinecap="round" />
        </svg>
      )}
      {source}
    </span>
  );
}

export default function GoogleReviews() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const isMobile = window.innerWidth < 1024;

    if (isMobile) {
      const ctx = gsap.context(() => {
        const st = { trigger: sectionRef.current, start: 'top 78%', once: true };

        const header = sectionRef.current?.querySelector('.reviews-header');
        if (header) {
          gsap.fromTo(header, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', scrollTrigger: st });
        }

        const cards = cardsRef.current?.querySelectorAll('.review-card');
        if (cards && cards.length > 0) {
          gsap.fromTo(cards,
            { y: 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.4,
              stagger: 0.05,
              ease: 'power3.out',
              scrollTrigger: { trigger: cardsRef.current, start: 'top 92%', once: true },
            }
          );
        }

        const cta = sectionRef.current?.querySelector('.reviews-cta');
        if (cta) {
          gsap.fromTo(cta, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, delay: 0.3, ease: 'power2.out', scrollTrigger: { trigger: cta, start: 'top 90%', once: true } });
        }
      }, sectionRef);
      return () => ctx.revert();
    }

    const ctx = gsap.context(() => {
      gsap.fromTo('.reviews-header',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      const cards = cardsRef.current?.querySelectorAll('.review-card');
      if (cards && cards.length > 0) {
        gsap.fromTo(cards,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.06,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative section-y-compact bg-cream overflow-hidden"
    >
      {/* Subtle warm gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(194,91,58,0.03) 0%, transparent 70%)',
        }}
      />

      <div className="section-padding relative">
        {/* Header */}
        <div className="reviews-header text-center mb-12 md:mb-14 lg:mb-16">
          <p className="font-body text-[var(--coral)] uppercase tracking-[0.3em] mb-4" style={{ fontSize: '11px' }}>
            A Place to Love
          </p>
          <h2
            className="font-display section-heading text-[var(--text-primary)]"
            style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400 }}
          >
            What our guests say
          </h2>

          {/* Google rating badge */}
          <div className="mt-7 flex justify-center">
            <a
              href={REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3.5 rounded-2xl bg-white border border-[var(--sandstone)]/50 shadow-sm px-5 py-3 transition-all duration-300 hover:shadow-md hover:border-[var(--coral)]/20 hover:-translate-y-0.5"
            >
              <GoogleLogo size={26} />
              <div className="flex flex-col items-start text-left">
                <span className="font-body text-[11px] uppercase tracking-[0.16em] text-[var(--text-secondary)]/70">
                  Google Reviews
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-display text-xl text-[var(--text-primary)]" style={{ fontWeight: 600 }}>
                    {RATING_AVG.toFixed(1)}
                  </span>
                  <AggregateStars rating={RATING_AVG} />
                  <span className="font-body text-[var(--text-secondary)]/60 text-xs">
                    ({RATING_COUNT})
                  </span>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Reviews Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 xl:gap-8 max-w-[1120px] mx-auto"
        >
          {reviews.map((review, i) => (
            <div
              key={i}
              className="review-card group relative flex flex-col bg-white rounded-2xl p-6 md:p-7 xl:p-8 border border-[var(--sandstone)]/50 shadow-sm transition-all duration-500 hover:shadow-lg hover:shadow-[var(--coral)]/[0.06] hover:border-[var(--coral)]/20"
            >
              {/* Stars */}
              <div className="mb-4">
                <StarRating rating={review.rating} />
              </div>

              {/* Review text */}
              <p className="font-body text-[var(--text-secondary)] leading-relaxed mb-6 flex-1" style={{ fontSize: '0.95rem' }}>
                "{review.text}"
              </p>

              {/* Footer: name + source */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-[var(--sandstone)]/40">
                <p className="font-body text-[var(--text-primary)]" style={{ fontWeight: 500, fontSize: '0.9rem' }}>
                  {review.name}
                </p>
                <SourceBadge source={review.source} />
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="reviews-cta flex justify-center mt-12 sm:mt-16">
          <ButtonWithIcon
            href={REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
          >
            Read More Reviews
          </ButtonWithIcon>
        </div>
      </div>
    </section>
  );
}
