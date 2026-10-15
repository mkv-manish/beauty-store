"use client";
import { useMemo, useSyncExternalStore } from "react";
const key = "dermisca-wishlist";
let fallback = "[]";
const listeners = new Set<() => void>();
function snapshot() { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } }
function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => { listeners.delete(callback); window.removeEventListener("storage", callback); };
}
export function useWishlist() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => "[]");
  const ids = useMemo<string[]>(() => {
    try { const value = JSON.parse(raw); return Array.isArray(value) ? [...new Set(value.filter((id): id is string => typeof id === "string" && /^[a-f0-9]{24}$/i.test(id)))] : []; } catch { return []; }
  }, [raw]);
  function toggle(id: string) {
    let current: string[] = ids;
    try { const value = JSON.parse(snapshot()); if (Array.isArray(value)) current = value.filter((value): value is string => typeof value === "string"); } catch { /* Replace malformed storage. */ }
    const next = current.includes(id) ? current.filter(value => value !== id) : [...current, id];
    fallback = JSON.stringify(next);
    try { localStorage.setItem(key, fallback); } catch { /* Remains available for this session. */ }
    listeners.forEach(listener => listener());
  }
  return { ids, toggle };
}
