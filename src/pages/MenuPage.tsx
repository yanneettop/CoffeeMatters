import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Menu from '@/sections/Menu';
import NewsletterCTA from '@/sections/NewsletterCTA';
import Footer from '@/sections/Footer';

export default function MenuPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  // Fade-in entrance
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!pageRef.current) return;

    gsap.fromTo(
      pageRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
    );
  }, []);

  return (
    <div ref={pageRef} className="pt-20">
      <Menu />
      <NewsletterCTA />
      <Footer />
    </div>
  );
}
