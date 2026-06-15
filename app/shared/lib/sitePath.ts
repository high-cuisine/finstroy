export const UNLOCK_BASE = "/unlock";

export function sitePath(path = "/"): string {
  if (path === "/") return UNLOCK_BASE;
  return `${UNLOCK_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

export function stripUnlockBase(pathname: string): string {
  if (pathname === UNLOCK_BASE) return "/";
  if (pathname.startsWith(`${UNLOCK_BASE}/`)) {
    return pathname.slice(UNLOCK_BASE.length);
  }
  return pathname;
}
