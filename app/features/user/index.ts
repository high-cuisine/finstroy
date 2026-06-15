export { AuthModal } from "./components/AuthModal";

export { useUserStore } from "./store/useUserStore";
export type { UserPersistSlice } from "./store/useUserStore";

export { jwtLogin, jwtValidate } from "./api/jwtAuth";
export { authFetch } from "./api/authFetch";
export { registerHeadlessUser } from "./api/register";
export type { HeadlessRegisterPayload } from "./api/register";
export { fetchWpCurrentUser } from "./api/wpUserMe";
export { refreshUserProfile } from "./api/refreshProfile";

export type { JwtTokenResponse, JwtValidateResponse, WpRestCurrentUser } from "./api/types";
