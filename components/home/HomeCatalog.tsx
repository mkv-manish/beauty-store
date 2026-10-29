"use client";
import ErrorNotice from "@/components/ui/ErrorNotice";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import type { Offer } from "@/types/discount";
import CouponBanner from "@/components/home/CouponBanner";
import ProductCard from "@/components/products/ProductCard";
import type { ProductData } from "@/types/product";
type Catalog = { products: ProductData[]; bestSellers: ProductData[]; offers?: Offer[] };
export default function HomeCatalog() {
  const [data, setData] = useState<Catalog | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/products?limit=12&home=true", { signal: controller.signal }).then(async response => {
      if (!response.ok) throw new Error();
      setData(await response.json());
    }).catch(error => { if (error.name !== "AbortError") setError(true); });
    return () => controller.abort();
  }, []);
  if (error) return <section className="section-shell"><ErrorNotice title="Collection couldn’t load" action={<button type="button" onClick={() => window.location.reload()}>Try again</button>}>Please check your connection and try again.</ErrorNotice></section>;
  if (!data) return <section className="section-shell" aria-label="Loading collection" aria-busy="true"><div className="product-grid">{Array.from({ length: 4 }, (_, i) => <div key={i} className="aspect-[3/4] animate-pulse rounded-3xl bg-[#D3E9E5]" />)}</div></section>;
  if (!data.products.length && !data.bestSellers.length) return <section className="section-shell"><div className="empty-panel"><h2 className="section-title">Our collection is coming soon</h2><p className="mt-3 text-sm text-[#617B78]">Check back shortly for skin and hair care.</p></div></section>;
  return <>{([    { title: "Best sellers", label: "Customer favourites", products: data.bestSellers.slice(0, 4) },
    { title: "Discover the collection", label: "Skin & hair care", products: data.products.filter(product => !data.bestSellers.slice(0, 4).some(best => best._id === product._id)).slice(0, 8) },
  ]).filter(section => section.products.length > 0).map(section => <section key={section.label} className="section-shell catalog-section">
    <div className="mb-7 flex flex-wrap items-end justify-between gap-5"><div><h2 className="section-title">{section.title}</h2></div><Link href="/shop" className="inline-flex min-h-11 items-center gap-2 border-b border-[#203C3B] text-sm font-semibold">View all <FiArrowUpRight /></Link></div>
    {section.products.length ? <div className={`product-grid ${section.title === "Best sellers" ? "bestseller-grid" : ""}`}>{section.products.map(product => <ProductCard key={product._id} product={product} />)}</div> : <div className="rounded-3xl border border-[#D9E7E3] bg-white p-10 text-center">{section.title === "Best sellers" ? "No best sellers yet. Explore our everyday essentials below." : "Our collection is coming soon. Please check back shortly."}</div>}
  </section>)}<CouponBanner offers={data.offers ?? []} /></>;
}
