import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { menuTabs } from '@/data/menuData';
import type { MenuTab } from '@/data/menuData';
import MenuCategoryCard from '@/components/menu/MenuCategoryCard';

gsap.registerPlugin(ScrollTrigger);

export default function Menu() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [activePillId, setActivePillId] = useState<string | null>(null);
  const isFirstRender = useRef(true);
  const isAnimating = useRef(false);

  const currentTab: MenuTab = menuTabs[activeTabIndex];

  /* ── Tab switch with GSAP crossfade ───────────────────── */
  const switchTab = useCallback(
    (index: number) => {
      if (index === activeTabIndex || isAnimating.current) return;
      isAnimating.current = true;

      if (contentRef.current) {
        gsap.to(contentRef.current, {
          opacity: 0,
          y: 12,
          duration: 0.2,
          ease: 'power2.in',
          onComplete: () => {
            setActiveTabIndex(index);
            setActivePillId(null);
            if (contentRef.current) {
              gsap.set(contentRef.current, { opacity: 1, y: 0 });
            }
          },
        });
      } else {
        setActiveTabIndex(index);
        setActivePillId(null);
        isAnimating.current = false;
      }
    },
    [activeTabIndex],
  );

  /* ── Stagger category cards after tab switch ──────────── */
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const cards = contentRef.current?.querySelectorAll('.menu-category');
    if (cards && cards.length > 0) {
      gsap.fromTo(
        cards,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.35,
          stagger: 0.05,
          ease: 'power2.out',
          onComplete: () => {
            isAnimating.current = false;
          },
        },
      );
    } else {
      isAnimating.current = false;
    }
  }, [activeTabIndex]);

  /* ── Quick-jump pill ──────────────────────────────────── */
  const scrollToCategory = useCallback((categoryId: string) => {
    setActivePillId(categoryId);
    const el = document.getElementById(`cat-${categoryId}`);
    if (el) {
      const offset = 130;
      const y = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, []);

  /* ── GSAP entrance animations (mount only) ────────────── */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      // Heading slide-in
      const words = headingRef.current?.querySelectorAll('.heading-word');
      if (words && words.length > 0) {
        gsap.fromTo(
          words,
          { x: -60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.12,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      }

      // Tab buttons — elastic scale-in
      const tabBtns = tabsRef.current?.querySelectorAll('button');
      if (tabBtns && tabBtns.length > 0) {
        gsap.fromTo(
          tabBtns,
          { scale: 0.8, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: 'elastic.out(1, 0.6)',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 68%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      }

      // Category pills
      if (pillsRef.current) {
        gsap.fromTo(
          pillsRef.current,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 62%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      }

      // Content block
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 55%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ── Render ────────────────────────────────────────────── */
  return (
    <section
      ref={sectionRef}
      className="relative w-full py-20 md:py-32 overflow-hidden"
      style={{ backgroundColor: 'rgba(255,255,255,0.35)' }}
    >
      <div className="section-padding max-w-6xl mx-auto">
        {/* ── Heading ─────────────────────────────────── */}
        <div ref={headingRef} className="mb-10 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl">
            <span className="heading-word inline-block font-display font-light tracking-widest text-[var(--text-secondary)]">
              OUR
            </span>{' '}
            <span
              className="heading-word inline-block text-coral"
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontStyle: 'italic',
                fontWeight: 400,
              }}
            >
              MENU
            </span>
          </h2>
          <div className="heading-word w-16 h-0.5 bg-coral/60 mt-4 mx-auto" />
        </div>

        {/* ── Tab Buttons ─────────────────────────────── */}
        <div ref={tabsRef} className="flex justify-center gap-3 mb-6" role="tablist">
          {menuTabs.map((tab, i) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTabIndex === i}
              onClick={() => switchTab(i)}
              className={`px-8 py-2.5 rounded-full text-sm font-medium tracking-widest uppercase transition-all duration-300 border ${
                activeTabIndex === i
                  ? 'bg-coral text-white border-coral shadow-lg shadow-coral/20'
                  : 'bg-white/50 text-[var(--text-secondary)] border-[var(--sandstone)]/50 hover:bg-white hover:shadow-md'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Category Quick-Jump Pills ───────────────── */}
        <div ref={pillsRef} className="mb-12">
          <div className="flex gap-2 justify-center flex-wrap">
            {currentTab.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollToCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-[11px] tracking-wider uppercase transition-all duration-200 whitespace-nowrap ${
                  activePillId === cat.id
                    ? 'bg-[var(--dark)] text-white'
                    : 'bg-[var(--sandstone)]/30 text-[var(--text-secondary)] hover:bg-[var(--sandstone)]/60'
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>
        </div>

        {/* ── Menu Content ────────────────────────────── */}
        <div ref={contentRef} className="space-y-12" role="tabpanel">
          {currentTab.categories.map((category) => (
            <MenuCategoryCard key={category.id} category={category} />
          ))}
        </div>

        {/* ── Dietary Key ─────────────────────────────── */}
        <div className="mt-14 pt-6 border-t border-[var(--sandstone)]/40 flex items-center justify-center gap-6 text-[11px] text-gray-400 font-body tracking-wide">
          <span>
            <span className="inline-block w-4 text-center font-semibold text-[var(--olive)]">V</span>{' '}
            Vegetarian
          </span>
          <span>
            <span className="inline-block w-5 text-center font-semibold text-[var(--olive)]">VG</span>{' '}
            Vegan
          </span>
          <span>
            <span className="inline-block w-5 text-center font-semibold text-[var(--soft-clay)]">GF</span>{' '}
            Gluten Free
          </span>
        </div>
      </div>
    </section>
  );
}
