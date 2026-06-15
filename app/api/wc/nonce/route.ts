import { NextResponse } from "next/server";
import { upstreamProxyFetch } from "@/app/api/_lib/upstreamProxyFetch";
import { WP_PAGES_UPSTREAM } from "@/app/features/wp/api/config";

/**
 * Достаёт nonce для REST из HTML главной WordPress (`wpApiSettings` и т.п.).
 * WooCommerce Store API требует заголовок X-WP-Nonce.
 */
export async function GET() {
  const base = WP_PAGES_UPSTREAM.replace(/\/$/, "");
  try {
    const res = await upstreamProxyFetch(`${base}/`, {
      headers: {
        Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
      },
      redirect: "follow",
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: "upstream_html", status: res.status },
        { status: 502 },
      );
    }
    const html = await res.text();

    const patterns: RegExp[] = [
      /wpApiSettings\s*=\s*\{[^}]*"nonce"\s*:\s*"([^"]+)"/,
      /wpApiSettings\s*=\s*\{[\s\S]*?"nonce"\s*:\s*"([^"]+)"/,
      /"nonce"\s*:\s*"([a-fA-F0-9]{10,})"/,
      /restNonce["']\s*:\s*["']([a-fA-F0-9]{10,})["']/,
    ];

    for (const re of patterns) {
      const m = html.match(re);
      if (m?.[1] && /^[a-zA-Z0-9_-]+$/.test(m[1])) {
        return NextResponse.json({ nonce: m[1] });
      }
    }

    return NextResponse.json(
      {
        error: "nonce_not_found",
        hint:
          "На главной WP не найден wpApiSettings.nonce. Добавьте в WordPress REST-эндпоинт, отдающий wp_create_nonce('wp_rest'), или откройте для гостей блок с wp-api.",
      },
      { status: 404 },
    );
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "fetch failed" },
      { status: 502 },
    );
  }
}
