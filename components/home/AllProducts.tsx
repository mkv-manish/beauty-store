"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import ProductCard from "@/components/ProductCard";

type Product = {
    _id: string;
    name: string;
    price: number;
    category: "skin" | "hair";
    image: string;
    description: string;
    ingredients: string;
    howToUse: string;
    stock: number;
};

export default function AllProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchProducts() {
            try {
                setLoading(true);
                setError("");

                const response = await fetch("/api/products");

                if (!response.ok) {
                    throw new Error("Unable to load products.");
                }

                const data = await response.json();

                if (!Array.isArray(data)) {
                    throw new Error("Invalid product data.");
                }

                setProducts(data);
            } catch {
                setError(
                    "Products load nahi ho paaye. Please refresh karke try karein.",
                );
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    return (
        <section
            id="all-products"
            className="bg-[#FBF8F3] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
        >
            <div className="mx-auto max-w-7xl">
                <div className="mb-7 flex items-end justify-between gap-3 sm:mb-9">
                    <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#7B8A74] sm:text-sm">
                            Find your favourites
                        </p>

                        <h2 className="text-2xl font-semibold tracking-tight text-[#26352B] sm:text-3xl lg:text-4xl">
                            All Products
                        </h2>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-[#687169] sm:text-base">
                            Everyday essentials for your skin and hair care
                            routine.
                        </p>
                    </div>

                    <Link
                        href="/shop"
                        className="mb-1 inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[#52634F] transition hover:text-[#26352B]"
                    >
                        <span className="hidden sm:inline">View all</span>
                        <FiArrowRight size={18} />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <div
                                key={index}
                                className="animate-pulse overflow-hidden rounded-2xl border border-[#E7E2DA] bg-white"
                            >
                                <div className="aspect-square bg-[#EDE9E1]" />
                                <div className="space-y-3 p-3 sm:p-4">
                                    <div className="h-4 rounded bg-[#EDE9E1]" />
                                    <div className="h-4 w-1/3 rounded bg-[#EDE9E1]" />
                                    <div className="h-9 rounded-full bg-[#EDE9E1]" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="rounded-2xl border border-[#E7E2DA] bg-white px-5 py-10 text-center">
                        <p className="text-sm text-[#687169]">{error}</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="rounded-2xl border border-[#E7E2DA] bg-white px-5 py-10 text-center">
                        <p className="font-medium text-[#26352B]">
                            No products available yet.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
