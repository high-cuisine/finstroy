import { getSiteBase, PHYSICAL_PREFIX } from "@/app/shared/lib/maintenanceMode";

/** @deprecated Prefer getSiteBase() — kept for unlock-gate login redirects. */
export const UNLOCK_BASE = PHYSICAL_PREFIX;

export function sitePath(path = "/"): string {
  const base = getSiteBase();
  if (path === "/") return base || "/";
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

export function stripUnlockBase(pathname: string): string {
  if (pathname === PHYSICAL_PREFIX) return "/";
  if (pathname.startsWith(`${PHYSICAL_PREFIX}/`)) {
    return pathname.slice(PHYSICAL_PREFIX.length);
  }
  return pathname;
}

export function isHomePath(pathname: string): boolean {
  return stripUnlockBase(pathname) === "/";
}
