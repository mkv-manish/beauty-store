"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FiHeart } from "react-icons/fi";
import { useWishlist } from "@/lib/wishlist";
import type { ProductData } from "@/types/product";
import ProductCard from "@/components/products/ProductCard";
export default function WishlistPage() {
  const { ids, toggle } = useWishlist();
  const key = ids.join(",");
  const [result, setResult] = useState<{ key: string; products: ProductData[]; error?: string } | null>(null);
  useEffect(() => {
    if (!key) return;
    const controller = new AbortController();
    async function load() {
      try {
        const all = key.split(",");
        const batches = await Promise.all(Array.from({ length: Math.ceil(all.length / 48) }, async (_, index) => {
          const response = await fetch(`/api/products?limit=48&ids=${all.slice(index * 48, (index + 1) * 48).join(",")}`, { signal: controller.signal });
          if (!response.ok) throw new Error("Unable to load your wishlist.");
          return (await response.json()).products as ProductData[];
        }));
        setResult({ key, products: batches.flat() });
      } catch (error) { if (!controller.signal.aborted) setResult({ key, products: [], error: error instanceof Error ? error.message : "Unable to load wishlist." }); }
    }
    load(); return () => controller.abort();
  }, [key]);
  const missing = result?.key === key ? ids.filter(id => !result.products.some(product => product._id === id)) : [];
  return <main className="section-shell min-h-[65vh]"><p className="eyebrow">Saved for a little later</p><h1 className="section-title mt-3">Your wishlist</h1><p className="mb-8 mt-3 text-sm text-[#687169]">Your favourites, all in one place. Saved on this device.</p>
    {!ids.length ? <div className="empty-panel"><FiHeart className="mx-auto mb-4" size={32} /><h2 className="text-xl">A little room for your favourites</h2><p className="mt-3 text-sm text-[#687169]">Tap the heart on any product to save it here.</p><Link className="primary-link mt-6" href="/shop">Discover products</Link></div> : result?.key !== key ? <div className="product-grid" aria-busy="true" aria-label="Loading wishlist">{ids.slice(0, 4).map(id => <div key={id} className="aspect-square animate-pulse rounded-2xl bg-[#EDE8E0]" />)}</div> : result.error ? <div className="empty-panel" role="alert">{result.error}<button className="secondary-link mt-4" onClick={() => window.location.reload()}>Try again</button></div> : <><div className="product-grid">{result.products.map(product => <ProductCard key={product._id} product={product} />)}</div>{missing.length > 0 && <div className="mt-6 rounded-2xl border p-5"><p className="mb-3 text-sm">{missing.length} saved product(s) are no longer available.</p><button className="secondary-link" onClick={() => missing.forEach(toggle)}>Remove unavailable products</button></div>}</>}
  </main>;
}
