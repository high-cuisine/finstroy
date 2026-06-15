"use client";

import { Suspense, type ReactNode } from "react";
import { CatalogMenuOverlay } from "@/app/features/catalogMenu";
import { useLoadCatalogCategories } from "@/app/features/catalogCategories";
import { CartSync } from "@/app/features/cart";
import MobileBottomNav from "@/app/shared/components/MobileBottomNav/MobileBottomNav";
import styles from "./AppShell.module.scss";

function CatalogCategoriesLoader() {
  useLoadCatalogCategories();
  return null;
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <CartSync />
      <Suspense fallback={null}>
        <CatalogCategoriesLoader />
      </Suspense>
      <div className={styles.appFrame}>{children}</div>
      <CatalogMenuOverlay />
      <Suspense fallback={null}>
        <MobileBottomNav />
      </Suspense>
    </>
  );
}

