import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Preload hero image
  useEffect(() => {
    const img = new Image();
    img.src = '/hero-bg.webp';
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(true); // Don't block on error

    // Safety timeout — don't block forever
    const timeout = setTimeout(() => setImageLoaded(true), 5000);
    return () => clearTimeout(timeout);
  }, []);

  // Exit animation when image is loaded
  useEffect(() => {
    if (!imageLoaded || !overlayRef.current || !logoRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => onComplete(),
    });

    tl.to(logoRef.current, {
      scale: 1.1,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in',
    });

    tl.to(overlayRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out',
    }, '-=0.1');
  }, [imageLoaded, onComplete]);

  // Logo entrance animation
  useEffect(() => {
    if (!logoRef.current) return;

    gsap.fromTo(logoRef.current,
      { opacity: 0, scale: 0.85 },
      { opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out' }
    );
  }, []);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#1a1a1a]"
    >
      <div className="flex flex-col items-center gap-6">
        <img
          ref={logoRef}
          src="/minimal-logowhiteracota.png"
          alt="Coffee Matters"
          className="h-16 w-auto object-contain"
          style={{ opacity: 0 }}
        />
        {/* Subtle loading bar */}
        <div className="w-20 h-[2px] bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#C25B3A] rounded-full"
            style={{
              animation: 'loadingBar 1.5s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes loadingBar {
          0% { width: 0%; margin-left: 0; }
          50% { width: 100%; margin-left: 0; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  );
}
