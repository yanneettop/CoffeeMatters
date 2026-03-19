import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import ButtonWithIcon from '@/components/ui/button-witn-icon';

export default function AboutUs() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const isMobile = window.innerWidth < 1024;

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    if (isMobile) {
      const ctx = gsap.context(() => {
        const st = { trigger: sectionRef.current, start: 'top 78%', once: true };
        if (imageRef.current) {
          gsap.fromTo(imageRef.current, { y: 20, opacity: 0, rotateZ: 1.5 }, { y: 0, opacity: 1, rotateZ: 0, duration: 0.55, ease: 'power2.out', scrollTrigger: st });
          ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
            onUpdate: (self) => {
              if (imageRef.current) gsap.set(imageRef.current, { scale: 0.97 + self.progress * 0.06 });
            }
          });
        }
        const aboutWord = textRef.current?.querySelector('.about-word');
        const usWord = textRef.current?.querySelector('.us-word');
        if (aboutWord && usWord) {
          gsap.fromTo([aboutWord, usWord], { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, delay: 0.1, ease: 'expo.out', scrollTrigger: st });
        }
        const paragraph = textRef.current?.querySelector('p');
        if (paragraph) {
          gsap.fromTo(paragraph, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, delay: 0.25, ease: 'power2.out', scrollTrigger: st });
        }
        if (buttonRef.current) {
          gsap.fromTo(buttonRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, delay: 0.35, ease: 'power2.out', scrollTrigger: st });
        }
      }, sectionRef);
      return () => ctx.revert();
    }

    const ctx = gsap.context(() => {
      // Image curtain reveal
      if (imageRef.current) {
        gsap.fromTo(imageRef.current,
          { clipPath: 'inset(0 100% 0 0)' },
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 1.2,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // Frame border draw
      if (frameRef.current) {
        gsap.fromTo(frameRef.current,
          { opacity: 0, scale: 1.02 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            delay: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // Heading animation
      const aboutWord = textRef.current?.querySelector('.about-word');
      const usWord = textRef.current?.querySelector('.us-word');
      
      if (aboutWord) {
        gsap.fromTo(aboutWord,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 55%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      if (usWord) {
        gsap.fromTo(usWord,
          { scale: 0.8, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 50%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // Body text typewriter-like reveal (word by word)
      const words = textRef.current?.querySelectorAll('.word-reveal');
      if (words && words.length > 0) {
        gsap.fromTo(words,
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.3,
            stagger: 0.02,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 45%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // Button bounce in
      if (buttonRef.current) {
        gsap.fromTo(buttonRef.current,
          { y: 20, scale: 0.9, opacity: 0 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 35%',
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
          if (imageRef.current) {
            gsap.set(imageRef.current, { y: -30 + progress * 60 });
          }
          if (textRef.current) {
            gsap.set(textRef.current, { y: 20 - progress * 40 });
          }
          beansDecos?.forEach((bean, i) => {
            gsap.set(bean, { y: (i % 2 === 0 ? -18 : 12) + progress * (i % 2 === 0 ? 36 : -24) });
          });
          // Atmospheric depth
          if (bgFar)  gsap.set(bgFar,  { y: -10 + progress * 20 });
          if (bgNear) gsap.set(bgNear, { y: 8 - progress * 16, x: 4 - progress * 8 });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Split body text into words for animation
  const bodyText = "Coffee Matters is where passion meets community. Founded by three Greek friends who turned their love for coffee into a welcoming space for all, we're more than just a café. We're your local spot for exceptional brews, Mediterranean-inspired treats, and warm hospitality. Join us in savoring life's simple pleasures, one cup at a time.";
  const words = bodyText.split(' ');

  return (
    <section
      id="about-preview"
      ref={sectionRef}
      className="relative w-full py-8 sm:py-24 md:py-36 bg-cream overflow-hidden"
    >
      {/* Atmospheric depth layers — desktop only (blur filters are expensive on mobile) */}
      <div className="parallax-far absolute top-10 -right-24 w-[500px] h-[500px] rounded-full bg-coral/[0.05] pointer-events-none blur-[90px] hidden lg:block" />
      <div className="parallax-near absolute -bottom-28 left-[15%] w-[480px] h-[480px] rounded-full bg-[#D8C4B3]/28 pointer-events-none blur-[80px] hidden lg:block" />

      {/* Decorative beans - right edge */}
      <img
        src="/beans2.png"
        alt=""
        className="beans-deco absolute -right-16 top-20 w-32 lg:w-40 opacity-80 pointer-events-none hidden md:block"
        style={{ transform: 'rotate(10deg)' }}
        loading="lazy"
      />
      <img
        src="/beans2.png"
        alt=""
        className="beans-deco absolute -left-14 bottom-24 w-24 lg:w-32 opacity-80 pointer-events-none hidden lg:block"
        style={{ transform: 'rotate(170deg) scaleX(-1)' }}
        loading="lazy"
      />

      <div className="section-padding">
        <div className="content-card">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-16 lg:gap-24 items-center max-w-7xl mx-auto">
          {/* Text Content */}
          <div
            ref={textRef}
            className="order-1 lg:order-2 lg:pl-8"
            style={isMobile ? undefined : { willChange: 'transform' }}
          >
            <div className="mb-8 group">
              <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                <span className="about-word block font-display font-light tracking-widest text-[var(--text-secondary)] transition-[letter-spacing] duration-700 ease-out group-hover:tracking-[0.13em]">ABOUT</span>
                <span className="us-word block text-coral mt-1 transition-[filter] duration-700 ease-out group-hover:brightness-[1.2]" style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic', fontWeight: 400 }}>US</span>
              </h2>
              <div className="about-word w-16 h-0.5 bg-coral/60 mt-4 transition-[width] duration-700 ease-out group-hover:w-24" />
            </div>

            <p className="text-gray-700 font-body leading-relaxed lg:text-[1.05rem] lg:leading-[1.85] mb-8">
              {words.map((word, i) => (
                <span key={i} className="word-reveal inline-block mr-[0.3em]">
                  {word}
                </span>
              ))}
            </p>
          </div>

          {/* Image */}
          <div
            ref={imageRef}
            className="order-2 lg:order-1 relative"
            style={isMobile ? undefined : { willChange: 'transform, clip-path' }}
          >
            <div className="relative overflow-hidden rounded-lg shadow-2xl img-hover group">
              <img
                src="/about-storefront.jpg"
                alt="Coffee Matters café storefront on Brick Lane, London"
                className="img-content w-full h-auto object-cover aspect-square lg:aspect-[4/5]"
                loading="lazy"
              />
            </div>

            {/* Decorative frame */}
            <div
              ref={frameRef}
              className="absolute -inset-4 border-2 border-coral/30 rounded-xl pointer-events-none hidden sm:block"
              style={{
                boxShadow: '0 0 30px rgba(194, 91, 58, 0.2)',
                animation: 'pulseGlow 4s ease-in-out infinite'
              }}
            />

            {/* Decorative glow */}
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-coral/15 rounded-full blur-3xl" />
          </div>

          {/* CTA Button */}
          <ButtonWithIcon href="#about" variant="outline" className="order-3 col-span-1 lg:col-span-2 lg:col-start-2">
            Read Our Story
          </ButtonWithIcon>
        </div>
        </div>
      </div>
    </section>
  );
}
