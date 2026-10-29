"use client";
import { Suspense, useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiSearch, FiX } from "react-icons/fi";
function SyncedSearch() {
  const router = useRouter();
  const params = useSearchParams();
  const query = params.toString();
  const urlSearch = params.get("search") ?? "";
  const [value, setValue] = useState(urlSearch);
  const [previousSearch, setPreviousSearch] = useState(urlSearch);
  const [focused, setFocused] = useState(false);
  const [editing, setEditing] = useState(false);
  const [composing, setComposing] = useState(false);
  const [pending, startTransition] = useTransition();
  const input = useRef<HTMLInputElement>(null);
  // Keep back/forward navigation in sync without remounting the focused input.
  if (previousSearch !== urlSearch) {
    setPreviousSearch(urlSearch);
    if (!focused) { setValue(urlSearch); setEditing(false); }
  }
  function navigate() {
    const next = new URLSearchParams(query);
    next.delete("page");
    if (value.trim()) next.set("search", value.trim()); else next.delete("search");
    startTransition(() => router.replace(`/shop?${next}`, { scroll: false }));
  }
  useEffect(() => {
    if (!editing || composing || value.trim() === urlSearch) return;
    const timer = window.setTimeout(() => {
      const next = new URLSearchParams(query);
      next.delete("page");
      if (value.trim()) next.set("search", value.trim()); else next.delete("search");
      startTransition(() => router.replace(`/shop?${next}`, { scroll: false }));
    }, 400);
    return () => window.clearTimeout(timer);
  }, [value, urlSearch, query, editing, composing, router]);
  function submit(event: FormEvent) { event.preventDefault(); if (!composing) navigate(); }
  return <form role="search" aria-label="Product search" aria-busy={pending} className="store-search" onSubmit={submit}>
    <FiSearch size={20} aria-hidden="true" className={`shrink-0 text-[#617B78] ${pending ? "animate-pulse" : ""}`} />
    <input ref={input} aria-label="Search products" type="search" name="search" maxLength={100} value={value} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} onCompositionStart={() => setComposing(true)} onCompositionEnd={() => setComposing(false)} onChange={event => { setValue(event.target.value); setEditing(true); }} placeholder="Search skin & hair care" autoComplete="off" className="store-search-input" />
    {value && <button type="button" aria-label="Clear search" className="search-clear" onClick={() => { setValue(""); setEditing(true); input.current?.focus(); }}><FiX size={17} /></button>}
  </form>;
}
export default function SearchBar() { return <Suspense fallback={<div className="h-12 animate-pulse rounded-xl bg-[#EFF7F5]" />}><SyncedSearch /></Suspense>; }
