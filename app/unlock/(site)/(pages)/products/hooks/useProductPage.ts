"use client";

import { useEffect, useMemo, useState } from "react";
import { useCartStore } from "@/app/features/cart";
import { useCatalogCategoriesStore } from "@/app/features/catalogCategories";
import {
  getProductCatalogItems,
  fetchCalculatorProductIds,
  type ProductCatalogItem,
} from "@/app/features/wp/api/wpProductsApi";
import { pickProductIdForCategory } from "../helpers/findProductForCategory";
import { FLAT_CATALOG_NAV } from "../constants/productCatalogNav";
import { FORMATS, THICKNESSES, DEFAULT_PRICE_PER_SHEET } from "../data/productSpec";

export function useProductPage() {
  const selectedCategoryId = useCatalogCategoriesStore((s) => s.selectedCategoryId);
  const storeCategories = useCatalogCategoriesStore((s) => s.categories);
  const addItem = useCartStore((s) => s.addItem);
  const cartMutating = useCartStore((s) => s.mutating);
  const cartError = useCartStore((s) => s.error);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formatIdx, setFormatIdx] = useState(-1);
  const [thicknessIdx, setThicknessIdx] = useState(-1);
  const [sheets, setSheets] = useState(0);
  const [reserve, setReserve] = useState(true);

  const [wooProductId, setWooProductId] = useState<number | null>(null);
  const [productIdError, setProductIdError] = useState<string | null>(null);
  const [productIdLoading, setProductIdLoading] = useState(true);
  const [catalogItems, setCatalogItems] = useState<ProductCatalogItem[]>([]);
  const [calculatorIds, setCalculatorIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    let cancelled = false;
    void Promise.all([getProductCatalogItems(), fetchCalculatorProductIds()])
      .then(([items, calcIds]) => {
        if (cancelled) return;
        setCatalogItems(items);
        setCalculatorIds(calcIds);

        const fromEnv = process.env.NEXT_PUBLIC_WC_PRODUCT_PAGE_ID;
        if (fromEnv) {
          const n = parseInt(fromEnv, 10);
          if (Number.isFinite(n) && n > 0) {
            setWooProductId(n);
            setProductIdError(null);
            return;
          }
        }
        const first = items[0];
        if (first) {
          const id = parseInt(first.id, 10);
          if (Number.isFinite(id) && id > 0) {
            setWooProductId(id);
            setProductIdError(null);
          } else {
            setProductIdError("Некорректный ID товара в каталоге");
          }
        } else {
          setProductIdError("В каталоге нет товаров — задайте NEXT_PUBLIC_WC_PRODUCT_PAGE_ID");
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setProductIdError(e instanceof Error ? e.message : "Не удалось загрузить список товаров");
        }
      })
      .finally(() => {
        if (!cancelled) setProductIdLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (selectedCategoryId === "all" || catalogItems.length === 0) return;

    const label =
      storeCategories.find((c) => c.id === selectedCategoryId)?.label ??
      FLAT_CATALOG_NAV.find((c) => c.id === selectedCategoryId)?.label ??
      "";

    const productId = pickProductIdForCategory(
      selectedCategoryId,
      label,
      catalogItems,
      storeCategories,
      FLAT_CATALOG_NAV,
    );

    if (productId) {
      setWooProductId(productId);
      setProductIdError(null);
    }
  }, [selectedCategoryId, catalogItems, storeCategories]);

  const selectedProduct = useMemo(() => {
    if (wooProductId) {
      return catalogItems.find((item) => item.id === String(wooProductId)) ?? catalogItems[0] ?? null;
    }
    return catalogItems[0] ?? null;
  }, [catalogItems, wooProductId]);

  const galleryImages = selectedProduct?.images ?? [];
  const unitPrice = selectedProduct?.price ?? null;
  const calculatorUnitPrice = unitPrice ?? DEFAULT_PRICE_PER_SHEET;

  const format = formatIdx >= 0 ? FORMATS[formatIdx] : null;
  const thickness = thicknessIdx >= 0 ? THICKNESSES[thicknessIdx] : null;
  const effectiveSheets = reserve ? Math.ceil(sheets * 1.1) : sheets;

  const area = format ? +(effectiveSheets * format.area).toFixed(2) : 0;
  const volume = format && thickness ? +(area * (thickness.mm / 1000)).toFixed(3) : 0;
  const weight = thickness ? +(volume * thickness.density).toFixed(1) : 0;
  const total = (effectiveSheets * calculatorUnitPrice).toLocaleString("ru-RU");

  const selectedCategory =
    storeCategories.find((c) => c.id === selectedCategoryId)?.label ??
    FLAT_CATALOG_NAV.find((c) => c.id === selectedCategoryId)?.label ??
    "Каталог";

  const showCalculator = wooProductId !== null && calculatorIds.has(wooProductId);
  const qtyToAdd = Math.max(1, effectiveSheets);

  const canAddSimpleToCart = useMemo(
    () => Boolean(wooProductId) && !cartMutating && !productIdLoading && unitPrice !== null,
    [wooProductId, cartMutating, productIdLoading, unitPrice],
  );

  const canAddToCart = useMemo(
    () =>
      Boolean(wooProductId) &&
      format !== null &&
      thickness !== null &&
      effectiveSheets >= 1 &&
      !cartMutating &&
      !productIdLoading,
    [wooProductId, format, thickness, effectiveSheets, cartMutating, productIdLoading],
  );

  function addToCart() {
    if (!wooProductId || !canAddToCart) return;
    void addItem(wooProductId, qtyToAdd);
  }

  function addSimpleToCart() {
    if (!wooProductId || !canAddSimpleToCart) return;
    void addItem(wooProductId, 1);
  }

  return {
    selectedProduct,
    galleryImages,
    unitPrice,
    calculatorUnitPrice,
    wooProductId,
    productIdError,
    productIdLoading,
    showCalculator,
    selectedCategory,
    formats: FORMATS,
    thicknesses: THICKNESSES,
    formatIdx,
    setFormatIdx,
    thicknessIdx,
    setThicknessIdx,
    sheets,
    setSheets,
    reserve,
    setReserve,
    area,
    volume,
    weight,
    total,
    effectiveSheets,
    qtyToAdd,
    canAddToCart,
    canAddSimpleToCart,
    cartMutating,
    cartError,
    addToCart,
    addSimpleToCart,
    sidebarOpen,
    setSidebarOpen,
  };
}
