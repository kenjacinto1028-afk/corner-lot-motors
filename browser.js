'use strict';

// The static host caps individual asset sizes. Decompress the engine binary as it streams.
const originalFetch = globalThis.fetch.bind(globalThis);
const engineBinary = new URL('index.wasm', document.baseURI).href;
globalThis.fetch = async function (resource, options) {
  const url = new URL(resource instanceof Request ? resource.url : resource, document.baseURI);
  if (url.href !== engineBinary) {
    return originalFetch(resource, options);
  }
  const response = await originalFetch(new URL('index-wasm.bin', document.baseURI), options);
  if (!response.ok) {
    return response;
  }
  const binary = response.body.pipeThrough(new DecompressionStream('gzip'));
  return new Response(binary, { headers: { 'Content-Type': 'application/wasm' } });
};

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('portrait')?.addEventListener('click', () => {
    document.getElementById('phone-note').hidden = true;
    document.getElementById('canvas').focus();
  });
});
