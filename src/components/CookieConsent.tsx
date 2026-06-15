import { useEffect, useState } from 'react';
import { Cookie, SlidersHorizontal } from 'lucide-react';
import { initializeAnalytics, sendPageView } from '@/lib/analytics';

type ConsentChoice = 'accepted' | 'rejected';

const STORAGE_KEY = 'coffee-matters-cookie-consent';
const OPEN_SETTINGS_EVENT = 'coffee-matters:open-cookie-settings';

export const hasAnalyticsConsent = () =>
  localStorage.getItem(STORAGE_KEY) === 'accepted';

export const openCookieSettings = () => {
  window.dispatchEvent(new CustomEvent(OPEN_SETTINGS_EVENT));
};

export default function CookieConsent() {
  const [choice, setChoice] = useState<ConsentChoice | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'accepted' || stored === 'rejected' ? stored : null;
  });
  const [isManaging, setIsManaging] = useState(false);
  const shouldShow = choice === null || isManaging;

  useEffect(() => {
    const handleOpenSettings = () => setIsManaging(true);
    window.addEventListener(OPEN_SETTINGS_EVENT, handleOpenSettings);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, handleOpenSettings);
  }, []);

  const storeChoice = (nextChoice: ConsentChoice) => {
    localStorage.setItem(STORAGE_KEY, nextChoice);
    setChoice(nextChoice);
    setIsManaging(false);

    if (nextChoice === 'accepted') {
      initializeAnalytics();
      sendPageView();
    }
  };

  if (!shouldShow) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[1000] px-3 pb-3 sm:px-6 sm:pb-6 pointer-events-none">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-lg border border-[var(--sandstone)]/70 bg-[var(--cream)] text-[var(--text-primary)] shadow-[0_20px_70px_rgba(43,38,35,0.22)] pointer-events-auto">
        <div className="h-1 bg-[linear-gradient(90deg,var(--coral),var(--coral-on-dark),var(--olive))]" />
        <div className="p-4 sm:p-5 lg:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-3 sm:gap-4">
              <div className="mt-0.5 hidden size-11 shrink-0 items-center justify-center rounded-full bg-white/65 text-[var(--coral)] shadow-sm ring-1 ring-[var(--sandstone)]/70 sm:flex">
                {isManaging ? <SlidersHorizontal size={19} /> : <Cookie size={19} />}
              </div>
              <div className="max-w-2xl">
                <p className="font-body text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--coral)]">
                  Coffee Matters
                </p>
                <h2 className="mt-1 font-display text-xl leading-tight sm:text-2xl">
                  Cookie preferences
                </h2>
                <p className="mt-2 font-body text-sm leading-relaxed text-[var(--text-secondary)]">
                  We use analytics cookies to understand which pages and cafe actions are useful. You can accept or reject analytics at any time.
                </p>
              {isManaging && (
                <p className="mt-2 font-body text-xs text-[var(--text-muted)]">
                  Current choice: {choice === 'accepted' ? 'analytics accepted' : choice === 'rejected' ? 'analytics rejected' : 'not set'}.
                </p>
              )}
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap lg:max-w-[330px] lg:justify-end">
              <button
                type="button"
                className="rounded-full bg-[var(--coral)] px-5 py-3 font-body text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-[0_8px_22px_rgba(169,74,47,0.26)] transition hover:bg-[#8f3e28] hover:shadow-[0_10px_28px_rgba(169,74,47,0.34)]"
                onClick={() => storeChoice('accepted')}
              >
                Accept
              </button>
              <button
                type="button"
                className="rounded-full border border-[var(--soft-clay)]/30 bg-white/40 px-5 py-3 font-body text-xs font-semibold uppercase tracking-[0.14em] text-[var(--soft-clay)] transition hover:border-[var(--coral)] hover:bg-white/70 hover:text-[var(--coral)]"
                onClick={() => storeChoice('rejected')}
              >
                Reject
              </button>
              {!isManaging && (
                <button
                  type="button"
                  className="rounded-full px-5 py-3 font-body text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)] underline-offset-4 transition hover:text-[var(--coral)] hover:underline"
                  onClick={() => setIsManaging(true)}
                >
                  Manage preferences
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
