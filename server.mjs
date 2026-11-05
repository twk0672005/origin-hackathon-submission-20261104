import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { inspectPublicAvailability } from './observer-target.mjs';

const files = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/index.html', ['index.html', 'text/html; charset=utf-8']],
  ['/app.mjs', ['app.mjs', 'text/javascript; charset=utf-8']],
  ['/style.css', ['style.css', 'text/css; charset=utf-8']],
]);

export function createObserverServer(fetcher = fetch) {
  return http.createServer(async (req, res) => {
    res.setHeader('cache-control', 'no-store'); res.setHeader('x-content-type-options', 'nosniff');
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { allow: 'GET, HEAD' }); res.end('Read only'); return; }
    let pathname;
    try { pathname = new URL(req.url, 'http://localhost').pathname; }
    catch { res.writeHead(400); res.end('Invalid request'); return; }
    if (pathname === '/api/availability') {
      if (req.method === 'HEAD') { res.writeHead(405); res.end(); return; }
      try {
        const result = await inspectPublicAvailability(fetcher);
        res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' }); res.end(JSON.stringify(result));
      } catch { res.writeHead(503); res.end('Availability check unavailable'); }
      return;
    }
    const entry = files.get(pathname);
    if (!entry) { res.writeHead(404); res.end('Not found'); return; }
    try {
      const body = await readFile(new URL(entry[0], import.meta.url));
      res.writeHead(200, { 'content-type': entry[1] }); res.end(req.method === 'HEAD' ? undefined : body);
    } catch { res.writeHead(500); res.end('Entry file unavailable'); }
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT ?? 5298);
  if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('PORT must be 1024–65535');
  const server = createObserverServer();
  server.on('error', error => { console.error(error.message); process.exitCode = 1; });
  server.listen(port, '127.0.0.1', () => console.log(`Origin current observer entry: http://127.0.0.1:${port}/`));
}
