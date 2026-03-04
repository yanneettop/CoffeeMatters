import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import NewsletterCTA from '@/sections/NewsletterCTA';
import Footer from '@/sections/Footer';

/* ── Ornamental divider (SVG) ─────────────────────────────── */
function OrnamentDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <span className="block h-px w-16 bg-[var(--soft-clay)]/40" />
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-coral opacity-60">
        <path d="M9 0L10.8 7.2L18 9L10.8 10.8L9 18L7.2 10.8L0 9L7.2 7.2L9 0Z" fill="currentColor" />
      </svg>
      <span className="block h-px w-16 bg-[var(--soft-clay)]/40" />
    </div>
  );
}

/* ── Pull Quote ───────────────────────────────────────────── */
function PullQuote({ children, className = '' }: { children: string; className?: string }) {
  return (
    <blockquote
      className={`pull-quote relative py-10 px-6 md:px-16 text-center ${className}`}
    >
      <span className="absolute top-0 left-1/2 -translate-x-1/2 text-[6rem] leading-none font-display text-coral/15 select-none pointer-events-none">
        &ldquo;
      </span>
      <p
        className="relative text-xl md:text-2xl lg:text-3xl leading-relaxed text-[var(--text-secondary)]"
        style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic', fontWeight: 400 }}
      >
        {children}
      </p>
    </blockquote>
  );
}

/* ── Drop cap paragraph ───────────────────────────────────── */
function DropCapParagraph({ text }: { text: string }) {
  const first = text.charAt(0);
  const rest = text.slice(1);

  return (
    <p className="story-paragraph text-[var(--text-secondary)] font-body text-base md:text-lg leading-[1.9] tracking-wide">
      <span
        className="float-left text-6xl md:text-7xl leading-[0.8] mr-3 mt-1 font-display font-bold text-coral"
        style={{ fontFamily: "'DM Serif Display', serif" }}
      >
        {first}
      </span>
      {rest}
    </p>
  );
}

/* ── Story section block ──────────────────────────────────── */
function StorySection({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`story-block ${className}`}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*  ABOUT US PAGE                                             */
/* ═══════════════════════════════════════════════════════════ */

export default function AboutUsPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroLineRef = useRef<HTMLDivElement>(null);
  const heroSubRef = useRef<HTMLParagraphElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!pageRef.current) return;

    const ctx = gsap.context(() => {
      /* ── Hero entrance ─────────────────────────── */
      const heroTl = gsap.timeline({ defaults: { ease: 'expo.out' } });

      if (logoRef.current) {
        heroTl.fromTo(
          logoRef.current,
          { opacity: 0, scale: 0.85, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: 1.2 },
          0,
        );
      }

      if (heroTitleRef.current) {
        const letters = heroTitleRef.current.querySelectorAll('.hero-letter');
        heroTl.fromTo(
          letters,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.04 },
          0.4,
        );
      }

      if (heroLineRef.current) {
        heroTl.fromTo(
          heroLineRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.8 },
          0.8,
        );
      }

      if (heroSubRef.current) {
        heroTl.fromTo(
          heroSubRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.6 },
          1.0,
        );
      }

      /* ── Logo subtle float ──────────────────────── */
      if (logoRef.current) {
        gsap.to(logoRef.current, {
          y: -8,
          duration: 3,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      }

      /* ── Content blocks: scroll-triggered reveals ── */
      const storyBlocks = contentRef.current?.querySelectorAll('.story-block');
      storyBlocks?.forEach((block) => {
        gsap.fromTo(
          block,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: block,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      });

      /* ── Pull quotes: special entrance ──────────── */
      const pullQuotes = contentRef.current?.querySelectorAll('.pull-quote');
      pullQuotes?.forEach((quote) => {
        gsap.fromTo(
          quote,
          { opacity: 0, scale: 0.96 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: quote,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      });

      /* ── Ornament dividers: scale-in ────────────── */
      const ornaments = contentRef.current?.querySelectorAll('.ornament-div');
      ornaments?.forEach((orn) => {
        gsap.fromTo(
          orn,
          { opacity: 0, scaleX: 0 },
          {
            opacity: 1,
            scaleX: 1,
            duration: 0.6,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: orn,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      });

      /* ── Parallax on hero logo ──────────────────── */
      if (heroRef.current && logoRef.current) {
        ScrollTrigger.create({
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => {
            if (logoRef.current) {
              gsap.set(logoRef.current, {
                y: self.progress * 60,
                scale: 1 - self.progress * 0.08,
              });
            }
          },
        });
      }
    }, pageRef);

    return () => ctx.revert();
  }, []);

  /* ── Split title into letters for animation ──────────── */
  const titleLetters = 'OUR STORY'.split('');

  return (
    <div ref={pageRef}>
      {/* ═══════════════════════════════════════════════════ */}
      {/*  HERO — Dark background with logo                  */}
      {/* ═══════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative w-full min-h-[85vh] flex flex-col items-center justify-center bg-dark overflow-hidden pt-24 pb-16"
      >
        {/* Grain texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
          }}
        />

        {/* Subtle radial glow behind the logo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[var(--coral)] opacity-[0.06] blur-[120px] pointer-events-none" />

        {/* Logo illustration */}
        <div className="relative mb-10">
          <img
            ref={logoRef}
            src="/logo-black.png"
            alt="Coffee Matters storefront illustration"
            className="relative w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 object-contain"
            style={{ filter: 'invert(1) sepia(0.5) saturate(1.2) brightness(0.95) hue-rotate(-10deg)', mixBlendMode: 'lighten' }}
          />
        </div>

        {/* Title */}
        <h1
          ref={heroTitleRef}
          className="relative text-center font-display font-light tracking-[0.35em] text-4xl md:text-5xl lg:text-6xl text-white/90 uppercase"
        >
          {titleLetters.map((char, i) => (
            <span key={i} className="hero-letter inline-block">
              {char === ' ' ? '\u00A0\u00A0' : char}
            </span>
          ))}
        </h1>

        {/* Accent line */}
        <div
          ref={heroLineRef}
          className="relative w-20 h-0.5 bg-coral mt-6 origin-center"
        />

        {/* Subtitle */}
        <p
          ref={heroSubRef}
          className="relative mt-5 text-white/50 text-sm md:text-base tracking-[0.2em] uppercase font-body"
        >
          Est. Bricklane, London
        </p>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
          <span className="text-[10px] tracking-[0.3em] uppercase font-body">Scroll</span>
          <div className="w-px h-8 bg-white/20 relative overflow-hidden">
            <div
              className="absolute top-0 left-0 w-full h-3 bg-coral/60"
              style={{ animation: 'scrollDot 2s ease-in-out infinite' }}
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ */}
      {/*  STORY CONTENT                                      */}
      {/* ═══════════════════════════════════════════════════ */}
      <div ref={contentRef} className="bg-cream">
        <div className="max-w-3xl mx-auto px-6 md:px-8 py-20 md:py-28">

          {/* ── Chapter 1: The Beginning ──────────────── */}
          <StorySection className="mb-16">
            <DropCapParagraph text="Coffee Matters began as a shared dream among three Greek friends who believed in the power of a good cup of coffee to bring people together. Our journey from coffee enthusiasts to café owners is a testament to the passion that drives us every day." />
          </StorySection>

          <OrnamentDivider className="ornament-div mb-16" />

          {/* ── Chapter 2: Heritage ───────────────────── */}
          <StorySection className="mb-12">
            <p className="story-paragraph text-[var(--text-secondary)] font-body text-base md:text-lg leading-[1.9] tracking-wide">
              Growing up surrounded by rich coffee traditions, we always knew there was something special about the way coffee could create moments of joy, spark conversations, and build connections. When we moved to this community, we saw an opportunity to share our love for quality brews and Mediterranean flavors with our new neighbors.
            </p>
          </StorySection>

          {/* ── Pull Quote ────────────────────────────── */}
          <PullQuote className="mb-12">
            Something special about the way coffee could create moments of joy, spark conversations, and build connections.
          </PullQuote>

          <OrnamentDivider className="ornament-div mb-16" />

          {/* ── Chapter 3: Building ───────────────────── */}
          <StorySection className="mb-16">
            <p className="story-paragraph text-[var(--text-secondary)] font-body text-base md:text-lg leading-[1.9] tracking-wide">
              Our independent coffee shop is the result of countless late-night planning sessions, early morning tastings, and a commitment to creating a space that feels like home to everyone who walks through our doors. We've poured our hearts into selecting the finest beans, perfecting our roasts, and crafting a menu that blends our Greek heritage with local tastes.
            </p>
          </StorySection>

          {/* ── Full-width image break ────────────────── */}
          <StorySection className="mb-16">
            <div className="relative -mx-6 md:-mx-12 lg:-mx-24 overflow-hidden rounded-lg shadow-xl img-hover group">
              <img
                src="/about-storefront.jpg"
                alt="Inside Coffee Matters"
                className="img-content w-full h-64 md:h-80 lg:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <p
                className="absolute bottom-4 left-6 text-white/70 text-xs tracking-[0.2em] uppercase font-body"
              >
                Our home on Bethnal Green Road
              </p>
            </div>
          </StorySection>

          <OrnamentDivider className="ornament-div mb-16" />

          {/* ── Chapter 4: Community ──────────────────── */}
          <StorySection className="mb-12">
            <p className="story-paragraph text-[var(--text-secondary)] font-body text-base md:text-lg leading-[1.9] tracking-wide">
              But Coffee Matters is about more than just great coffee and food. It's about the community we're building. Every day, we strive to create a welcoming environment where friends can catch up, strangers can become friends, and everyone can find a moment of peace in their busy day.
            </p>
          </StorySection>

          {/* ── Pull Quote ────────────────────────────── */}
          <PullQuote className="mb-12">
            A welcoming environment where friends can catch up, strangers can become friends, and everyone can find a moment of peace.
          </PullQuote>

          <OrnamentDivider className="ornament-div mb-16" />

          {/* ── Chapter 5: Dedication ─────────────────── */}
          <StorySection className="mb-16">
            <p className="story-paragraph text-[var(--text-secondary)] font-body text-base md:text-lg leading-[1.9] tracking-wide">
              From our carefully curated coffee selection to our Mediterranean-inspired treats, every aspect of Coffee Matters reflects our dedication to quality and authenticity. We're constantly exploring new flavors, refining our techniques, and listening to our customers to ensure we're always serving up the best experience possible.
            </p>
          </StorySection>

          {/* ── Chapter 6: Vision ─────────────────────── */}
          <StorySection className="mb-12">
            <p className="story-paragraph text-[var(--text-secondary)] font-body text-base md:text-lg leading-[1.9] tracking-wide">
              As we continue to grow and evolve, our core vision remains the same: to share our passion for excellent coffee and food while fostering a sense of community. Whether you're grabbing a quick espresso on your way to work or settling in for a leisurely brunch with friends, we're honored to be part of your day.
            </p>
          </StorySection>

          <OrnamentDivider className="ornament-div mb-16" />

          {/* ── Closing — Thank You ───────────────────── */}
          <StorySection className="mb-20 text-center">
            <p
              className="text-2xl md:text-3xl lg:text-4xl leading-snug text-[var(--text-primary)] mb-8"
              style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic', fontWeight: 400 }}
            >
              Thank you for being part of our story.<br />
              We can't wait to serve you and hear yours.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
              <a
                href="#menu"
                className="btn-outline group inline-flex items-center gap-3 text-coral border-coral hover:bg-coral hover:text-white transition-all duration-300"
              >
                <span>SEE OUR MENU</span>
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-2"
                />
              </a>
              <a
                href="#contact"
                className="btn-outline group inline-flex items-center gap-3 text-[var(--text-secondary)] border-[var(--text-secondary)] hover:bg-[var(--dark)] hover:border-[var(--dark)] hover:text-white transition-all duration-300"
              >
                <span>VISIT US</span>
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-2"
                />
              </a>
            </div>
          </StorySection>
        </div>
      </div>

      <NewsletterCTA />
      <Footer />
    </div>
  );
}
