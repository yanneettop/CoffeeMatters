import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

export default function AboutUs() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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
      className="relative w-full py-20 md:py-32 bg-cream overflow-hidden"
    >
      {/* Atmospheric depth layers */}
      <div className="parallax-far absolute top-10 -right-24 w-[500px] h-[500px] rounded-full bg-coral/[0.05] pointer-events-none blur-[90px]" />
      <div className="parallax-near absolute -bottom-28 left-[15%] w-[480px] h-[480px] rounded-full bg-[#D8C4B3]/28 pointer-events-none blur-[80px]" />

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-7xl mx-auto">
          {/* Image */}
          <div 
            ref={imageRef}
            className="relative"
            style={{ willChange: 'transform, clip-path' }}
          >
            <div className="relative overflow-hidden rounded-lg shadow-2xl img-hover group">
              <img
                src="/about-storefront.jpg"
                alt="Coffee Matters café storefront on Brick Lane, London"
                className="img-content w-full h-auto object-cover aspect-square"
                loading="lazy"
              />
            </div>
            
            {/* Decorative frame */}
            <div 
              ref={frameRef}
              className="absolute -inset-4 border-2 border-coral/30 rounded-xl pointer-events-none"
              style={{
                boxShadow: '0 0 30px rgba(194, 91, 58, 0.2)',
                animation: 'pulseGlow 4s ease-in-out infinite'
              }}
            />
            
            {/* Decorative glow */}
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-coral/15 rounded-full blur-3xl" />
          </div>

          {/* Text Content */}
          <div 
            ref={textRef}
            className="lg:pl-8"
            style={{ willChange: 'transform' }}
          >
            <div className="mb-8 group">
              <h2 className="text-4xl md:text-5xl lg:text-6xl">
                <span className="about-word block font-display font-light tracking-widest text-[var(--text-secondary)] transition-[letter-spacing] duration-700 ease-out group-hover:tracking-[0.13em]">ABOUT</span>
                <span className="us-word block text-coral mt-1 transition-[filter] duration-700 ease-out group-hover:brightness-[1.2]" style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic', fontWeight: 400 }}>US</span>
              </h2>
              <div className="about-word w-16 h-0.5 bg-coral/60 mt-4 transition-[width] duration-700 ease-out group-hover:w-24" />
            </div>
            
            <p className="text-gray-700 font-body leading-relaxed mb-8">
              {words.map((word, i) => (
                <span key={i} className="word-reveal inline-block mr-[0.3em]">
                  {word}
                </span>
              ))}
            </p>

            {/* CTA Button */}
            <a
              ref={buttonRef}
              href="#about"
              className="btn-outline group inline-flex items-center gap-3 text-coral border-coral hover:bg-coral hover:text-white transition-all duration-300"
            >
              <span>READ OUR STORY</span>
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
