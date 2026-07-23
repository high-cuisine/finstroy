"use client";

import Header from "@/app/shared/componets/layout/Header/Header";
import Footer from "@/app/shared/componets/layout/Footer/Footer";
import { useProductPage } from "./hooks/useProductPage";
import { ProductGallery } from "./components/ProductGallery/ProductGallery";
import { ProductSimpleSummary } from "./components/ProductSimpleSummary/ProductSimpleSummary";
import {
  CatalogSidebar,
  CatalogSidebarMobileButton,
} from "./components/CatalogSidebar/CatalogSidebar";
import ProductCalculator from "./components/ProductCalculator/ProductCalculator";
import ProductCharacteristics from "./components/ProductCharacteristics/ProductCharacteristics";
import styles from "./products.module.scss";

export default function ProductsPage() {
  const p = useProductPage();

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <CatalogSidebar
            mobileOpen={p.sidebarOpen}
            onMobileOpenChange={p.setSidebarOpen}
          />

          <div className={styles.content}>
            <div className={`${styles.productCard} ${!p.showCalculator ? styles.productCardPlain : ""}`}>
              <div className={styles.productTitle}>
                <div className={styles.productTitleText}>
                  <h1 className={styles.productName}>
                    {p.selectedProduct?.title ?? p.selectedCategory}
                  </h1>
                  {p.selectedProduct?.meta ? (
                    <p className={styles.productSubtitle}>{p.selectedProduct.meta}</p>
                  ) : p.showCalculator ? (
                    <p className={styles.productSubtitle}>Фанера карбамидоформальдегидная</p>
                  ) : null}
                </div>
                <CatalogSidebarMobileButton onClick={() => p.setSidebarOpen(true)} />
              </div>

              <div className={`${styles.productSection} ${!p.showCalculator ? styles.productSectionPlain : ""}`}>
                <div className={`${styles.imagesColumn} ${!p.showCalculator ? styles.imagesColumnPlain : ""}`}>
                  <ProductGallery
                    images={p.galleryImages}
                    alt={p.selectedProduct?.title ?? p.selectedCategory}
                  />
                </div>

                {p.showCalculator ? (
                  <ProductCalculator
                    formats={p.formats}
                    thicknesses={p.thicknesses}
                    formatIdx={p.formatIdx}
                    setFormatIdx={p.setFormatIdx}
                    thicknessIdx={p.thicknessIdx}
                    setThicknessIdx={p.setThicknessIdx}
                    sheets={p.sheets}
                    setSheets={p.setSheets}
                    reserve={p.reserve}
                    setReserve={p.setReserve}
                    area={p.area}
                    volume={p.volume}
                    weight={p.weight}
                    total={p.total}
                    effectiveSheets={p.effectiveSheets}
                    calculatorUnitPrice={p.calculatorUnitPrice}
                    canAddToCart={p.canAddToCart}
                    cartMutating={p.cartMutating}
                    productIdLoading={p.productIdLoading}
                    productIdError={p.productIdError}
                    cartError={p.cartError}
                    onAddToCart={p.addToCart}
                  />
                ) : (
                  <ProductSimpleSummary
                    unitPrice={p.unitPrice}
                    loading={p.productIdLoading}
                    disabled={!p.canAddSimpleToCart}
                    mutating={p.cartMutating}
                    error={p.productIdError ?? p.cartError}
                    onAddToCart={p.addSimpleToCart}
                  />
                )}
              </div>
            </div>

            <ProductCharacteristics
              description={p.selectedProduct?.description}
              showCalculator={p.showCalculator}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
