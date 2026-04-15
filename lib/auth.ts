/**
 * Authentication utilities for managing tokens in cookies.
 * This allows the Middleware to access tokens for route protection.
 */

const TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export const setAuthTokens = (access: string, refresh: string) => {
  if (typeof document === "undefined") return;

  // Set access token (expiring soonish, e.g., 1 day)
  document.cookie = `${TOKEN_KEY}=${access}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`;
  // Set refresh token (expiring later, e.g., 7 days)
  document.cookie = `${REFRESH_TOKEN_KEY}=${refresh}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
};

export const getAuthToken = (): string | null => {
  if (typeof document === "undefined") return null;
  
  const matches = document.cookie.match(new RegExp("(^| )" + TOKEN_KEY + "=([^;]+)"));
  return matches ? matches[2] : null;
};

export const clearAuthTokens = () => {
  if (typeof document === "undefined") return;
  
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
  document.cookie = `${REFRESH_TOKEN_KEY}=; path=/; max-age=0`;
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
