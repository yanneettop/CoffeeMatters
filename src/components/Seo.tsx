import { useEffect } from 'react';

const SITE_URL = 'https://www.coffeematterslondon.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/hero-bg-vivid.webp`;

export interface SeoProps {
  /** Document <title> */
  title: string;
  /** Meta description */
  description: string;
  /** Route path beginning with "/" (e.g. "/menu"). Used for canonical + og:url. */
  path: string;
  /** Absolute Open Graph image URL. Defaults to the hero image. */
  image?: string;
}

/** Upsert a <meta> tag matched by name or property attribute. */
function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * Client-side per-route SEO head manager.
 *
 * Keeps title, description, canonical, Open Graph and Twitter tags in sync with
 * the active route. The static tags in index.html act as the crawl-time default
 * for "/"; this component overrides them once React hydrates and on every route
 * change. (For crawlers without JS rendering, see the prerender note in README.)
 */
export default function Seo({ title, description, path, image = DEFAULT_OG_IMAGE }: SeoProps) {
  useEffect(() => {
    const canonical = `${SITE_URL}${path === '/' ? '/' : path}`;

    document.title = title;

    upsertMeta('name', 'description', description);

    // Canonical
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonical);

    // Open Graph
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:image', image);

    // Twitter / X
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', image);
  }, [title, description, path, image]);

  return null;
}
