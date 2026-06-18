import { useEffect } from 'react';
import seoConfig from '@/seo/routes.json';

interface RouteMeta {
  path: string;
  title: string;
  description: string;
  image?: string;
}

const SITE_URL = seoConfig.siteUrl;
const DEFAULT_IMAGE = seoConfig.defaultImage;
const ROUTES = seoConfig.routes as RouteMeta[];

export interface SeoProps {
  /** Route path beginning with "/" (e.g. "/menu/"). Looked up in seo/routes.json. */
  path: string;
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
 * Client-side per-route SEO head manager (runtime backup).
 *
 * The authoritative per-route head tags are baked into static HTML at build
 * time by scripts/prerender.mjs (same seo/routes.json source). This component
 * keeps the tags correct during client-side navigation between routes.
 */
export default function Seo({ path }: SeoProps) {
  useEffect(() => {
    const normalizedPath = path === '/' ? '/' : `${path.replace(/\/+$/, '')}/`;
    const route = ROUTES.find((r) => r.path === normalizedPath);
    if (!route) return;

    const canonical = `${SITE_URL}${route.path === '/' ? '/' : route.path}`;
    const image = route.image ?? DEFAULT_IMAGE;

    document.title = route.title;

    upsertMeta('name', 'description', route.description);

    // Canonical
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonical);

    // Open Graph
    upsertMeta('property', 'og:title', route.title);
    upsertMeta('property', 'og:description', route.description);
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:image', image);

    // Twitter / X
    upsertMeta('name', 'twitter:title', route.title);
    upsertMeta('name', 'twitter:description', route.description);
    upsertMeta('name', 'twitter:image', image);
  }, [path]);

  return null;
}
