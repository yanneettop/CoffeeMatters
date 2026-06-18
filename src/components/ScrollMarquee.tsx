import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface ScrollMarqueeProps {
  /** Text to repeat across the strip. Default: Coffee Matters tagline. */
  text?: string;
  /** -1 = slides left as you scroll down (default). 1 = slides right. */
  direction?: 1 | -1;
}

const DEFAULT_TEXT =
  'SPECIALTY COFFEE · GREEK BRUNCH · HOMEMADE BAKES · VISIT US ON BRICK LANE · ';

export default function ScrollMarquee({
  text = DEFAULT_TEXT,
  direction = -1,
}: ScrollMarqueeProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.6,
        onUpdate: (self) => {
          if (innerRef.current) {
            // Keep the scroll drift slow so the strip reads as atmosphere, not promotion.
            gsap.set(innerRef.current, {
              x: direction * (self.progress - 0.5) * 180,
            });
          }
        },
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, [direction]);

  // Repeat enough times to fill wide screens and keep the strip seamless.
  const repeated = Array(8).fill(text).join('');

  return (
    <div
      ref={wrapperRef}
      className="w-full overflow-hidden py-4 md:py-6 border-y border-coral/[0.16]"
      aria-hidden="true"
      style={{ backgroundColor: 'var(--cream)' }}
    >
      <div
        ref={innerRef}
        className="whitespace-nowrap select-none"
        style={{ willChange: 'transform' }}
      >
        <span
          className="font-display text-[1.05rem] leading-none md:text-2xl lg:text-[1.7rem] font-light tracking-[0.28em] md:tracking-[0.34em] uppercase"
          style={{ color: 'rgba(142, 82, 56, 0.5)' }}
        >
          {repeated}
        </span>
      </div>
    </div>
  );
}
