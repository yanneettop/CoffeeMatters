import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import NewsletterCTA from '@/sections/NewsletterCTA';
import Footer from '@/sections/Footer';

/* ── Gallery data ─────────────────────────────────────────── */
const galleryImages = [
  { src: '/gallery/storefront-1.jpg', alt: 'Coffee Matters storefront on Bethnal Green Road', aspect: 'tall' },
  { src: '/gallery/wide-interior.jpg', alt: 'Wide view of the cafe interior with skylights', aspect: 'wide' },
  { src: '/gallery/storefront-2.jpg', alt: 'Close-up of the cafe entrance and outdoor seating', aspect: 'tall' },
  { src: '/gallery/booth-seating.jpg', alt: 'Booth seating area with artwork and plants', aspect: 'wide' },
  { src: '/gallery/interior-garden.jpg', alt: 'Lush green corridor filled with plants', aspect: 'tall' },
  { src: '/gallery/full-cafe.jpg', alt: 'Panoramic view of the full cafe space', aspect: 'wide' },
  { src: '/gallery/art-corridor.jpg', alt: 'Art-lined corridor with hanging plants', aspect: 'tall' },
  { src: '/gallery/basement-lounge.jpg', alt: 'Cozy basement lounge with sofas and warm lighting', aspect: 'wide' },
  { src: '/gallery/main-room.jpg', alt: 'Main seating area with string lights and art', aspect: 'wide' },
  { src: '/gallery/cozy-corner.jpg', alt: 'Cozy corner with clock and trailing plants', aspect: 'tall' },
  { src: '/gallery/wall-art.jpg', alt: 'Wall art display with fairy lights and plants', aspect: 'wide' },
];

/* ── Lightbox ─────────────────────────────────────────────── */
function Lightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: {
  images: typeof galleryImages;
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, onPrev, onNext]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Entrance animation
  useEffect(() => {
    if (!overlayRef.current) return;
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
  }, []);

  // Image swap animation
  useEffect(() => {
    if (!imgRef.current) return;
    gsap.fromTo(imgRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' },
    );
  }, [currentIndex]);

  const image = images[currentIndex];

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 text-white/70 hover:text-white transition-colors duration-200"
        aria-label="Close lightbox"
      >
        <X size={32} />
      </button>

      {/* Counter */}
      <span className="absolute top-6 left-6 text-white/50 font-body text-sm tracking-wider">
        {currentIndex + 1} / {images.length}
      </span>

      {/* Previous */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all duration-200"
        aria-label="Previous image"
      >
        <ChevronLeft size={28} />
      </button>

      {/* Image */}
      <img
        ref={imgRef}
        src={image.src}
        alt={image.alt}
        className="max-h-[80vh] max-w-[85vw] object-contain rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Next */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all duration-200"
        aria-label="Next image"
      >
        <ChevronRight size={28} />
      </button>
    </div>,
    document.body,
  );
}

/* ── Gallery Page ─────────────────────────────────────────── */
export default function GalleryPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goPrev = useCallback(() => {
    setLightboxIndex((i) => (i !== null ? (i - 1 + galleryImages.length) % galleryImages.length : null));
  }, []);

  const goNext = useCallback(() => {
    setLightboxIndex((i) => (i !== null ? (i + 1) % galleryImages.length : null));
  }, []);

  /* ── GSAP animations ──────────────────────────────────── */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      // Page fade-in
      if (pageRef.current) {
        gsap.fromTo(pageRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        );
      }

      // Hero elements stagger
      if (heroRef.current) {
        const els = heroRef.current.querySelectorAll('.hero-anim');
        gsap.fromTo(els,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'expo.out', delay: 0.2 },
        );
      }

      // Gallery items stagger reveal
      if (gridRef.current) {
        const items = gridRef.current.querySelectorAll('.gallery-item');
        gsap.fromTo(items,
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.6, stagger: 0.08, ease: 'expo.out',
            scrollTrigger: { trigger: gridRef.current, start: 'top 85%', toggleActions: 'play none none reverse' },
          },
        );
      }
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="pt-20">
      {/* ── Hero ──────────────────────────────────────────── */}
      <section ref={heroRef} className="section-padding py-16 md:py-24 text-center max-w-4xl mx-auto">
        <p className="hero-anim font-body text-sm tracking-[0.3em] uppercase text-coral mb-4">
          Our Space
        </p>
        <h1 className="hero-anim font-display text-4xl md:text-5xl lg:text-6xl text-[var(--text-primary)] mb-6">
          A Glimpse Inside{' '}
          <span
            className="text-coral"
            style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic', fontWeight: 400 }}
          >
            Coffee Matters
          </span>
        </h1>
        <p className="hero-anim font-body text-[var(--text-secondary)] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Plants, art, warm light and the aroma of freshly brewed coffee — step inside our
          Bethnal Green hideaway and see why people keep coming back.
        </p>
      </section>

      {/* ── Masonry gallery grid ──────────────────────────── */}
      <section className="section-padding pb-20 md:pb-28">
        <div
          ref={gridRef}
          className="max-w-7xl mx-auto columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-5"
        >
          {galleryImages.map((image, index) => (
            <button
              key={image.src}
              onClick={() => openLightbox(index)}
              className="gallery-item group relative w-full mb-4 md:mb-5 break-inside-avoid block overflow-hidden rounded-xl border border-[var(--sandstone)]/30 bg-white/30 img-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-coral"
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="img-content w-full h-auto object-cover"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
            </button>
          ))}
        </div>
      </section>

      {/* ── Lightbox ──────────────────────────────────────── */}
      {lightboxIndex !== null && (
        <Lightbox
          images={galleryImages}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}

      <NewsletterCTA />
      <Footer />
    </div>
  );
}
