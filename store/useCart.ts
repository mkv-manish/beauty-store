"use client";
import { useSyncExternalStore } from "react";
import { useStore } from "react-redux";
import type { AppStore } from "./store";
import { initialCartState } from "./cartSlice";
export function useCart() {
  const store = useStore.withTypes<AppStore>()();
  // Each boundary must hydrate against the server snapshot, even if the parent
  // restored localStorage before this streamed page or card became interactive.
  return useSyncExternalStore(store.subscribe, () => store.getState().cart, () => initialCartState);
}
