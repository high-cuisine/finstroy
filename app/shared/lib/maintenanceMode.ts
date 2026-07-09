/** Internal Next.js route prefix — pages always live under /unlock in the filesystem. */
export const PHYSICAL_PREFIX = "/unlock";

function parseMaintenanceFlag(
  value: string | undefined,
  defaultValue: boolean,
): boolean {
  if (
    value === undefined ||
    value === "" ||
    value === "__NEXT_PUBLIC_SITE_MAINTENANCE__"
  ) {
    return defaultValue;
  }
  return value === "true";
}

/**
 * Maintenance stub enabled (server / middleware).
 * Default: true — visitors see the «technical works» page at /.
 */
export function isMaintenanceModeServer(): boolean {
  return parseMaintenanceFlag(
    process.env.SITE_MAINTENANCE ?? process.env.NEXT_PUBLIC_SITE_MAINTENANCE,
    true,
  );
}

/**
 * Maintenance stub enabled (client bundles).
 * Default: true when unset.
 */
export function isMaintenanceModePublic(): boolean {
  return parseMaintenanceFlag(process.env.NEXT_PUBLIC_SITE_MAINTENANCE, true);
}

/** Public URL prefix: /unlock in maintenance mode, empty when the site is live. */
export function getSiteBase(): string {
  return isMaintenanceModePublic() ? PHYSICAL_PREFIX : "";
}
