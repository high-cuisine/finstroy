import { Agent, fetch as undiciFetch } from "undici";

const pageConnectTimeoutMs =
  Number(process.env.WP_UPSTREAM_PAGE_TIMEOUT_MS) || 12_000;

const pageAgent = new Agent({
  connectTimeout: pageConnectTimeoutMs,
  headersTimeout: Math.max(pageConnectTimeoutMs * 2, 24_000),
  bodyTimeout: 60_000,
});

type UndiciRequestInit = NonNullable<Parameters<typeof undiciFetch>[1]>;

/** Server-rendered pages: fail fast when upstream is unreachable. */
export function wpUpstreamPageFetch(
  input: string | URL,
  init?: UndiciRequestInit,
): Promise<Response> {
  return undiciFetch(input, {
    ...init,
    dispatcher: pageAgent,
  }) as unknown as Promise<Response>;
}
