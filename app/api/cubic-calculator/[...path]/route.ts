import { NextRequest } from 'next/server';
import { CUBIC_CALCULATOR_UPSTREAM } from '@/app/features/calculate/api/config';

function targetUrl(path: string[], search: string): string {
  const suffix = path.length ? path.join('/') : '';
  return `${CUBIC_CALCULATOR_UPSTREAM.replace(/\/$/, '')}/${suffix}${search}`;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const url = targetUrl(path ?? [], request.nextUrl.search);
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 0 },
  });
  const body = await res.text();
  return new Response(body, {
    status: res.status,
    headers: {
      'Content-Type': res.headers.get('Content-Type') ?? 'application/json',
    },
  });
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const url = targetUrl(path ?? [], '');
  const body = await request.text();
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': request.headers.get('Content-Type') ?? 'application/json',
      Accept: 'application/json',
    },
    body,
  });
  const text = await res.text();
  return new Response(text, {
    status: res.status,
    headers: {
      'Content-Type': res.headers.get('Content-Type') ?? 'application/json',
    },
  });
}
