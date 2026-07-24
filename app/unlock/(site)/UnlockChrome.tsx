"use client";

import { usePathname } from "next/navigation";
import { AppShell } from "@/app/shared/components/AppShell/AppShell";
import { UNLOCK_BASE } from "@/app/shared/lib/sitePath";

const LOGIN_PATH = `${UNLOCK_BASE}/login`;

export function UnlockChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === LOGIN_PATH || pathname.startsWith(`${LOGIN_PATH}/`)) {
    return children;
  }

  return <AppShell>{children}</AppShell>;
}
