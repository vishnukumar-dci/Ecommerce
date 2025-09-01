"use client";
export function setAuthCookie(data: any) {
  // on the client, we can't set httpOnly, use document.cookie for demo
  const expires = new Date(Date.now() + 60 * 60 * 1000).toUTCString(); // 1 hour
  // include SameSite for safer behavior; Secure is omitted for localhost
  document.cookie = `auth=${encodeURIComponent(JSON.stringify(data))}; path=/; expires=${expires}; SameSite=Lax`;
}
export function clearAuthCookie() {
  document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}
