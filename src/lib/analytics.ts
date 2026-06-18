type GtagCommand = 'js' | 'config' | 'consent' | 'event';
type GtagParams = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (command: GtagCommand, target: string | Date, params?: GtagParams) => void;
    testGA4?: () => void;
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

let isBootstrapped = false;
let isInitialized = false;
let lastPageViewPath: string | null = null;

const getCurrentPagePath = () =>
  `${window.location.pathname}${window.location.search}`;

const devLog = (message: string, details?: unknown) => {
  if (!import.meta.env.DEV) return;
  console.info(`[analytics] ${message}`, details ?? '');
};

export const getGaMeasurementId = () => GA_MEASUREMENT_ID;

const bootstrapGtag = () => {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer?.push(arguments);
  };
};

export const initializeAnalyticsConsent = () => {
  if (isBootstrapped) return;

  bootstrapGtag();
  window.gtag?.('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  isBootstrapped = true;
  devLog('Initialized default consent mode');
};

export const initializeAnalytics = () => {
  if (!GA_MEASUREMENT_ID) {
    devLog('GA measurement ID is missing');
    return false;
  }

  initializeAnalyticsConsent();
  bootstrapGtag();
  window.gtag?.('consent', 'update', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  devLog('Updated consent mode after analytics acceptance');

  if (!document.querySelector(`script[src="https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"]`)) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);
    devLog('Loaded gtag.js', script.src);
  }

  if (!isInitialized) {
    window.gtag?.('js', new Date());
    isInitialized = true;
    devLog('Initialized GA4', GA_MEASUREMENT_ID);
  }

  return true;
};

export const sendPageView = (pagePath = getCurrentPagePath()) => {
  if (pagePath === lastPageViewPath) {
    devLog('Skipped duplicate page_view', pagePath);
    return;
  }
  if (!initializeAnalytics() || !window.gtag) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: pagePath,
    page_location: window.location.href,
    page_title: document.title,
  });
  lastPageViewPath = pagePath;
  devLog('Sent page_view', { measurementId: GA_MEASUREMENT_ID, pagePath });
};

export const trackEvent = (eventName: string, params: GtagParams = {}) => {
  if (!isInitialized || !window.gtag) return;

  window.gtag('event', eventName, params);
  devLog('Sent event', { eventName, params });
};

if (import.meta.env.DEV) {
  window.testGA4 = () => {
    initializeAnalytics();
    window.gtag?.('event', 'manual_test_event', {
      event_category: 'debug',
      event_label: 'coffee_matters_manual_test',
    });
    devLog('Sent manual_test_event');
  };
}

const getTrackedEventForLink = (anchor: HTMLAnchorElement) => {
  const explicitEvent = anchor.dataset.analyticsEvent;
  if (explicitEvent) return explicitEvent;

  const href = anchor.href.toLowerCase();
  const rawHref = anchor.getAttribute('href')?.toLowerCase() ?? '';

  if (href.startsWith('tel:')) return 'phone_click';
  if (href.startsWith('mailto:')) return 'email_click';
  if (rawHref === '/menu' || rawHref === '/menu/' || rawHref === '#menu') return 'menu_view';
  if (href.includes('instagram.com')) return 'instagram_click';
  if (href.includes('deliveroo') || href.includes('ubereats') || href.includes('delivery')) {
    return 'delivery_click';
  }
  if (href.includes('google.com/maps') || href.includes('maps.google.com')) {
    return 'directions_click';
  }

  return null;
};

export const trackCafeLinkClick = (anchor: HTMLAnchorElement) => {
  const eventName = getTrackedEventForLink(anchor);
  if (!eventName) return;

  trackEvent(eventName, {
    link_url: anchor.href,
    link_text: anchor.textContent?.trim() ?? '',
  });
};
