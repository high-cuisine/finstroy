import { fetchWpCurrentUser } from "./wpUserMe";
import { useUserStore } from "../store/useUserStore";

/** Подтягивает `/wp/v2/users/me` и обновляет поля в сторе. */
export async function refreshUserProfile(): Promise<void> {
  if (!useUserStore.getState().token) return;

  const me = await fetchWpCurrentUser();
  if (!me) return;

  useUserStore.getState().patchProfile({
    userId: typeof me.id === "number" ? me.id : null,
    email: typeof me.email === "string" ? me.email : null,
    displayName: typeof me.name === "string" ? me.name : null,
    slug: typeof me.slug === "string" ? me.slug : null,
  });
}
