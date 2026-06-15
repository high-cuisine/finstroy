export type JwtTokenResponse = {
  token: string;
  user_email?: string;
  user_nicename?: string;
  user_display_name?: string;
  refresh_token?: string;
  [key: string]: unknown;
};

export type JwtValidateResponse = {
  code?: string;
  data?: unknown;
  message?: string;
  [key: string]: unknown;
};

export type WpRestCurrentUser = {
  id?: number;
  name?: string;
  slug?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  meta?: Record<string, unknown>;
  [key: string]: unknown;
};
