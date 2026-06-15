// Post-build prerender: bake route-specific <head> tags into static HTML.
//
// Why: the app is a client-rendered SPA, so the SPA-fallback HTML for every
// deep route ships the homepage <head> (canonical = "/"). Static crawlers
// (Ahrefs, Bing) read that initial HTML and flag the routes as non-canonical.
// This script clones the built dist/index.html for each route and rewrites the
// title, description, canonical, Open Graph and Twitter tags from the same
// seo/routes.json the runtime <Seo> component uses.
//
// Output:
//   dist/index.html            canonical .../
//   dist/menu/index.html       canonical .../menu
//   dist/gallery/index.html    canonical .../gallery
//   dist/about/index.html      canonical .../about
//   dist/contact/index.html    canonical .../contact

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const distDir = join(root, 'dist');

const config = JSON.parse(readFileSync(join(root, 'src/seo/routes.json'), 'utf8'));
const { siteUrl, defaultImage, imageAlt } = config;

const template = readFileSync(join(distDir, 'index.html'), 'utf8');

/** Escape text placed inside an element (e.g. <title>). */
const escText = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/** Escape a value placed inside a double-quoted attribute. */
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

function buildHtml(route) {
  const canonical = `${siteUrl}${route.path === '/' ? '/' : route.path}`;
  const image = route.image ?? defaultImage;

  let html = template;
  html = setTitle(html, route.title);
  html = setMeta(html, 'name', 'description', route.description);
  html = setCanonical(html, canonical);
  // Open Graph
  html = setMeta(html, 'property', 'og:title', route.title);
  html = setMeta(html, 'property', 'og:description', route.description);
  html = setMeta(html, 'property', 'og:url', canonical);
  html = setMeta(html, 'property', 'og:image', image);
  html = setMeta(html, 'property', 'og:image:alt', imageAlt);
  // Twitter / X
  html = setMeta(html, 'name', 'twitter:title', route.title);
  html = setMeta(html, 'name', 'twitter:description', route.description);
  html = setMeta(html, 'name', 'twitter:image', image);
  html = setMeta(html, 'name', 'twitter:image:alt', imageAlt);
  return html;
}

for (const route of config.routes) {
  const html = buildHtml(route);
  const outPath =
    route.path === '/'
      ? join(distDir, 'index.html')
      : join(distDir, route.path.replace(/^\//, ''), 'index.html');

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html, 'utf8');
  console.log(`prerendered ${route.path} -> ${outPath.replace(root, '.')}`);
}

console.log(`\n✓ prerendered ${config.routes.length} routes`);
