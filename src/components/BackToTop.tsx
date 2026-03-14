import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ArrowUp } from 'lucide-react';

gsap.registerPlugin(ScrollToPlugin);

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!btnRef.current) return;
    gsap.to(btnRef.current, {
      opacity: visible ? 1 : 0,
      scale: visible ? 1 : 0.8,
      duration: 0.3,
      ease: 'power2.out',
      pointerEvents: visible ? 'auto' : 'none',
    });
  }, [visible]);

  const scrollToTop = () => {
    gsap.to(window, {
      scrollTo: { y: 0 },
      duration: 1.2,
      ease: 'power3.inOut',
    });
  };

  return (
    <button
      ref={btnRef}
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-40 w-12 h-12 rounded-full bg-[#C25B3A] text-white shadow-lg flex items-center justify-center cursor-pointer group"
      style={{
        opacity: 0,
        pointerEvents: 'none',
        transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#a34b30';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(194,91,58,0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#C25B3A';
        e.currentTarget.style.boxShadow = '';
      }}
      aria-label="Back to top"
    >
      <ArrowUp size={20} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
    </button>
  );
}
