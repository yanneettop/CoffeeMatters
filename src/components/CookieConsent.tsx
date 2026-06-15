import { useEffect, useState } from 'react';
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
    <div className="fixed inset-x-0 bottom-0 z-[1000] px-4 pb-4 sm:px-6 sm:pb-6 pointer-events-none">
      <div className="mx-auto max-w-3xl rounded-lg border border-white/15 bg-[#1a1a1a] text-white shadow-2xl pointer-events-auto">
        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-xl">
              <h2 className="font-display text-xl leading-tight">Cookie preferences</h2>
              <p className="mt-2 font-body text-sm leading-relaxed text-white/75">
                We use analytics cookies to understand which pages and cafe actions are useful. You can accept or reject analytics at any time.
              </p>
              {isManaging && (
                <p className="mt-2 font-body text-xs text-white/55">
                  Current choice: {choice === 'accepted' ? 'analytics accepted' : choice === 'rejected' ? 'analytics rejected' : 'not set'}.
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2 sm:justify-end">
              <button
                type="button"
                className="rounded-full bg-white px-4 py-2 font-body text-xs font-semibold uppercase tracking-[0.14em] text-[#1a1a1a] transition hover:bg-white/90"
                onClick={() => storeChoice('accepted')}
              >
                Accept
              </button>
              <button
                type="button"
                className="rounded-full border border-white/30 px-4 py-2 font-body text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:border-white hover:bg-white/10"
                onClick={() => storeChoice('rejected')}
              >
                Reject
              </button>
              {!isManaging && (
                <button
                  type="button"
                  className="rounded-full border border-white/20 px-4 py-2 font-body text-xs font-semibold uppercase tracking-[0.14em] text-white/80 transition hover:border-white/50 hover:text-white"
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
