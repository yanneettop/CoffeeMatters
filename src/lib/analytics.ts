type GtagCommand = 'js' | 'config' | 'event';
type GtagParams = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (command: GtagCommand, target: string | Date, params?: GtagParams) => void;
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

let isLoaded = false;

const getCurrentPagePath = () =>
  `${window.location.pathname}${window.location.search}${window.location.hash}`;

export const getGaMeasurementId = () => GA_MEASUREMENT_ID;

export const initializeAnalytics = () => {
  if (!GA_MEASUREMENT_ID || isLoaded) return;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag(...args) {
    window.dataLayer?.push(args);
  };

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false,
  });

  isLoaded = true;
};

export const sendPageView = (pagePath = getCurrentPagePath()) => {
  if (!isLoaded || !window.gtag) return;

  window.gtag('event', 'page_view', {
    page_title: document.title,
    page_location: window.location.href,
    page_path: pagePath,
  });
};

export const trackEvent = (eventName: string, params: GtagParams = {}) => {
  if (!isLoaded || !window.gtag) return;

  window.gtag('event', eventName, params);
};

const getTrackedEventForLink = (anchor: HTMLAnchorElement) => {
  const explicitEvent = anchor.dataset.analyticsEvent;
  if (explicitEvent) return explicitEvent;

  const href = anchor.href.toLowerCase();
  const rawHref = anchor.getAttribute('href')?.toLowerCase() ?? '';

  if (href.startsWith('tel:')) return 'phone_click';
  if (href.startsWith('mailto:')) return 'email_click';
  if (rawHref === '#menu') return 'menu_view';
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
