export const FRAME_CAP = 32 * 1024 * 1024;
const check = (condition, code) => { if (!condition) throw new Error(code); };

export async function readBoundedPublic(response, cap = FRAME_CAP) {
  const declared = response.headers?.get('content-length');
  if (declared !== null && declared !== undefined && (!/^\d+$/.test(declared) || Number(declared) > cap)) { await response.body?.cancel(); throw new Error('FRAME_LIMIT_EXCEEDED'); }
  const reader = response.body?.getReader();
  check(reader, 'STREAM_REQUIRED');
  const chunks = []; let bytes = 0;
  try {
    for (;;) {
      const { value, done } = await reader.read(); if (done) break;
      bytes += value.byteLength;
      check(bytes <= cap, 'FRAME_LIMIT_EXCEEDED'); chunks.push(value);
    }
  } catch (error) { await reader.cancel().catch(() => {}); throw error; }
  finally { reader.releaseLock(); }
  const data = new Uint8Array(bytes); let offset = 0;
  for (const chunk of chunks) { data.set(chunk, offset); offset += chunk.byteLength; }
  return new TextDecoder('utf-8', { fatal: true }).decode(data);
}
