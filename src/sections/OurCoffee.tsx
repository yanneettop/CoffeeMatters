import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function OurCoffee() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      // Heading animation
      const headingWords = headingRef.current?.querySelectorAll('.heading-word');
      if (headingWords && headingWords.length > 0) {
        gsap.fromTo(headingWords,
          { x: -80, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // Body text animation
      const paragraphs = textRef.current?.querySelectorAll('p');
      if (paragraphs && paragraphs.length > 0) {
        gsap.fromTo(paragraphs,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // Highlighted terms animation
      const highlights = textRef.current?.querySelectorAll('.highlight');
      if (highlights && highlights.length > 0) {
        gsap.fromTo(highlights,
          { color: '#333', scale: 1 },
          {
            color: '#c25b3a',
            scale: 1.02,
            duration: 0.4,
            stagger: 0.1,
            ease: 'elastic.out(1, 0.5)',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 50%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // Image reveal animation
      if (imageRef.current) {
        gsap.fromTo(imageRef.current,
          { clipPath: 'inset(0 100% 0 0)', x: 50 },
          {
            clipPath: 'inset(0 0% 0 0)',
            x: 0,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // Parallax — beans + bg depth layers
      const beansDecos = sectionRef.current?.querySelectorAll('.beans-deco');
      const bgFar = sectionRef.current?.querySelector('.parallax-far');
      const bgNear = sectionRef.current?.querySelector('.parallax-near');

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          if (textRef.current) {
            gsap.set(textRef.current, { y: 30 - progress * 60 });
          }
          if (imageRef.current) {
            gsap.set(imageRef.current, { y: -20 + progress * 40 });
          }
          beansDecos?.forEach((bean, i) => {
            gsap.set(bean, { y: (i % 2 === 0 ? -20 : 15) + progress * (i % 2 === 0 ? 40 : -30) });
          });
          // Atmospheric depth — ultra-slow, counter-directional
          if (bgFar)  gsap.set(bgFar,  { y: -12 + progress * 24 });          // sinks slightly
          if (bgNear) gsap.set(bgNear, { y: 10  - progress * 20, x: -5 + progress * 10 }); // drifts
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full py-20 md:py-32 bg-cream overflow-hidden"
    >
      {/* Atmospheric depth layers — ultra-slow parallax, creates genuine multi-plane depth */}
      <div className="parallax-far absolute -top-24 right-[20%] w-[560px] h-[560px] rounded-full bg-coral/[0.06] pointer-events-none blur-[100px]" />
      <div className="parallax-near absolute -bottom-24 -left-16 w-[440px] h-[440px] rounded-full bg-[#D8C4B3]/30 pointer-events-none blur-[80px]" />

      {/* Decorative beans - right edge */}
      <img
        src="/beans2.png"
        alt=""
        className="beans-deco absolute -right-10 top-1/4 w-36 lg:w-48 opacity-80 pointer-events-none hidden md:block"
        style={{ transform: 'rotate(15deg)' }}
        loading="lazy"
      />
      <img
        src="/beans2.png"
        alt=""
        className="beans-deco absolute -left-16 bottom-8 w-28 lg:w-36 opacity-80 pointer-events-none hidden lg:block"
        style={{ transform: 'rotate(-160deg) scaleX(-1)' }}
        loading="lazy"
      />

      <div className="section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-7xl mx-auto">
          {/* Text Content */}
          <div ref={textRef} className="order-2 lg:order-1">
            <div ref={headingRef} className="mb-8 group">
              <h2 className="text-4xl md:text-5xl lg:text-6xl">
                <span className="heading-word inline-block font-display font-light tracking-widest text-[var(--text-secondary)] transition-[letter-spacing] duration-700 ease-out group-hover:tracking-[0.13em]">OUR</span>
                <br />
                <span className="heading-word inline-block text-coral transition-[filter] duration-700 ease-out group-hover:brightness-[1.2]" style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic', fontWeight: 400 }}>COFFEE</span>
              </h2>
              <div className="heading-word w-16 h-0.5 bg-coral/60 mt-4 transition-[width] duration-700 ease-out group-hover:w-24" />
            </div>
            
            <div className="space-y-6 text-gray-700 font-body leading-relaxed">
              <p>
                At Coffee Matters, we take pride in our expertly crafted brews. Our signature blend features double-origin beans from Brazil and Peru, delivering a rich, complex flavor profile.
              </p>
              <p>
                What truly sets us apart is our exclusive Greek-style{' '}
                <span className="highlight font-semibold text-coral inline-block transition-opacity duration-300 hover:opacity-75">
                  Freddo Espresso
                </span>
                {' '}and{' '}
                <span className="highlight font-semibold text-coral inline-block transition-opacity duration-300 hover:opacity-75">
                  Freddo Cappuccino
                </span>
                . These refreshing iced coffee creations offer a perfect balance of bold espresso and velvety smoothness.
              </p>
            </div>
          </div>

          {/* Image */}
          <div 
            ref={imageRef}
            className="order-1 lg:order-2 relative"
            style={{ willChange: 'transform, clip-path' }}
          >
            <div className="relative overflow-hidden rounded-lg shadow-2xl img-hover group">
              <img
                src="/coffee-drinks.jpg"
                alt="Freddo Espresso and specialty iced coffee drinks at Coffee Matters"
                className="img-content w-full h-auto object-cover aspect-square"
                loading="lazy"
              />
              {/* Subtle overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
            </div>
            
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-coral/10 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
