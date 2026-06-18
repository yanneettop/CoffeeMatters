// Post-build prerender: bake route-specific <head> tags and rendered body into static HTML.
//
// Why: crawlers can read the initial HTML before client-side React runs. Rendering
// the route body at build time gives every indexable page crawlable headings,
// copy, navigation links, footer links and CTAs while preserving the same React UI.
//
// Output:
//   dist/index.html            canonical .../
//   dist/menu/index.html       canonical .../menu/
//   dist/gallery/index.html    canonical .../gallery/
//   dist/about/index.html      canonical .../about/
//   dist/contact/index.html    canonical .../contact/

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const distDir = join(root, 'dist');

const config = JSON.parse(readFileSync(join(root, 'src/seo/routes.json'), 'utf8'));
const { siteUrl, defaultImage, imageAlt } = config;

const template = readFileSync(join(distDir, 'index.html'), 'utf8');

globalThis.window ??= {
  innerWidth: 1440,
  innerHeight: 900,
  location: { hash: '', pathname: '/' },
  history: {},
  matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
  addEventListener() {},
  removeEventListener() {},
  scrollTo() {},
};
globalThis.document ??= {
  documentElement: { clientHeight: 900, scrollTop: 0 },
  body: { scrollTop: 0, style: {} },
  getElementById: () => null,
  querySelectorAll: () => [],
  head: { querySelector: () => null, appendChild() {} },
  createElement: () => ({ setAttribute() {} }),
};
globalThis.navigator ??= { userAgent: 'node' };

const escText = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = (s) => escText(s).replace(/"/g, '&quot;');

function setTitle(html, title) {
  const re = /<title>[\s\S]*?<\/title>/;
  if (!re.test(html)) throw new Error('title tag not found');
  return html.replace(re, `<title>${escText(title)}</title>`);
}

function setMeta(html, attr, key, value) {
  const re = new RegExp(`(<meta\\s+${attr}="${key.replace(/[:]/g, '\\$&')}"\\s+content=")[^"]*(")`);
  if (!re.test(html)) throw new Error(`meta ${attr}="${key}" not found`);
  return html.replace(re, `$1${escAttr(value)}$2`);
}

function setCanonical(html, href) {
  const re = /(<link\s+rel="canonical"\s+href=")[^"]*(")/;
  if (!re.test(html)) throw new Error('canonical link not found');
  return html.replace(re, `$1${escAttr(href)}$2`);
}

function setRootHtml(html, appHtml) {
  const re = /<div id="root">[\s\S]*?<\/div>/;
  if (!re.test(html)) throw new Error('root element not found');
  return html.replace(re, `<div id="root">${appHtml}</div>`);
}

function buildHtml(route, appHtml) {
  const canonical = `${siteUrl}${route.path === '/' ? '/' : route.path}`;
  const image = route.image ?? defaultImage;

  let html = template;
  html = setRootHtml(html, appHtml);
  html = setTitle(html, route.title);
  html = setMeta(html, 'name', 'description', route.description);
  html = setCanonical(html, canonical);
  html = setMeta(html, 'property', 'og:title', route.title);
  html = setMeta(html, 'property', 'og:description', route.description);
  html = setMeta(html, 'property', 'og:url', canonical);
  html = setMeta(html, 'property', 'og:image', image);
  html = setMeta(html, 'property', 'og:image:alt', imageAlt);
  html = setMeta(html, 'name', 'twitter:title', route.title);
  html = setMeta(html, 'name', 'twitter:description', route.description);
  html = setMeta(html, 'name', 'twitter:image', image);
  html = setMeta(html, 'name', 'twitter:image:alt', imageAlt);
  return html;
}

const vite = await createServer({
  root,
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true },
});

try {
  const { render } = await vite.ssrLoadModule('/src/entry-server.tsx');

  for (const route of config.routes) {
    const appHtml = render(route.path);
    const html = buildHtml(route, appHtml);
    const outPath =
      route.path === '/'
        ? join(distDir, 'index.html')
        : join(distDir, route.path.replace(/^\//, ''), 'index.html');

    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, html, 'utf8');
    console.log(`prerendered ${route.path} -> ${outPath.replace(root, '.')}`);
  }
} finally {
  await vite.close();
}

console.log(`\nOK prerendered ${config.routes.length} routes`);
