"use client";
import { useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { makeStore, type RootState } from "@/store/store";
import { setCart } from "@/store/cartSlice";
const CART_STORAGE_KEY = "dermisca-cart";
function CartPersistence({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const { items, hydrated } = useSelector((state: RootState) => state.cart);
  useEffect(() => {
    let saved = [];
    try {
      const parsed = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? "[]");
      if (Array.isArray(parsed)) saved = parsed;
    } catch { /* Corrupt or unavailable storage starts with an empty cart. */ }
    dispatch(setCart(saved));
  }, [dispatch]);
  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items)); } catch { /* Cart remains usable when storage is disabled. */ }
  }, [items, hydrated]);
  return children;
}
export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(makeStore);
  return <Provider store={store}><CartPersistence>{children}</CartPersistence></Provider>;
}
