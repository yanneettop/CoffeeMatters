import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

export default function SweetsBrunch() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      // Image 3D flip entrance
      if (imageRef.current) {
        gsap.fromTo(imageRef.current,
          { rotateY: -30, opacity: 0, x: -50 },
          {
            rotateY: 0,
            opacity: 1,
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

      // Heading animation
      const headingLines = textRef.current?.querySelectorAll('.heading-line');
      if (headingLines && headingLines.length > 0) {
        gsap.fromTo(headingLines,
          { x: 60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // Body text animation
      const paragraphs = textRef.current?.querySelectorAll('p');
      if (paragraphs && paragraphs.length > 0) {
        gsap.fromTo(paragraphs,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 50%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // Button pop animation
      if (buttonRef.current) {
        gsap.fromTo(buttonRef.current,
          { scale: 0.8, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 40%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // Parallax — beans + bg depth layers
      const beansDecos = sectionRef.current?.querySelectorAll('.beans-deco');
      const bgFar = sectionRef.current?.querySelector('.parallax-far');
      const bgNear = sectionRef.current?.querySelector('.parallax-near');

      // Parallax effects
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          // Image parallax with 3D depth
          if (imageRef.current) {
            gsap.set(imageRef.current, {
              y: -30 + progress * 60,
              rotateX: progress * 5 - 2.5
            });
          }
          // Text counter parallax
          if (textRef.current) {
            gsap.set(textRef.current, { y: 20 - progress * 40 });
          }
          beansDecos?.forEach((bean, i) => {
            gsap.set(bean, { y: (i % 2 === 0 ? -15 : 20) + progress * (i % 2 === 0 ? 35 : -25) });
          });
          // Atmospheric depth
          if (bgFar)  gsap.set(bgFar,  { y: 10 - progress * 20, x: 5 - progress * 10 });
          if (bgNear) gsap.set(bgNear, { y: -8 + progress * 16 });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="brunch"
      ref={sectionRef}
      className="relative w-full py-20 md:py-32 bg-cream overflow-hidden"
      style={{ perspective: '1000px' }}
    >
      {/* Atmospheric depth layers */}
      <div className="parallax-far absolute -top-20 -left-20 w-[520px] h-[520px] rounded-full bg-coral/[0.05] pointer-events-none blur-[90px]" />
      <div className="parallax-near absolute -bottom-20 right-[10%] w-[460px] h-[460px] rounded-full bg-[#D8C4B3]/25 pointer-events-none blur-[70px]" />

      {/* Decorative beans - right edge */}
      <img
        src="/beans2.png"
        alt=""
        className="beans-deco absolute -right-12 bottom-16 w-32 lg:w-44 opacity-80 pointer-events-none hidden md:block"
        style={{ transform: 'rotate(-25deg) scaleX(-1)' }}
        loading="lazy"
      />
      <img
        src="/beans2.png"
        alt=""
        className="beans-deco absolute -left-10 top-12 w-24 lg:w-32 opacity-80 pointer-events-none hidden lg:block"
        style={{ transform: 'rotate(30deg)' }}
        loading="lazy"
      />

      <div className="section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-7xl mx-auto">
          {/* Image */}
          <div 
            ref={imageRef}
            className="relative"
            style={{ 
              willChange: 'transform',
              transformStyle: 'preserve-3d'
            }}
          >
            <div className="relative overflow-hidden rounded-lg shadow-2xl img-hover group">
              <img
                src="/pastries-display.jpg"
                alt="Freshly baked Greek pastries and sweets at Coffee Matters, Brick Lane"
                className="img-content w-full h-auto object-cover aspect-square transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-coral/0 group-hover:bg-coral/10 transition-colors duration-500" />
            </div>
            
            {/* Decorative glow */}
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-coral/15 rounded-full blur-3xl" />
          </div>

          {/* Text Content */}
          <div ref={textRef} className="lg:pl-8">
            <div className="mb-8 group">
              <h2 className="text-4xl md:text-5xl lg:text-6xl">
                <span className="heading-line block font-display font-light tracking-widest text-[var(--text-secondary)] transition-[letter-spacing] duration-700 ease-out group-hover:tracking-[0.13em]">SWEETS & PIES</span>
                <span className="heading-line block text-coral transition-[filter] duration-700 ease-out group-hover:brightness-[1.2]" style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic', fontWeight: 400 }}>&amp; BRUNCH</span>
              </h2>
              <div className="heading-line w-16 h-0.5 bg-coral/60 mt-4 transition-[width] duration-700 ease-out group-hover:w-24" />
            </div>
            
            <div className="space-y-6 text-gray-700 font-body leading-relaxed mb-8">
              <p>
                Tired of the same old brunch? Come discover our new Mediterranean-inspired menu. We use authentic ingredients to bring you true flavors from across the sea.
              </p>
              <p>
                We've given classic brunch foods a fresh Greek twist. Our menu blends time-honored recipes with creative new ideas to create something truly special.
              </p>
            </div>

            {/* CTA Button */}
            <a
              ref={buttonRef}
              href="#menu"
              className="btn-outline group inline-flex items-center gap-3 text-coral border-coral hover:bg-coral hover:text-white transition-all duration-300"
            >
              <span>SEE MENU</span>
              <ArrowRight 
                size={18} 
                className="transition-transform duration-300 group-hover:translate-x-2"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
