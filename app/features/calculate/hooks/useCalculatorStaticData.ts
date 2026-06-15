import { useState, useEffect, useCallback } from 'react';
import { getCalculatorData } from '../api/calculatorApi';
import type { CalculatorStaticData } from '../api/types';

function toNumber(v: unknown): number {
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0;
  if (typeof v === 'string') {
    const n = Number(v.replace(',', '.'));
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function normalizeStaticData(raw: CalculatorStaticData): CalculatorStaticData {
  return {
    formats: raw.formats.map((f) => ({
      ...f,
      id: toNumber((f as unknown as { id: unknown }).id),
      width_mm: toNumber((f as unknown as { width_mm: unknown }).width_mm),
      height_mm: toNumber((f as unknown as { height_mm: unknown }).height_mm),
    })),
    materials: raw.materials.map((m) => ({
      ...m,
      id: toNumber((m as unknown as { id: unknown }).id),
      density: toNumber((m as unknown as { density: unknown }).density),
    })),
    thickness: raw.thickness.map((t) => ({
      ...t,
      id: toNumber((t as unknown as { id: unknown }).id),
      value_mm: toNumber((t as unknown as { value_mm: unknown }).value_mm),
    })),
    blade_widths: raw.blade_widths.map((b) => ({
      ...b,
      id: toNumber((b as unknown as { id: unknown }).id),
      value_mm: toNumber((b as unknown as { value_mm: unknown }).value_mm),
    })),
  };
}

export function useCalculatorStaticData() {
  const [data, setData] = useState<CalculatorStaticData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCalculatorData();
      setData(normalizeStaticData(res));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка загрузки справочников');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}
