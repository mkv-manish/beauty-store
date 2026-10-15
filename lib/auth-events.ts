"use client";
export type SessionUser = { id: string; name: string; email: string; phone?: string };
export function notifyAuthChange(user: SessionUser | null) {
  if (!user) { try { sessionStorage.removeItem("pending-order"); } catch { /* Storage may be unavailable. */ } }
  window.dispatchEvent(new CustomEvent("auth-change", { detail: { user } }));
  try { localStorage.setItem("dermisca-auth-event", crypto.randomUUID()); } catch { /* Same-tab session updates still work without storage. */ }
}
export function clearLegacyAuth() {
  try { localStorage.removeItem("token"); localStorage.removeItem("user"); } catch { /* Cookies do not depend on localStorage. */ }
}
