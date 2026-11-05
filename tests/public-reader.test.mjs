import test from 'node:test';
import assert from 'node:assert/strict';
import { readBoundedPublic } from '../lib/read-bounded-public.mjs';

test('bounded streaming enforces bytes before parse and cancels excessive bodies including UTF-8',async()=>{
  const text='{"text":"河谷"}';assert.equal(await readBoundedPublic(new Response(text),100),text);
  let cancelled=false;
  const stream=new ReadableStream({pull(controller){controller.enqueue(new Uint8Array(80));},cancel(){cancelled=true;}});
  await assert.rejects(readBoundedPublic(new Response(stream),100),/FRAME_LIMIT/);assert.equal(cancelled,true);
  await assert.rejects(readBoundedPublic(new Response(text,{headers:{'content-length':'1000'}}),100),/FRAME_LIMIT/);
  await assert.rejects(readBoundedPublic(new Response('河'.repeat(40)),100),/FRAME_LIMIT/);
});
