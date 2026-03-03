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
  'COFFEE MATTERS  ·  BRICKLANE  ·  GREEK ESPRESSO  ·  FRESHLY BAKED  ·  COME SIT WITH US  ·  ';

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
            // At progress 0 (just entered from bottom): offset = direction * -140
            // At progress 0.5 (centred in view):        offset = 0
            // At progress 1 (just left at top):          offset = direction * +140
            gsap.set(innerRef.current, {
              x: direction * (self.progress - 0.5) * 280,
            });
          }
        },
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, [direction]);

  // Repeat enough times to fill any screen width before + after the shift
  const repeated = Array(6).fill(text).join('');

  return (
    <div
      ref={wrapperRef}
      className="w-full overflow-hidden py-[18px] border-y border-coral/[0.18]"
      aria-hidden="true"
      style={{ backgroundColor: 'var(--cream)' }}
    >
      <div
        ref={innerRef}
        className="whitespace-nowrap select-none"
        style={{ willChange: 'transform' }}
      >
        <span
          className="font-display text-xl md:text-2xl font-light tracking-[0.55em] uppercase"
          style={{ color: 'rgba(194, 91, 58, 0.28)' }}
        >
          {repeated}
        </span>
      </div>
    </div>
  );
}
