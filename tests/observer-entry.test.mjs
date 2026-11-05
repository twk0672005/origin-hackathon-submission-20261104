import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { inspectPublicAvailability, PUBLIC_ENDPOINTS, RENDER_URL } from '../observer-target.mjs';
import { createObserverServer } from '../server.mjs';

test('只檢查固定8844的公開GET，不採預設舊埠或任何世界控制', async () => {
  const calls = [];
  const result = await inspectPublicAvailability(async (url, options) => {
    calls.push({ url, options });
    return new Response('{"testDouble":"public-interface-only"}', { headers: { 'content-type': 'application/json' } });
  });
  assert.deepEqual(calls.map(c => c.url).sort(), Object.values(PUBLIC_ENDPOINTS).sort());
  assert(calls.every(c => c.options.method === 'GET' && c.options.redirect === 'error' && new URL(c.url).port === '8844'));
  assert.equal(result.status, 'PUBLIC_INTERFACES_REACHABLE');
  assert.equal(result.actualWorldVerified, false); assert.equal(result.realModelCallVerified, false);
  assert.equal(result.verdict, 'PARTIAL'); assert.equal(result.checks.find(c => c.kind === 'base').bodyRead, false);
  assert.equal(new URL(RENDER_URL).searchParams.get('observer'), '8844');
});

test('外部服務未開、非200、非JSON或過大時如實回未就緒', async () => {
  for (const fetcher of [async () => { throw new Error('Test upstream unavailable'); }, async () => new Response('{}', { status: 503 }), async () => new Response('{}', { status: 201, headers: { 'content-type': 'application/json' } }), async () => new Response('<html></html>', { headers: { 'content-type': 'text/html' } }), async () => new Response('{}', { headers: { 'content-type': 'application/json', 'content-length': '2000000' } })]) {
    const result = await inspectPublicAvailability(fetcher);
    assert.equal(result.status, 'DEPENDENCY_NOT_READY');
    assert.equal(result.actualWorldVerified, false); assert.equal(result.realModelCallVerified, false);
  }
});

test('本機入口可運行且唯讀，沒有舊場景或檔案瀏覽fallback', async () => {
  const server = createObserverServer(async () => { throw new Error('Test upstream unavailable'); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}`;
  try {
    const page = await fetch(url); assert.equal(page.status, 200);
    const html = await page.text(); assert.match(html, /observer=8844/); assert.doesNotMatch(html, /<svg|data-phase/);
    const status = await (await fetch(url + '/api/availability')).json(); assert.equal(status.status, 'DEPENDENCY_NOT_READY');
    for (const p of ['/README.md', '/api/shared-test/frame', '/%2e%2e/package.json', '/.env']) assert.equal((await fetch(url + p)).status, 404);
    assert.equal((await fetch(url, { method: 'POST' })).status, 405);
  } finally { const closed = new Promise(resolve => server.close(resolve)); server.closeAllConnections(); await closed; }
});

test('包內只有入口/純讀取程式，沒有私有或生成模組', async () => {
  const entries = await readdir(new URL('..', import.meta.url), { recursive: true });
  for (const entry of entries) assert.doesNotMatch(entry, /(?:node_modules|dist|runtime|calls|\.env|\.sqlite|\.log$|receipt|key-loader|world-kernel|build-draft|fixture|plates|assembly-shapes|SSOT|whitepaper)/i);
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  for (const text of ['自主生活目前為部分完成', '正式 Stage2 未完成', '居民目前處於安靜觀察狀態']) assert(html.includes(text));
});
