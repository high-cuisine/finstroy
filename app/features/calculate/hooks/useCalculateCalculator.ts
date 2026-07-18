import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type { CutPiece } from '@/app/unlock/(site)/(pages)/calculate/helpers/types';
import { expandPiecesForPacking, packPieces } from '@/app/unlock/(site)/(pages)/calculate/helpers/packPieces';
import { INITIAL_PIECES } from '@/app/unlock/(site)/(pages)/calculate/helpers/constants';
import { postCutting, postGeneratePdf } from '../api/calculatorApi';
import type { CuttingRequest, CuttingResponse } from '../api/types';
import { partsFromPieces } from '../utils/partsFromPieces';
import { useCalculatorStaticData } from './useCalculatorStaticData';
import { useCartStore } from '@/app/features/cart';
import { fetchCalculatorProductId } from '@/app/features/wp/api/wpProductsApi';

const DEBOUNCE_MS = 300;

/**
 * Превью раскроя на канвасе — локальный `packPieces` (может отличаться от ответа сервера).
 * Блок «Результаты» — цифры с POST /cutting (`sheets_used`, длина, отходы, цена).
 */
export function useCalculateCalculator() {
  const { data: staticData, loading: staticLoading, error: staticError, refetch } =
    useCalculatorStaticData();

  const [formatId, setFormatId] = useState<number | null>(null);
  const [materialId, setMaterialId] = useState<number | null>(null);
  const [thicknessId, setThicknessId] = useState<number | null>(null);
  const [bladeWidthId, setBladeWidthId] = useState<number | null>(null);

  const [useCustomSize, setUseCustomSize] = useState(true);
  const [customWidth, setCustomWidth] = useState('');
  const [customHeight, setCustomHeight] = useState('');
  const [rotation, setRotation] = useState(0);

  const [pieces, setPieces] = useState<CutPiece[]>(INITIAL_PIECES);
  const [activeSheet, setActiveSheet] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [showDimensions, setShowDimensions] = useState(true);
  const [edgeOffsetX, setEdgeOffsetX] = useState('');
  const [edgeOffsetY, setEdgeOffsetY] = useState('');
  const canvasRef = useRef<HTMLDivElement>(null);
  const nextIdRef = useRef(7);

  const [cuttingResult, setCuttingResult] = useState<CuttingResponse | null>(null);
  const [cuttingLoading, setCuttingLoading] = useState(false);
  const [cuttingError, setCuttingError] = useState<string | null>(null);

  const [cartProductId, setCartProductId] = useState<number | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addToCartError, setAddToCartError] = useState<string | null>(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);
  const [newSheetNotice, setNewSheetNotice] = useState<{ sheetNumber: number } | null>(
    null
  );

  useEffect(() => {
    let cancelled = false;
    fetchCalculatorProductId().then((id) => {
      if (!cancelled) setCartProductId(id);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const requestSeq = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const prevSheetsLenRef = useRef(0);
  const jumpToNewSheetRef = useRef(false);

  const formatIdResolved = formatId ?? staticData?.formats[0]?.id ?? null;
  const materialIdResolved = materialId ?? staticData?.materials[0]?.id ?? null;
  const thicknessIdResolved = thicknessId ?? staticData?.thickness[0]?.id ?? null;
  const bladeWidthIdResolved = bladeWidthId ?? staticData?.blade_widths[0]?.id ?? null;

  const selectedFormat = useMemo(() => {
    if (!staticData || formatIdResolved === null) return undefined;
    return staticData.formats.find((f) => f.id === formatIdResolved);
  }, [staticData, formatIdResolved]);

  const kerfMm = useMemo(() => {
    if (!staticData || bladeWidthIdResolved === null) return 0;
    const v =
      staticData.blade_widths.find((b) => b.id === bladeWidthIdResolved)?.value_mm ?? 0;
    return Number(v) || 0;
  }, [staticData, bladeWidthIdResolved]);

  const rawSheetWidth = useCustomSize
    ? parseInt(customWidth, 10) || 0
    : Number(selectedFormat?.width_mm) || 0;
  const rawSheetHeight = useCustomSize
    ? parseInt(customHeight, 10) || 0
    : Number(selectedFormat?.height_mm) || 0;
  const isRotated = ((rotation % 180) + 180) % 180 === 90;
  const sheetWidth = isRotated ? rawSheetHeight : rawSheetWidth;
  const sheetHeight = isRotated ? rawSheetWidth : rawSheetHeight;
  const edgeOffsetXValue = Math.max(0, parseInt(edgeOffsetX, 10) || 0);
  const edgeOffsetYValue = Math.max(0, parseInt(edgeOffsetY, 10) || 0);

  const validPieces = useMemo(
    () =>
      pieces.filter((p) => {
        if (p.width <= 0 || p.height <= 0) return false;
        const q = p.quantity != null ? p.quantity : 1;
        return q > 0;
      }),
    [pieces]
  );

  const piecesForPacking = useMemo(
    () => expandPiecesForPacking(validPieces),
    [validPieces]
  );

  const requestParts = useMemo(
    () => partsFromPieces(validPieces),
    [validPieces]
  );

  const sheets = useMemo(
    () =>
      packPieces(
        piecesForPacking,
        sheetWidth,
        sheetHeight,
        kerfMm,
        edgeOffsetXValue,
        edgeOffsetYValue
      ),
    [piecesForPacking, sheetWidth, sheetHeight, kerfMm, edgeOffsetXValue, edgeOffsetYValue]
  );

  useEffect(() => {
    const prev = prevSheetsLenRef.current;
    const next = sheets.length;
    prevSheetsLenRef.current = next;
    if (!jumpToNewSheetRef.current) return;
    if (next > prev) {
      jumpToNewSheetRef.current = false;
      requestAnimationFrame(() => {
        setNewSheetNotice({ sheetNumber: next });
        setActiveSheet(Math.max(0, next - 1));
      });
    }
  }, [sheets.length]);

  const activeSheetResolved = useMemo(
    () => {
      return sheets.length === 0 ? 0 : Math.min(activeSheet, sheets.length - 1);
    },
    [activeSheet, sheets.length]
  );

  const currentSheet = sheets[activeSheetResolved] ?? null;

  const canPost =
    !!staticData &&
    !staticLoading &&
    formatIdResolved !== null &&
    materialIdResolved !== null &&
    thicknessIdResolved !== null &&
    bladeWidthIdResolved !== null &&
    validPieces.length > 0 &&
    sheetWidth > 0 &&
    sheetHeight > 0;

  const cuttingRequestBody = useMemo<CuttingRequest | null>(() => {
    if (!canPost || requestParts.length === 0) return null;
    return {
      sheet_width: sheetWidth,
      sheet_height: sheetHeight,
      parts: requestParts,
      blade_width_id: bladeWidthIdResolved as number,
      thickness_id: thicknessIdResolved as number,
      material_id: materialIdResolved as number,
    };
  }, [
    canPost,
    requestParts,
    sheetWidth,
    sheetHeight,
    bladeWidthIdResolved,
    thicknessIdResolved,
    materialIdResolved,
  ]);

  useEffect(() => {
    if (!cuttingRequestBody) return;

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    const seq = ++requestSeq.current;

    const timer = setTimeout(() => {
      setCuttingLoading(true);
      setCuttingError(null);
      postCutting(cuttingRequestBody, { signal: ac.signal })
        .then((res) => {
          if (seq !== requestSeq.current) return;
          setCuttingResult(res);
        })
        .catch((e: unknown) => {
          if (e instanceof Error && e.name === 'AbortError') return;
          if (seq !== requestSeq.current) return;
          setCuttingError(e instanceof Error ? e.message : 'Ошибка расчёта');
          setCuttingResult(null);
        })
        .finally(() => {
          if (seq === requestSeq.current) setCuttingLoading(false);
        });
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      ac.abort();
    };
  }, [cuttingRequestBody]);

  const displayCuttingResult = canPost ? cuttingResult : null;
  const displayCuttingLoading = cuttingLoading && canPost;

  const sheetsCount = displayCuttingResult?.sheets_used ?? 0;
  const totalCutLength = displayCuttingResult?.total_cut_length ?? 0;
  const wasteArea = displayCuttingResult?.waste_area ?? 0;
  const pricePerMeter = displayCuttingResult?.price_per_meter ?? 0;
  const totalPrice = displayCuttingResult?.total_price ?? 0;

  const addToCart = useCallback(async () => {
    if (!cartProductId) return;
    const qty = displayCuttingResult?.sheets_used ?? 1;
    setAddingToCart(true);
    setAddToCartError(null);
    try {
      await addItem(cartProductId, qty);
    } catch (e) {
      setAddToCartError(e instanceof Error ? e.message : 'Ошибка добавления в корзину');
    } finally {
      setAddingToCart(false);
    }
  }, [cartProductId, displayCuttingResult, addItem]);

  const downloadPdf = useCallback(async () => {
    if (!cuttingRequestBody) return;
    setGeneratingPdf(true);
    setPdfError(null);
    try {
      const res = await postGeneratePdf(cuttingRequestBody);
      window.open(res.pdf_url, '_blank', 'noopener,noreferrer');
    } catch (e) {
      setPdfError(e instanceof Error ? e.message : 'Ошибка формирования PDF');
    } finally {
      setGeneratingPdf(false);
    }
  }, [cuttingRequestBody]);

  const addPiece = useCallback(() => {
    jumpToNewSheetRef.current = true;
    setPieces((prev) => [
      ...prev,
      { id: nextIdRef.current++, width: 0, height: 0, quantity: 1 },
    ]);
  }, []);

  const updatePiece = useCallback(
    (id: number, field: 'width' | 'height' | 'quantity', value: number) => {
      jumpToNewSheetRef.current = true;
      setPieces((prev) =>
        prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
      );
    },
    []
  );

  const removePiece = useCallback((id: number) => {
    jumpToNewSheetRef.current = true;
    setPieces((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const dismissNewSheetNotice = useCallback(() => {
    setNewSheetNotice(null);
  }, []);

  return {
    staticData,
    staticLoading,
    staticError,
    refetchStatic: refetch,

    formatId,
    setFormatId,
    materialId,
    setMaterialId,
    thicknessId,
    setThicknessId,
    bladeWidthId,
    setBladeWidthId,

    useCustomSize,
    setUseCustomSize,
    customWidth,
    setCustomWidth,
    customHeight,
    setCustomHeight,
    rotation,
    setRotation,

    pieces,
    activeSheet: activeSheetResolved,
    setActiveSheet,
    zoom,
    setZoom,
    showDimensions,
    setShowDimensions,
    canvasRef,
    sheetWidth,
    sheetHeight,
    edgeOffsetX,
    setEdgeOffsetX,
    edgeOffsetY,
    setEdgeOffsetY,
    sheets,
    currentSheet,

    kerfMm,

    sheetsCount,
    totalCutLength,
    wasteArea,
    pricePerMeter,
    totalPrice,
    cuttingLoading: displayCuttingLoading,
    cuttingError: canPost ? cuttingError : null,
    cuttingResult: displayCuttingResult,
    /** Массив `parts` для POST /cutting (из правой панели: width, height, quantity). */
    requestParts,

    addPiece,
    updatePiece,
    removePiece,

    addToCart,
    addingToCart,
    addToCartError,
    canAddToCart: cartProductId !== null && !addingToCart,

    downloadPdf,
    generatingPdf,
    pdfError,
    canDownloadPdf: cuttingRequestBody !== null && !generatingPdf,

    newSheetNotice,
    dismissNewSheetNotice,
  };
}
