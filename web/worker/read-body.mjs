/** Limit streamed bytes before decoding JSON, even without Content-Length.
 * @param {Request} request @param {number} limit */
export async function readBody(request, limit) {
  if (Number(request.headers.get('content-length')) > limit) throw Error('body-too-large');
  if (!request.body) return '';
  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) { await reader.cancel(); throw Error('body-too-large'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return new TextDecoder().decode(bytes);
}
