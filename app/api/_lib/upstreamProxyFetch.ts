import { Agent, fetch as undiciFetch } from "undici";

/**
 * Node’s built-in `fetch` uses undici with a 10s connect timeout; slow or distant
 * WordPress hosts often need longer. Env override for VPN / flaky networks.
 */
const connectTimeoutMs =
  Number(process.env.WP_UPSTREAM_CONNECT_TIMEOUT_MS) || 45_000;

const upstreamAgent = new Agent({
  connectTimeout: connectTimeoutMs,
  headersTimeout: Math.max(connectTimeoutMs * 2, 60_000),
  bodyTimeout: 120_000,
});

type UndiciRequestInit = NonNullable<Parameters<typeof undiciFetch>[1]>;

/** Proxied upstream request with relaxed connect timing (same API as `fetch`). */
export function upstreamProxyFetch(
  input: string | URL,
  init?: UndiciRequestInit,
): Promise<Response> {
  return undiciFetch(input, {
    ...init,
    dispatcher: upstreamAgent,
  }) as unknown as Promise<Response>;
}
