import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface StatItem {
  label: string;
  value: string;
  endValue: number;
  suffix: string;
}

const stats: StatItem[] = [
  { label: 'Years of Excellence', value: '0', endValue: 10, suffix: '+' },
  { label: 'Coffees Served Daily', value: '0', endValue: 500, suffix: '+' },
  { label: 'Customer Rating', value: '0', endValue: 4.8, suffix: '★' },
  { label: 'Unique Recipes', value: '0', endValue: 45, suffix: '+' },
];

export default function Stats() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const counterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (!sectionRef.current || animated) return;

    gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 60%',
        onEnter: () => {
          // Animate each counter
          stats.forEach((stat, i) => {
            const counter = { value: 0 };
            gsap.to(counter, {
              value: stat.endValue,
              duration: 2.5,
              ease: 'power2.out',
              delay: i * 0.1,
              onUpdate: () => {
                if (counterRefs.current[i]) {
                  const displayValue =
                    stat.endValue === 4.8
                      ? counter.value.toFixed(1)
                      : Math.round(counter.value);
                  counterRefs.current[i]!.textContent = displayValue + stat.suffix;
                }
              },
            });
          });

          setAnimated(true);
          trigger.kill();
        },
      });
    }, sectionRef);

    return () => {
      gsap.context(() => {}, sectionRef).revert();
    };
  }, [animated]);

  return (
    <section ref={sectionRef} id="stats" className="relative py-24 bg-gradient-to-b from-cream to-white">
      <div className="section-padding">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Coffee Matters in Numbers
          </h2>
          <p className="text-lg text-gray-600">
            Join our community of coffee lovers and pastry enthusiasts
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="group relative bg-white rounded-lg p-8 text-center shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-[#C25B3A]/30"
            >
              {/* Decorative accent */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-[#C25B3A] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Counter value */}
              <div
                ref={(el) => {
                  counterRefs.current[i] = el;
                }}
                className="text-5xl md:text-6xl font-bold text-[#C25B3A] mb-3"
              >
                0{stats[i].suffix}
              </div>

              {/* Label */}
              <p className="text-gray-600 text-sm md:text-base font-medium tracking-wide">
                {stat.label}
              </p>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#C25B3A] group-hover:w-full transition-all duration-500" />
            </div>
          ))}
        </div>

        {/* Bottom text */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 max-w-2xl mx-auto">
            Every cup we serve is crafted with passion, using the finest ingredients and traditional Mediterranean recipes passed down through generations.
          </p>
        </div>
      </div>
    </section>
  );
}
