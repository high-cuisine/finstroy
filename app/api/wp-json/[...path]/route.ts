import { NextRequest, NextResponse } from "next/server";
import { sanitizeProxiedResponseHeaders } from "@/app/api/_lib/sanitizeUpstreamResponse";
import { upstreamProxyFetch } from "@/app/api/_lib/upstreamProxyFetch";
import { WP_PAGES_UPSTREAM } from "@/app/features/wp/api/config";

function targetUrl(path: string[], search: string): string {
  const base = WP_PAGES_UPSTREAM.replace(/\/$/, "");
  const suffix = path.length ? path.join("/") : "";
  const pathPart = suffix ? `/wp-json/${suffix}` : "/wp-json";
  return `${base}${pathPart}${search}`;
}

const PASSTHROUGH_HEADERS = [
  "authorization",
  "content-type",
  "accept",
  "accept-language",
  "cookie",
  "x-wp-nonce",
  "cart-token",
] as const;

async function proxy(request: NextRequest, path: string[] | undefined) {
  const url = targetUrl(path ?? [], request.nextUrl.search);
  const headers = new Headers();
  for (const h of PASSTHROUGH_HEADERS) {
    const v = request.headers.get(h);
    if (v) headers.set(h, v);
  }

  const method = request.method;
  const hasBody = !["GET", "HEAD"].includes(method);
  const body = hasBody ? await request.arrayBuffer() : undefined;

  try {
    const res = await upstreamProxyFetch(url, {
      method,
      headers,
      body,
      redirect: "manual",
    });
    const outHeaders = sanitizeProxiedResponseHeaders(res.headers);
    const outBody = await res.arrayBuffer();

    return new Response(outBody, {
      status: res.status,
      statusText: res.statusText,
      headers: outHeaders,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      {
        code: "UPSTREAM_UNREACHABLE",
        message,
        upstream: WP_PAGES_UPSTREAM,
      },
      { status: 502 },
    );
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxy(request, path);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxy(request, path);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxy(request, path);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxy(request, path);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxy(request, path);
}
