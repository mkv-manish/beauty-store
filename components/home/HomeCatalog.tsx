"use client";
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
    fetch("/api/products?limit=8&home=true", { signal: controller.signal }).then(async response => {
      if (!response.ok) throw new Error();
      setData(await response.json());
    }).catch(error => { if (error.name !== "AbortError") setError(true); });
    return () => controller.abort();
  }, []);
  if (error) return <section className="section-shell text-center"><h2 className="section-title">Our collection</h2><p className="mt-4">We couldn’t load the collection.</p><button className="secondary-link mt-5" onClick={() => window.location.reload()}>Try again</button></section>;
  if (!data) return <section className="section-shell" aria-label="Loading collection" aria-busy="true"><div className="product-grid">{Array.from({ length: 4 }, (_, i) => <div key={i} className="aspect-[3/4] animate-pulse rounded-3xl bg-[#EDE8E0]" />)}</div></section>;
  return <>{([    { title: "Best sellers", label: "Customer favourites", products: data.bestSellers.slice(0, 4) },
    { title: "Your everyday essentials", label: "Skin & hair care", products: data.products },
  ]).map(section => <section key={section.label} className="section-shell">
    <div className="mb-7 flex flex-wrap items-end justify-between gap-5"><div><p className="eyebrow">{section.label}</p><h2 className="section-title mt-3">{section.title}</h2></div><Link href="/shop" className="inline-flex min-h-11 items-center gap-2 border-b border-[#26352B] text-sm font-semibold">Shop all essentials <FiArrowUpRight /></Link></div>
    {section.products.length ? <div className={`product-grid ${section.title === "Best sellers" ? "bestseller-grid" : ""}`}>{section.products.map(product => <ProductCard key={product._id} product={product} />)}</div> : <div className="rounded-3xl border border-[#E7E2DA] bg-white p-10 text-center">{section.title === "Best sellers" ? "No best sellers yet. Explore our everyday essentials below." : "Our collection is coming soon. Please check back shortly."}</div>}
  </section>)}<CouponBanner offers={data.offers ?? []} /></>;
}
