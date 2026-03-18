import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Review {
  name: string;
  rating: number;
  text: string;
  timeAgo: string;
}

const reviews: Review[] = [
  {
    name: 'Maria K.',
    rating: 5,
    text: 'Absolutely love this place! The freddo espresso is the best I\'ve had outside of Greece. The staff are so warm and welcoming, it feels like visiting family.',
    timeAgo: '2 weeks ago',
  },
  {
    name: 'James T.',
    rating: 5,
    text: 'Hidden gem on Brick Lane. The spanakopita is incredible and the coffee is consistently excellent. Perfect spot for a quiet morning or catching up with friends.',
    timeAgo: '1 month ago',
  },
  {
    name: 'Sophie L.',
    rating: 5,
    text: 'Best brunch spot in East London, hands down. The Greek twist on everything makes it so unique. The baklava is to die for and the freddo cappuccino is perfection.',
    timeAgo: '3 weeks ago',
  },
  {
    name: 'Alex P.',
    rating: 5,
    text: 'We hosted a private event here and it was fantastic. The team went above and beyond to make sure everything was perfect. Amazing food, beautiful space.',
    timeAgo: '1 month ago',
  },
  {
    name: 'Elena D.',
    rating: 5,
    text: 'The most authentic Greek pastries I\'ve found in London. Every visit feels special — the atmosphere is cozy, the art on the walls is beautiful, and the coffee is superb.',
    timeAgo: '2 months ago',
  },
  {
    name: 'Tom R.',
    rating: 5,
    text: 'My go-to café in the area. Great specialty coffee, the homemade pies are always fresh, and the vibe is so relaxed. You can tell they really care about what they do.',
    timeAgo: '3 weeks ago',
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? 'fill-[#FBBC04] text-[#FBBC04]' : 'fill-gray-200 text-gray-200'}
        />
      ))}
    </div>
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

        // Header fade up
        const header = sectionRef.current?.querySelector('.reviews-header');
        if (header) {
          gsap.fromTo(header, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', scrollTrigger: st });
        }

        // Cards stagger reveal
        const cards = cardsRef.current?.querySelectorAll('.review-card');
        if (cards && cards.length > 0) {
          gsap.fromTo(cards,
            { y: 40, opacity: 0, scale: 0.97 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.5,
              stagger: 0.1,
              ease: 'power2.out',
              scrollTrigger: { trigger: cardsRef.current, start: 'top 80%', once: true },
            }
          );
        }

        // CTA link
        const cta = sectionRef.current?.querySelector('.reviews-cta');
        if (cta) {
          gsap.fromTo(cta, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, delay: 0.3, ease: 'power2.out', scrollTrigger: { trigger: cta, start: 'top 90%', once: true } });
        }
      }, sectionRef);
      return () => ctx.revert();
    }

    const ctx = gsap.context(() => {
      // Header animation
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

      // Cards stagger
      const cards = cardsRef.current?.querySelectorAll('.review-card');
      if (cards && cards.length > 0) {
        gsap.fromTo(cards,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 70%',
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
      className="relative py-16 sm:py-24 md:py-32 bg-cream overflow-hidden"
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
        <div className="reviews-header text-center mb-14 sm:mb-20">
          {/* Google G icon */}
          <div className="flex items-center justify-center gap-2.5 mb-5">
            <svg width="24" height="24" viewBox="0 0 24 24" className="flex-shrink-0">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="font-body text-[#5a4a3f]/60 uppercase tracking-[0.25em]" style={{ fontSize: '10px' }}>
              Google Reviews
            </span>
          </div>

          {/* Rating display */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="font-display text-4xl sm:text-5xl text-[#2B2623]" style={{ fontWeight: 600 }}>4.8</span>
            <div className="flex flex-col items-start gap-1">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={18} className={i < 5 ? 'fill-[#FBBC04] text-[#FBBC04]' : 'fill-gray-200 text-gray-200'} />
                ))}
              </div>
              <span className="font-body text-[#5a4a3f]/70 text-xs">Based on 200+ reviews</span>
            </div>
          </div>

          <p
            className="font-accent text-[#5a4a3f] max-w-md mx-auto"
            style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)' }}
          >
            What our guests are saying
          </p>
        </div>

        {/* Reviews Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 max-w-6xl mx-auto"
        >
          {reviews.map((review, i) => (
            <div
              key={i}
              className="review-card group relative bg-white/70 backdrop-blur-sm rounded-2xl p-6 sm:p-7 lg:p-8 transition-all duration-500 hover:bg-white hover:shadow-lg hover:shadow-[#c25b3a]/[0.04] border border-white/80 hover:border-[#c25b3a]/10"
            >
              {/* Quote mark */}
              <div
                className="absolute top-4 right-5 font-display text-[#c25b3a]/[0.08] select-none pointer-events-none leading-none"
                style={{ fontSize: '4rem' }}
              >
                "
              </div>

              {/* Header: name + stars */}
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-2">
                  {/* Avatar */}
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-body text-sm flex-shrink-0"
                    style={{
                      background: `hsl(${15 + i * 25}, 45%, ${45 + (i % 3) * 8}%)`,
                      fontWeight: 500,
                    }}
                  >
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-body text-[#2B2623] text-sm" style={{ fontWeight: 500 }}>
                      {review.name}
                    </p>
                    <p className="font-body text-[#5a4a3f]/50 text-xs">{review.timeAgo}</p>
                  </div>
                </div>
                <StarRating rating={review.rating} />
              </div>

              {/* Review text */}
              <p className="font-body text-[#5a4a3f]/80 text-sm leading-relaxed" style={{ fontWeight: 300 }}>
                {review.text}
              </p>
            </div>
          ))}
        </div>

        {/* CTA to Google */}
        <div className="reviews-cta text-center mt-12 sm:mt-16">
          <a
            href="https://www.google.com/search?q=Coffee+Matters+157+Bethnal+Green+Road+Reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 font-body text-[#5a4a3f]/70 hover:text-[#c25b3a] transition-colors duration-300 group"
            style={{ fontSize: '13px', fontWeight: 400 }}
          >
            <span className="uppercase tracking-[0.15em]">Read all reviews on Google</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
