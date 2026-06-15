import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { JwtTokenResponse } from "../api/types";

export type UserPersistSlice = {
  token: string | null;
  userId: number | null;
  email: string | null;
  displayName: string | null;
  slug: string | null;
};

function parseHeadlessRegisterToken(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  if (typeof b.token === "string") return b.token;
  const tr = b.token_response;
  if (tr && typeof tr === "object" && tr !== null && "token" in tr) {
    const t = (tr as { token?: unknown }).token;
    if (typeof t === "string") return t;
  }
  return null;
}

type UserActions = {
  applyJwtLogin: (r: JwtTokenResponse) => void;
  applyHeadlessRegister: (body: unknown) => void;
  patchProfile: (p: Partial<UserPersistSlice>) => void;
  logout: () => void;
};

const empty: UserPersistSlice = {
  token: null,
  userId: null,
  email: null,
  displayName: null,
  slug: null,
};

export const useUserStore = create<UserPersistSlice & UserActions>()(
  persist(
    (set) => ({
      ...empty,

      applyJwtLogin: (r) =>
        set({
          token: typeof r.token === "string" ? r.token : null,
          email: typeof r.user_email === "string" ? r.user_email : null,
          displayName:
            typeof r.user_display_name === "string" ? r.user_display_name : null,
          slug: typeof r.user_nicename === "string" ? r.user_nicename : null,
        }),

      applyHeadlessRegister: (body) => {
        const token = parseHeadlessRegisterToken(body);
        if (!token) return;
        const upd: Partial<UserPersistSlice> = { token };
        if (body && typeof body === "object" && body !== null && "id" in body) {
          const id = (body as { id?: unknown }).id;
          if (typeof id === "number") upd.userId = id;
        }
        set(upd);
      },

      patchProfile: (p) => set((s) => ({ ...s, ...p })),

      logout: () => set({ ...empty }),
    }),
    {
      name: "finstroy.user.v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        token: s.token,
        userId: s.userId,
        email: s.email,
        displayName: s.displayName,
        slug: s.slug,
      }),
    },
  ),
);
