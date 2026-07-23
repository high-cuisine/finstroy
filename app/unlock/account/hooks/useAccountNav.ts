"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useUserStore } from "@/app/features/user";
import { isTab, type Tab } from "../data/accountData";

export function useAccountNav() {
  const token = useUserStore((s) => s.token);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>("profile");

  useEffect(() => {
    const q = searchParams.get("tab");
    if (isTab(q)) setTab(q);
  }, [searchParams]);

  const goTab = useCallback(
    (next: Tab, onAuthRequired?: () => void) => {
      if (!token) {
        onAuthRequired?.();
        return;
      }
      setTab(next);
      router.replace(`${pathname}?tab=${next}`, { scroll: false });
    },
    [pathname, router, token],
  );

  return { tab, goTab };
}
