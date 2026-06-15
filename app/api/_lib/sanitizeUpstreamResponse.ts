/**
 * Node/undici `fetch` распаковывает gzip/deflate, но ответ upstream часто всё ещё
 * содержит `Content-Encoding` / неверный `Content-Length`. Если пробросить их клиенту,
 * браузер пытается декодировать снова → net::ERR_CONTENT_DECODING_FAILED при 200 OK.
 */
const DROP = new Set([
  "content-encoding",
  "transfer-encoding",
  "content-length",
]);

export function sanitizeProxiedResponseHeaders(source: Headers): Headers {
  const out = new Headers();
  source.forEach((value, key) => {
    if (DROP.has(key.toLowerCase())) return;
    out.append(key, value);
  });
  return out;
}
