"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { FiSearch, FiSliders, FiX } from "react-icons/fi";
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

export default function ShopContent() {
    const searchParams = useSearchParams();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [sort, setSort] = useState("default");

    // Get category from URL
    useEffect(() => {
        const categoryFromUrl = searchParams.get("category");

        if (categoryFromUrl === "skin" || categoryFromUrl === "hair") {
            setCategory(categoryFromUrl);
        } else {
            setCategory("all");
        }
    }, [searchParams]);

    // Fetch products
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

                if (!Array.isArray(data)) {
                    throw new Error("Invalid products response");
                }

                setProducts(data);
            } catch {
                setError("Unable to load products.");
            } finally {
                setLoading(false);
            }
        }

        getProducts();
    }, []);

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Search
        if (search.trim()) {
            const searchText = search.trim().toLowerCase();

            result = result.filter((product) =>
                product.name.toLowerCase().includes(searchText),
            );
        }

        // Category
        if (category !== "all") {
            result = result.filter((product) => product.category === category);
        }

        // Sort
        if (sort === "low") {
            result.sort((a, b) => a.price - b.price);
        }

        if (sort === "high") {
            result.sort((a, b) => b.price - a.price);
        }

        return result;
    }, [products, search, category, sort]);

    // Clear filters
    function clearFilters() {
        setSearch("");
        setCategory("all");
        setSort("default");
    }

    return (
        <main className="min-h-screen bg-[#FBF8F3]">
            {/* Header */}
            <section className="border-b border-[#E7E2DA] bg-white">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7B8A74]">
                            Dermisca Collection
                        </p>

                        <h1 className="mt-2 text-4xl font-bold tracking-tight text-[#26352B] sm:text-5xl">
                            Shop
                        </h1>

                        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#687169] sm:text-base">
                            Explore our skincare and haircare essentials made
                            for your everyday routine.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Filters */}
            <section className="border-b border-[#E7E2DA] bg-white">
                <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        {/* Search */}
                        <div className="relative w-full lg:max-w-md">
                            <FiSearch
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#687169]"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search products..."
                                aria-label="Search products"
                                className="w-full rounded-xl border border-[#E7E2DA] bg-[#FBF8F3] py-3 pl-11 pr-10 text-sm text-[#26352B] outline-none transition placeholder:text-[#92998F] focus:border-[#7B8A74] focus:ring-2 focus:ring-[#7B8A74]/10"
                            />

                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#687169] transition hover:bg-[#E7E2DA]"
                                    aria-label="Clear search"
                                >
                                    <FiX size={16} />
                                </button>
                            )}
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            {/* Category */}
                            <div className="flex items-center gap-2">
                                <FiSliders
                                    size={16}
                                    className="hidden text-[#687169] sm:block"
                                />

                                <select
                                    value={category}
                                    onChange={(event) =>
                                        setCategory(event.target.value)
                                    }
                                    aria-label="Filter by category"
                                    className="w-full cursor-pointer rounded-xl border border-[#E7E2DA] bg-[#FBF8F3] px-4 py-3 text-sm text-[#26352B] outline-none transition focus:border-[#7B8A74] focus:ring-2 focus:ring-[#7B8A74]/10 sm:w-auto"
                                >
                                    <option value="all">All Categories</option>
                                    <option value="skin">Skin Care</option>
                                    <option value="hair">Hair Care</option>
                                </select>
                            </div>

                            {/* Sort */}
                            <select
                                value={sort}
                                onChange={(event) =>
                                    setSort(event.target.value)
                                }
                                aria-label="Sort products by price"
                                className="w-full cursor-pointer rounded-xl border border-[#E7E2DA] bg-[#FBF8F3] px-4 py-3 text-sm text-[#26352B] outline-none transition focus:border-[#7B8A74] focus:ring-2 focus:ring-[#7B8A74]/10 sm:w-auto"
                            >
                                <option value="default">Sort by</option>
                                <option value="low">Price: Low to High</option>
                                <option value="high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Active Filters */}
                    {(search || category !== "all" || sort !== "default") && (
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <span className="text-xs text-[#687169]">
                                Active filters:
                            </span>

                            {search && (
                                <span className="max-w-full break-words rounded-full bg-[#EFDCD6] px-3 py-1 text-xs font-medium text-[#26352B]">
                                    Search: {search}
                                </span>
                            )}

                            {category !== "all" && (
                                <span className="rounded-full bg-[#DDE3D8] px-3 py-1 text-xs font-medium capitalize text-[#26352B]">
                                    {category} care
                                </span>
                            )}

                            {sort !== "default" && (
                                <span className="rounded-full bg-[#E7E2DA] px-3 py-1 text-xs font-medium text-[#26352B]">
                                    {sort === "low"
                                        ? "Low to High"
                                        : "High to Low"}
                                </span>
                            )}

                            <button
                                type="button"
                                onClick={clearFilters}
                                className="text-xs font-semibold text-[#7B8A74] transition hover:text-[#26352B]"
                            >
                                Clear all
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Products */}
            <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
                {loading ? (
                    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <div
                                key={index}
                                className="overflow-hidden rounded-2xl border border-[#E7E2DA] bg-white"
                            >
                                <div className="aspect-square animate-pulse bg-[#EDE8E0]" />

                                <div className="space-y-3 p-4">
                                    <div className="h-3 w-20 animate-pulse rounded bg-[#EDE8E0]" />
                                    <div className="h-5 w-3/4 animate-pulse rounded bg-[#EDE8E0]" />
                                    <div className="h-5 w-16 animate-pulse rounded bg-[#EDE8E0]" />
                                    <div className="h-10 animate-pulse rounded-xl bg-[#EDE8E0]" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="rounded-2xl border border-[#E7E2DA] bg-white px-6 py-14 text-center">
                        <p className="text-sm text-red-500">{error}</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="rounded-2xl border border-[#E7E2DA] bg-white px-6 py-14 text-center">
                        <h2 className="text-xl font-semibold text-[#26352B]">
                            No products found
                        </h2>

                        <p className="mt-2 text-sm text-[#687169]">
                            Try changing your search or filters.
                        </p>

                        <button
                            type="button"
                            onClick={clearFilters}
                            className="mt-5 rounded-xl bg-[#7B8A74] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#687761] focus:outline-none focus:ring-2 focus:ring-[#7B8A74]/40 focus:ring-offset-2"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="mb-6 flex items-center justify-between">
                            <p className="text-sm text-[#687169]">
                                Showing{" "}
                                <span className="font-semibold text-[#26352B]">
                                    {filteredProducts.length}
                                </span>{" "}
                                {filteredProducts.length === 1
                                    ? "product"
                                    : "products"}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
                            {filteredProducts.map((product) => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                />
                            ))}
                        </div>
                    </>
                )}
            </section>
        </main>
    );
}
