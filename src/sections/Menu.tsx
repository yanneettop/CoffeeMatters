import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { menuTabs } from '@/data/menuData';
import type { DietaryTag, MenuCategory, MenuTab } from '@/data/menuData';
import MenuCategoryCard from '@/components/menu/MenuCategoryCard';

type DietaryFilter = 'all' | DietaryTag;

const dietaryFilters: { id: DietaryFilter; label: string; tagLabel?: string }[] = [
  { id: 'all', label: 'All food' },
  { id: 'V', label: 'Vegan', tagLabel: 'V' },
  { id: 'VG', label: 'Vegetarian', tagLabel: 'VG' },
  { id: 'GF', label: 'Gluten Free', tagLabel: 'GF' },
];

export default function Menu() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [activePillId, setActivePillId] = useState<string | null>(null);
  const [activeDietaryFilter, setActiveDietaryFilter] = useState<DietaryFilter>('all');
  const isFirstRender = useRef(true);
  const isAnimating = useRef(false);

  const currentTab: MenuTab = menuTabs[activeTabIndex];
  const showDietaryFilters = currentTab.id === 'food';
  const displayedCategories: MenuCategory[] = useMemo(() => {
    if (!showDietaryFilters || activeDietaryFilter === 'all') {
      return currentTab.categories;
    }

    return currentTab.categories
      .map((category) => ({
        ...category,
        items: category.items.filter((item) =>
          item.dietaryTags?.includes(activeDietaryFilter),
        ),
        addOns: undefined,
      }))
      .filter((category) => category.items.length > 0);
  }, [activeDietaryFilter, currentTab, showDietaryFilters]);
  const activeDietaryFilterLabel =
    dietaryFilters.find((filter) => filter.id === activeDietaryFilter)?.label ?? '';

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
            setActiveDietaryFilter('all');
            if (contentRef.current) {
              gsap.set(contentRef.current, { opacity: 1, y: 0 });
            }
          },
        });
      } else {
        setActiveTabIndex(index);
        setActivePillId(null);
        setActiveDietaryFilter('all');
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
  }, [activeTabIndex, activeDietaryFilter]);

  useEffect(() => {
    setActivePillId(null);
  }, [activeDietaryFilter]);

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
      className="relative w-full section-y overflow-hidden"
      style={{ backgroundColor: 'rgba(255,255,255,0.35)' }}
    >
      <div className="section-padding">
        {/* ── Heading ─────────────────────────────────── */}
        <div ref={headingRef} className="mb-10 text-center">
          <h1 className="section-heading">
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
            <span className="sr-only"> — Coffee, Pastries &amp; Brunch Menu in Brick Lane, East London</span>
          </h1>
          <div className="heading-word w-16 h-0.5 bg-coral/60 mt-4 mx-auto" />
        </div>

        {/* ── Tab Buttons ─────────────────────────────── */}
        <div ref={tabsRef} className="flex justify-center gap-2.5 md:gap-3 mb-6 flex-wrap" role="tablist">
          {menuTabs.map((tab, i) => (
            <button
              type="button"
              key={tab.id}
              role="tab"
              aria-selected={activeTabIndex === i}
              onClick={() => switchTab(i)}
              className={`px-5 md:px-7 lg:px-8 py-2.5 rounded-full text-xs md:text-sm font-medium tracking-widest uppercase transition-all duration-300 border ${
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
        {showDietaryFilters && (
          <div className="mb-6 flex justify-center">
            <div
              className="inline-flex max-w-full flex-wrap justify-center gap-2 rounded-full border border-[var(--sandstone)]/45 bg-white/55 p-1.5 shadow-sm"
              aria-label="Food dietary filter"
            >
              {dietaryFilters.map((filter) => {
                const isActive = activeDietaryFilter === filter.id;

                return (
                  <button
                    type="button"
                    key={filter.id}
                    aria-pressed={isActive}
                    onClick={() => setActiveDietaryFilter(filter.id)}
                    className={`inline-flex min-h-9 items-center gap-2 rounded-full px-4 py-2 text-[11px] font-medium uppercase tracking-wider transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--coral)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--cream)] ${
                      isActive
                        ? 'bg-[var(--dark)] text-white shadow-md'
                        : 'text-[var(--text-secondary)] hover:bg-white/80 hover:text-[var(--coral)]'
                    }`}
                  >
                    {filter.tagLabel && (
                      <span
                        className={`inline-flex size-5 items-center justify-center rounded text-[10px] font-semibold ${
                          isActive
                            ? 'bg-white/15 text-white'
                            : filter.id === 'GF'
                            ? 'bg-[var(--soft-clay)]/20 text-[var(--soft-clay)]'
                            : 'bg-[var(--olive)]/15 text-[var(--olive)]'
                        }`}
                      >
                        {filter.tagLabel}
                      </span>
                    )}
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div ref={pillsRef} className="mb-12">
          <div className="flex gap-2 justify-center flex-wrap">
            {displayedCategories.map((cat) => (
              <button
                type="button"
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
        <div ref={contentRef} className="space-y-10 md:space-y-12" role="tabpanel">
          {displayedCategories.length > 0 ? (
            displayedCategories.map((category) => (
              <MenuCategoryCard key={category.id} category={category} />
            ))
          ) : (
            <div className="mx-auto max-w-xl rounded-lg border border-[var(--sandstone)]/55 bg-white/45 px-6 py-8 text-center shadow-sm">
              <p className="font-display text-xl tracking-[0.12em] text-[var(--text-primary)]">
                No {activeDietaryFilterLabel} options listed yet
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                Please ask the staff for today&apos;s suitable dishes.
              </p>
            </div>
          )}
        </div>

        {/* ── Dietary Key ─────────────────────────────── */}
        <div className="mt-12 md:mt-14 pt-6 border-t border-[var(--sandstone)]/40 flex flex-wrap items-center justify-center gap-4 md:gap-6 text-[11px] text-[var(--text-muted)] font-body tracking-wide">
          <span>
            <span className="inline-block w-4 text-center font-semibold text-[var(--olive)]">V</span>{' '}
            Vegan
          </span>
          <span>
            <span className="inline-block w-5 text-center font-semibold text-[var(--olive)]">VG</span>{' '}
            Vegetarian
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
