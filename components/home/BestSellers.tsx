"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { FiArrowRight } from "react-icons/fi";
import ProductCard from "@/components/ProductCard";

type Product = {
    _id: string;
    name: string;
    price: number;
    category: string;
    image: string;
    stock: number;
};

export default function BestSellers() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function getProducts() {
            try {
                setLoading(true);
                setError("");

                const response = await fetch("/api/products");

                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }

                const data = await response.json();

                setProducts(data.slice(0, 4));
            } catch {
                setError("Unable to load products.");
            } finally {
                setLoading(false);
            }
        }

        getProducts();
    }, []);

    return (
        <section className="bg-[#FBF8F3] px-4 py-14 sm:px-6 sm:py-20">
            <div className="mx-auto max-w-7xl">
                {/* Heading */}
                <div className="flex items-end justify-between gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45 }}
                    >
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7B8A74]">
                            Customer favourites
                        </p>

                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#26352B] sm:text-4xl">
                            Best Sellers
                        </h2>
                    </motion.div>

                    <Link
                        href="/shop"
                        className="hidden items-center gap-2 text-sm font-semibold text-[#7B8A74] transition-colors hover:text-[#26352B] sm:flex"
                    >
                        View All
                        <FiArrowRight size={16} />
                    </Link>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="overflow-hidden rounded-2xl border border-[#E7E2DA] bg-white"
                            >
                                <div className="aspect-square animate-pulse bg-[#EDE8E0]" />

                                <div className="space-y-3 p-4">
                                    <div className="h-3 w-20 animate-pulse rounded bg-[#EDE8E0]" />
                                    <div className="h-5 w-3/4 animate-pulse rounded bg-[#EDE8E0]" />
                                    <div className="h-5 w-16 animate-pulse rounded bg-[#EDE8E0]" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="mt-8 rounded-2xl border border-[#E7E2DA] bg-white px-6 py-10 text-center">
                        <p className="text-sm text-red-500">{error}</p>
                    </div>
                )}

                {/* Empty */}
                {!loading && !error && products.length === 0 && (
                    <div className="mt-8 rounded-2xl border border-[#E7E2DA] bg-white px-6 py-10 text-center">
                        <p className="text-sm text-[#687169]">
                            No products available right now.
                        </p>
                    </div>
                )}

                {/* Products */}
                {!loading && !error && products.length > 0 && (
                    <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
                        {products.map((product, index) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                index={index}
                            />
                        ))}
                    </div>
                )}

                {/* Mobile View All */}
                <Link
                    href="/shop"
                    className="mx-auto mt-7 flex w-fit items-center gap-2 rounded-full border border-[#DCD6CD] bg-white px-5 py-3 text-sm font-semibold text-[#26352B] transition-colors hover:bg-[#F4EEE7] sm:hidden"
                >
                    View All Products
                    <FiArrowRight size={16} />
                </Link>
            </div>
        </section>
    );
}
