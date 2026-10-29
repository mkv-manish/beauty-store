"use client";
import ErrorNotice from "@/components/ui/ErrorNotice";
import { categories } from "@/config/categories";
import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiArrowRight, FiSearch } from "react-icons/fi";
import ProductCard from "@/components/products/ProductCard";
import type { ProductData } from "@/types/product";
type Catalog = { products: ProductData[]; total: number; pages: number };
export default function ShopContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const queryString = params.toString();
  const [data, setData] = useState<Catalog | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const search = params.get("search") ?? "";
  const category = params.get("category") ?? "all";
  const page = Math.max(1, Number(params.get("page")) || 1);
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true); setError("");
      try {
        const response = await fetch(`/api/products?${queryString}`, { signal: controller.signal });
        if (!response.ok) throw new Error("Unable to load products. Please try again.");
        setData(await response.json());
      } catch (error) { if (!controller.signal.aborted) setError(error instanceof Error ? error.message : "Unable to load products."); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    }
    load(); return () => controller.abort();
  }, [queryString]);
  function update(key: string, value: string) {
    const next = new URLSearchParams(queryString);
    if (value && value !== "all") next.set(key, value); else next.delete(key);
    if (key !== "page") next.delete("page");
    startTransition(() => router.push(`/shop?${next}`));
  }
  return <main className="min-h-screen">
    <h1 className="sr-only">{search ? `Results for “${search}”` : categories.find(item => item.id === category)?.label ?? "Shop all products"}</h1>
    <section className="section-shell shop-catalog">
      {search && <p className="search-results-heading">Results for “{search}”</p>}
      <div className="catalog-meta">
        <p className="catalog-count text-xs text-[#617B78]" aria-live="polite">{loading ? "Loading products…" : `${data?.total ?? 0} products`}</p>
        <label className="catalog-sort">Sort<select disabled={isPending} aria-label="Sort products" value={params.get("sort") ?? "newest"} onChange={event => update("sort", event.target.value)} className="min-h-11 rounded-xl border border-[#D9E7E3] bg-white px-3 text-[#203C3B]"><option value="newest">Newest first</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select></label>
      </div>
      {loading ? <div className="product-grid" aria-busy="true">{Array.from({ length: 8 }, (_, i) => <div key={i} className="aspect-[3/4] animate-pulse rounded-3xl bg-[#D3E9E5]" />)}</div> : error ? <ErrorNotice title="Products couldn’t load" action={<button type="button" onClick={() => window.location.reload()}>Try again</button>}>{error}</ErrorNotice> : !data?.products.length ? <div className="empty-panel"><FiSearch size={30} className="mx-auto mb-5" /><h2 className="text-2xl font-semibold">No essentials found</h2><p className="mt-3 text-sm text-[#617B78]">Try another search or explore the full collection.</p><Link href="/shop" className="primary-link mt-6">Explore all essentials</Link></div> : <>
        <div className="product-grid">{data.products.map(product => <ProductCard key={product._id} product={product} />)}</div>
        {data.pages > 1 && <nav aria-label="Catalog pages" className="mt-10 flex items-center justify-center gap-5"><button className="filter-pill" disabled={isPending || page <= 1} onClick={() => update("page", String(page - 1))}><FiArrowLeft /> Previous</button><span className="text-sm">{page} / {data.pages}</span><button className="filter-pill" disabled={isPending || page >= data.pages} onClick={() => update("page", String(page + 1))}>Next <FiArrowRight /></button></nav>}
      </>}
    </section>
  </main>;
}
