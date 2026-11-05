import { readBoundedPublic } from './lib/read-bounded-public.mjs';

export const RENDER_URL = 'http://127.0.0.1:5219/?render=construction&view=resident&shared=1&observer=8844';
export const PUBLIC_ENDPOINTS = Object.freeze({
  base: 'http://127.0.0.1:8844/api/shared-test/base',
  frame: 'http://127.0.0.1:8844/api/shared-test/frame',
});

export async function inspectPublicAvailability(fetcher = fetch) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4000);
  try {
    const checks = await Promise.all(Object.entries(PUBLIC_ENDPOINTS).map(async ([kind, url]) => {
      try {
        const response = await fetcher(url, { method: 'GET', redirect: 'error', credentials: 'omit', cache: 'no-store', signal: controller.signal });
        const row = { kind, endpoint: url, httpStatus: response.status, available: false };
        if (response.status !== 200) { await response.body?.cancel(); return { ...row, error: 'UPSTREAM_NON_200' }; }
        if (!response.headers.get('content-type')?.includes('application/json')) { await response.body?.cancel(); return { ...row, error: 'UPSTREAM_NOT_JSON' }; }
        if (kind === 'base') { await response.body?.cancel(); return { ...row, available: true, bodyRead: false }; }
        const text = await readBoundedPublic(response, 1024 * 1024);
        JSON.parse(text);
        return { ...row, available: true, frameBytes: new TextEncoder().encode(text).byteLength, worldAdmissionVerified: false };
      } catch (error) {
        return { kind, endpoint: url, available: false, error: error.name === 'AbortError' ? 'UPSTREAM_TIMEOUT' : 'UPSTREAM_UNAVAILABLE_OR_INVALID' };
      }
    }));
    return { status: checks.every(row => row.available) ? 'PUBLIC_INTERFACES_REACHABLE' : 'DEPENDENCY_NOT_READY', renderUrl: RENDER_URL, observerPort: 8844, checks, actualWorldVerified: false, realModelCallVerified: false, verdict: 'PARTIAL' };
  } finally { clearTimeout(timer); }
}
