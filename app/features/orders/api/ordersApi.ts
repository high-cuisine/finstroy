import { WP_JSON_FETCH_BASE } from "@/app/features/wp/api/config";
import { authFetch } from "@/app/features/user/api/authFetch";
import { fetchWpCurrentUser } from "@/app/features/user/api/wpUserMe";

const WC_V3 = `${WP_JSON_FETCH_BASE}/wc/v3`;

export type WcOrderLineItem = {
  id?: number;
  name?: string;
  quantity?: number;
};

export type WcOrderJson = {
  id?: number;
  number?: string;
  status?: string;
  date_created?: string;
  total?: string;
  currency_symbol?: string;
  line_items?: WcOrderLineItem[];
  [key: string]: unknown;
};

function ordersListQuery(customer: string): string {
  return new URLSearchParams({
    per_page: "50",
    status: "any",
    customer,
  }).toString();
}

/** Параметры списка для `GET /wc/v3/orders/me`. */
function ordersMeQuery(): string {
  return new URLSearchParams({
    per_page: "50",
    status: "any",
  }).toString();
}

/**
 * GET `/wc/v3/orders/me` (как upstream `…/wp-json/wc/v3/orders/me`, через прокси тот же путь).
 * При ошибке — повтор с `GET /wc/v3/orders?customer=<id>` из `/wp/v2/users/me`.
 */
export async function fetchMyOrders(): Promise<Response> {
  const first = await authFetch(`${WC_V3}/orders/me?${ordersMeQuery()}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "include",
  });
  if (first.ok) return first;

  const user = await fetchWpCurrentUser();
  const uid = user?.id;
  if (typeof uid !== "number") return first;

  return authFetch(
    `${WC_V3}/orders?${ordersListQuery(String(uid))}`,
    {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    },
  );
}

/** GET `/wc/v3/orders/{id}` */
export async function fetchWcOrder(orderId: number): Promise<Response> {
  return authFetch(`${WC_V3}/orders/${orderId}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "include",
  });
}

export function normalizeWcOrderList(json: unknown): WcOrderJson[] {
  if (!Array.isArray(json)) return [];
  return json.filter((x) => x && typeof x === "object") as WcOrderJson[];
}

export function formatOrderDate(iso: string | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const STATUS_LABEL: Record<string, string> = {
  pending: "В ожидании",
  processing: "В обработке",
  "on-hold": "На удержании",
  completed: "Выполнен",
  cancelled: "Отменён",
  refunded: "Возврат",
  failed: "Ошибка",
};

export function formatOrderStatus(status: string | undefined): string {
  if (!status) return "—";
  return STATUS_LABEL[status] ?? status;
}
