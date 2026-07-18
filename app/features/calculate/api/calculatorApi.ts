import { CUBIC_CALCULATOR_CLIENT_BASE } from './config';
import type {
  CalculatorStaticData,
  CuttingRequest,
  CuttingResponse,
  GeneratePdfResponse,
} from './types';

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(text || res.statusText || 'Invalid JSON');
  }
}

export async function getCalculatorData(): Promise<CalculatorStaticData> {
  const res = await fetch(`${CUBIC_CALCULATOR_CLIENT_BASE}/data`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`Справочники: ${res.status} ${res.statusText}`);
  }
  return parseJson<CalculatorStaticData>(res);
}

export async function postCutting(
  body: CuttingRequest,
  init?: RequestInit
): Promise<CuttingResponse> {
  const res = await fetch(`${CUBIC_CALCULATOR_CLIENT_BASE}/cutting`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
    ...init,
  });
  const data = await parseJson<CuttingResponse & { message?: string }>(res);
  if (!res.ok) {
    throw new Error((data as { message?: string }).message || `Расчёт: ${res.status}`);
  }
  if ('success' in data && data.success === false) {
    throw new Error('Сервер вернул success: false');
  }
  return data;
}

export async function postGeneratePdf(
  body: CuttingRequest,
  init?: RequestInit
): Promise<GeneratePdfResponse> {
  const res = await fetch(`${CUBIC_CALCULATOR_CLIENT_BASE}/generate-pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
    ...init,
  });
  const data = await parseJson<GeneratePdfResponse & { message?: string }>(res);
  if (!res.ok) {
    throw new Error((data as { message?: string }).message || `PDF: ${res.status}`);
  }
  if (!data.success || !data.pdf_url) {
    throw new Error('Сервер вернул success: false');
  }
  return data;
}
