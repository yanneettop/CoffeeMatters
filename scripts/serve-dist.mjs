// Local static server that mimics Cloudflare Pages behaviour for verifying the
// prerendered build: clean URLs (/menu -> dist/menu/index.html) with a
// single-page fallback to dist/index.html for unknown routes.
//
// Usage: PORT=4180 node scripts/serve-dist.mjs

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = resolve(fileURLToPath(import.meta.url), '../../dist');
const port = Number(process.env.PORT || 4180);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.ico': 'image/x-icon',
};

async function tryFile(p) {
  try {
    const s = await stat(p);
    if (s.isFile()) return p;
  } catch {
    /* not found */
  }
  return null;
}

const server = createServer(async (req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);

  let file = null;
  if (extname(urlPath)) {
    file = await tryFile(join(dist, urlPath)); // asset request
  } else {
    file =
      (await tryFile(join(dist, urlPath, 'index.html'))) || // clean URL
      (await tryFile(join(dist, `${urlPath}.html`)));
  }
  // SPA fallback
  if (!file) file = join(dist, 'index.html');

  try {
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end('Not found');
  }
});

server.listen(port, () => console.log(`dist served at http://localhost:${port}`));
