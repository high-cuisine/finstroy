"use client";

import { use, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/app/shared/componets/layout/Header/Header";
import Footer from "@/app/shared/componets/layout/Footer/Footer";
import Button from "@/app/shared/componets/ui/Button";
import { useCartStore } from "@/app/features/cart";
import {
  fetchProductById,
  fetchCalculatorProductIds,
  type ProductCatalogItem,
} from "@/app/features/wp/api/wpProductsApi";
import { useCatalogCategoriesStore } from "@/app/features/catalogCategories";
import { sitePath } from "@/app/shared/lib/sitePath";
import {
  CatalogSidebar,
  CatalogSidebarMobileButton,
} from "../components/CatalogSidebar/CatalogSidebar";
import { ProductGallery } from "../components/ProductGallery/ProductGallery";
import { ProductSimpleSummary } from "../components/ProductSimpleSummary/ProductSimpleSummary";
import styles from "../products.module.scss";

// ─── Data ─────────────────────────────────────────────────────────────────────

const formats = [
  { label: "1525×1525 мм", area: 1.525 * 1.525 },
  { label: "2440×1220 мм", area: 2.44 * 1.22 },
  { label: "2500×1250 мм", area: 2.5 * 1.25 },
  { label: "3000×1500 мм", area: 3.0 * 1.5 },
];

const thicknesses = [
  { label: "3 мм", mm: 3, density: 760 },
  { label: "4 мм", mm: 4, density: 750 },
  { label: "6,5 мм", mm: 6.5, density: 730 },
  { label: "9 мм", mm: 9, density: 720 },
  { label: "12 мм", mm: 12, density: 710 },
  { label: "15 мм", mm: 15, density: 700 },
  { label: "18 мм", mm: 18, density: 690 },
  { label: "21 мм", mm: 21, density: 680 },
  { label: "24 мм", mm: 24, density: 670 },
  { label: "27 мм", mm: 27, density: 660 },
  { label: "30 мм", mm: 30, density: 650 },
];

const PRICE_PER_SHEET = 2876;

const tableRows = [
  { t: "3", l: "3", so: "+0,3 -0,4", sr: "0,6", no_: "+0,3 -0,4", nr: "0,6" },
  { t: "4", l: "3", so: "+0,3 -0,5", sr: "0,6", no_: "+0,3 -0,5", nr: "1,0" },
  { t: "6,5", l: "5", so: "+0,4 -0,5", sr: "0,6", no_: "+0,4 -0,5", nr: "1,0" },
  { t: "9", l: "7", so: "+0,4 -0,6", sr: "0,6", no_: "+0,4 -0,6", nr: "0,6" },
  { t: "12", l: "9", so: "+0,4 -0,6", sr: "0,6", no_: "+0,4 -0,6", nr: "1,0" },
  { t: "15", l: "11", so: "+0,4 -0,7", sr: "0,8", no_: "+0,4 -0,7", nr: "1,5" },
  { t: "18", l: "13", so: "+0,5 -0,7", sr: "0,8", no_: "+0,5 -0,7", nr: "1,5" },
  { t: "21", l: "15", so: "+0,5 -0,7", sr: "1,0", no_: "+0,5 -0,7", nr: "2,0" },
  { t: "24", l: "17", so: "+0,4 -0,6", sr: "1,0", no_: "+0,4 -0,6", nr: "2,0" },
  { t: "27", l: "19", so: "+0,4 -0,6", sr: "1,0", no_: "+0,4 -0,6", nr: "2,0" },
  { t: "30", l: "21", so: "+0,3 -0,5", sr: "1,0", no_: "+0,4 -0,6", nr: "2,0" },
];

// ─── Icons ────────────────────────────────────────────────────────────────────

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Checkmark() {
  return (
    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden="true">
      <path d="M1 5l3.5 3.5L11 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();

  const addItem = useCartStore((s) => s.addItem);
  const cartMutating = useCartStore((s) => s.mutating);
  const cartError = useCartStore((s) => s.error);

  const [product, setProduct] = useState<ProductCatalogItem | null>(null);
  const [productLoading, setProductLoading] = useState(true);
  const [productError, setProductError] = useState<string | null>(null);
  const [calculatorIds, setCalculatorIds] = useState<Set<number>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const setSelectedCategoryId = useCatalogCategoriesStore((state) => state.setSelectedCategoryId);

  // Calculator state — synced with URL search params
  const [formatIdx, setFormatIdx] = useState(() => {
    const v = parseInt(searchParams.get("format") ?? "", 10);
    return Number.isFinite(v) && v >= 0 && v < formats.length ? v : -1;
  });
  const [thicknessIdx, setThicknessIdx] = useState(() => {
    const v = parseInt(searchParams.get("thickness") ?? "", 10);
    return Number.isFinite(v) && v >= 0 && v < thicknesses.length ? v : -1;
  });
  const [sheets, setSheets] = useState(() => {
    const v = parseInt(searchParams.get("sheets") ?? "", 10);
    return Number.isFinite(v) && v >= 0 ? v : 0;
  });
  const [reserve, setReserve] = useState(() => searchParams.get("reserve") !== "0");

  // Load product by ID
  useEffect(() => {
    const numId = parseInt(id, 10);
    if (!Number.isFinite(numId) || numId <= 0) {
      setProductError("Некорректный ID товара");
      setProductLoading(false);
      return;
    }
    let cancelled = false;
    setProductLoading(true);
    void fetchProductById(numId)
      .then((item) => {
        if (cancelled) return;
        if (item) {
          setProduct(item);
          if (item.categoryId && item.categoryId !== "all") {
            setSelectedCategoryId(item.categoryId);
          }
        } else {
          setProductError("Товар не найден");
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) setProductError(e instanceof Error ? e.message : "Ошибка загрузки");
      })
      .finally(() => {
        if (!cancelled) setProductLoading(false);
      });
    return () => { cancelled = true; };
  }, [id, setSelectedCategoryId]);

  useEffect(() => {
    let cancelled = false;
    void fetchCalculatorProductIds()
      .then((ids) => {
        if (!cancelled) setCalculatorIds(ids);
      })
      .catch(() => {
        if (!cancelled) setCalculatorIds(new Set());
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const wooProductId = parseInt(id, 10);
  const showCalculator = Number.isFinite(wooProductId) && calculatorIds.has(wooProductId);

  // Sync calculator state → URL search params
  useEffect(() => {
    if (!showCalculator) {
      router.replace(sitePath(`/products/${id}`), { scroll: false });
      return;
    }

    const p = new URLSearchParams();
    if (formatIdx >= 0) p.set("format", String(formatIdx));
    if (thicknessIdx >= 0) p.set("thickness", String(thicknessIdx));
    if (sheets > 0) p.set("sheets", String(sheets));
    if (!reserve) p.set("reserve", "0");
    const qs = p.toString();
    router.replace(sitePath(`/products/${id}${qs ? `?${qs}` : ""}`), { scroll: false });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formatIdx, thicknessIdx, sheets, reserve, showCalculator, id]);

  const format = formatIdx >= 0 ? formats[formatIdx] : null;
  const thickness = thicknessIdx >= 0 ? thicknesses[thicknessIdx] : null;
  const effectiveSheets = reserve ? Math.ceil(sheets * 1.1) : sheets;
  const area = format ? +(effectiveSheets * format.area).toFixed(2) : 0;
  const volume = format && thickness ? +(area * (thickness.mm / 1000)).toFixed(3) : 0;
  const weight = thickness ? +(volume * thickness.density).toFixed(1) : 0;
  const unitPrice = product?.price ?? null;
  const calculatorUnitPrice = unitPrice ?? PRICE_PER_SHEET;
  const total = (effectiveSheets * calculatorUnitPrice).toLocaleString("ru-RU");

  const canAddToCart = useMemo(
    () => format !== null && thickness !== null && effectiveSheets >= 1 && !cartMutating && !productLoading,
    [format, thickness, effectiveSheets, cartMutating, productLoading],
  );

  const canAddSimpleToCart = useMemo(
    () =>
      Number.isFinite(wooProductId) &&
      wooProductId > 0 &&
      !cartMutating &&
      !productLoading &&
      unitPrice !== null,
    [wooProductId, cartMutating, productLoading, unitPrice],
  );

  const galleryImages = product?.images ?? [];

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <CatalogSidebar
            mobileOpen={sidebarOpen}
            onMobileOpenChange={setSidebarOpen}
          />

          <div className={styles.content}>
            <div
              className={`${styles.productCard} ${
                !showCalculator ? styles.productCardPlain : ""
              }`}
            >
            <div className={styles.productTitle}>
              <div className={styles.productTitleText}>
                <h1 className={styles.productName}>
                  {productLoading ? "Загрузка…" : (product?.title ?? productError ?? "Товар")}
                </h1>
                {product?.meta ? (
                  <p className={styles.productSubtitle}>{product.meta}</p>
                ) : null}
              </div>
              <CatalogSidebarMobileButton onClick={() => setSidebarOpen(true)} />
            </div>

            <div
              className={`${styles.productSection} ${
                !showCalculator ? styles.productSectionPlain : ""
              }`}
            >
              <div
                className={`${styles.imagesColumn} ${
                  !showCalculator ? styles.imagesColumnPlain : ""
                }`}
              >
                <ProductGallery
                  images={galleryImages}
                  alt={product?.title ?? "Товар"}
                />
              </div>

              {showCalculator ? (
              /* Calculator */
              <div className={styles.calcColumn}>
                <div>
                  <label className={styles.fieldLabel}>Формат фанеры:</label>
                  <div className={styles.selectWrap}>
                    <select
                      className={`${styles.select} ${formatIdx === -1 ? styles.selectPlaceholder : styles.selectFilled}`}
                      value={formatIdx}
                      onChange={(e) => setFormatIdx(Number(e.target.value))}
                    >
                      <option value={-1} disabled>Нажмите для выбора</option>
                      {formats.map((f, i) => (
                        <option key={i} value={i}>{f.label}</option>
                      ))}
                    </select>
                    <ChevronDown className={styles.selectArrow} />
                  </div>
                </div>

                <div>
                  <label className={styles.fieldLabel}>Толщина листа:</label>
                  <div className={styles.selectWrap}>
                    <select
                      className={`${styles.select} ${thicknessIdx === -1 ? styles.selectPlaceholder : styles.selectFilled}`}
                      value={thicknessIdx}
                      onChange={(e) => setThicknessIdx(Number(e.target.value))}
                    >
                      <option value={-1} disabled>Нажмите для выбора</option>
                      {thicknesses.map((t, i) => (
                        <option key={i} value={i}>{t.label}</option>
                      ))}
                    </select>
                    <ChevronDown className={styles.selectArrow} />
                  </div>
                </div>

                <div className={styles.inputsRow}>
                  <div className={styles.inputGroup}>
                    <label className={styles.fieldLabel}>Листов (шт)</label>
                    <input
                      className={`${styles.input} ${styles.inputEditable}`}
                      type="number"
                      min={0}
                      value={sheets}
                      onChange={(e) => setSheets(Math.max(0, Number(e.target.value)))}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.fieldLabel}>Площадь (м²)</label>
                    <input className={styles.input} type="number" readOnly value={area} />
                  </div>
                </div>

                <div className={styles.inputsRow}>
                  <div className={styles.inputGroup}>
                    <label className={`${styles.fieldLabel} ${styles.fieldLabelGrey}`}>Объем (м³)</label>
                    <input className={styles.input} type="number" readOnly value={volume} />
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.fieldLabel}>Вес (кг)</label>
                    <input className={styles.input} type="number" readOnly value={weight} />
                  </div>
                </div>

                <label className={styles.checkboxRow}>
                  <input
                    type="checkbox"
                    className={styles.checkboxInput}
                    checked={reserve}
                    onChange={(e) => setReserve(e.target.checked)}
                  />
                  <span className={`${styles.checkboxBox} ${!reserve ? styles.checkboxBoxOff : ""}`}>
                    {reserve && <Checkmark />}
                  </span>
                  <span className={styles.checkboxLabel}>+ 10% запас для подрезки</span>
                </label>

                <div className={styles.infoRow}>
                  <span className={styles.infoText}>Наличие: Отгрузим в течении 3 дней</span>
                  <span className={styles.infoText}>Цена: {calculatorUnitPrice.toLocaleString("ru-RU")} ₽ за лист</span>
                </div>

                <div className={styles.totalRow}>
                  <span className={styles.totalText}>Итого: {total} ₽</span>
                  <div className={styles.orderActions}>
                    <Button
                      variant="green"
                      size="L"
                      type="button"
                      disabled={!canAddToCart}
                      onClick={() => {
                        if (!canAddToCart) return;
                        void addItem(wooProductId, Math.max(1, effectiveSheets));
                      }}
                    >
                      {cartMutating ? "Добавляем…" : "Добавить в заказ"}
                    </Button>
                    {effectiveSheets < 1 && !productLoading ? (
                      <span className={styles.orderHint}>Укажите число листов (от 1)</span>
                    ) : null}
                    {cartError ? (
                      <span className={styles.orderError} role="alert">{cartError}</span>
                    ) : null}
                    {productError ? (
                      <span className={styles.orderError} role="alert">{productError}</span>
                    ) : null}
                  </div>
                </div>
              </div>
              ) : (
                <ProductSimpleSummary
                  unitPrice={unitPrice}
                  loading={productLoading}
                  disabled={!canAddSimpleToCart}
                  mutating={cartMutating}
                  error={productError ?? cartError}
                  onAddToCart={() => {
                    if (!canAddSimpleToCart) return;
                    void addItem(wooProductId, 1);
                  }}
                />
              )}
            </div>
            </div>

            {/* Characteristics */}
            <div className={styles.characteristics}>
              <h2 className={styles.charTitle}>Характеристики товара</h2>
              {product?.description ? (
                <div
                  className={styles.charDescription}
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              ) : product?.meta ? (
                <p className={styles.charText}>{product.meta}</p>
              ) : null}
              {!product?.description && showCalculator ? (
              <>
              <p className={styles.charText}>
                Группа компаний «ФИНСТРОЙ» предлагает продукцию крупнейших деревообрабатывающих
                предприятий Скандинавии, Европы и России. У нас можно найти лучшие цены, выгодные
                условия розничной продажи и оптовых поставок.
              </p>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th rowSpan={2}>Толщина фанеры<br />(номинальная)</th>
                      <th rowSpan={2}>Слойность фанеры<br />(не менее)</th>
                      <th colSpan={2}>Шлифованная фанера</th>
                      <th colSpan={2}>Нешлифованная фанера</th>
                    </tr>
                    <tr>
                      <th>Пред. отклонение</th>
                      <th>Разнотолщинность</th>
                      <th>Пред. отклонение</th>
                      <th>Разнотолщинность</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.map((row, i) => (
                      <tr key={i}>
                        <td>{row.t}</td><td>{row.l}</td>
                        <td>{row.so}</td><td>{row.sr}</td>
                        <td>{row.no_}</td><td>{row.nr}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              </>
              ) : null}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
