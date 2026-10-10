"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiSearch } from "react-icons/fi";
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

    const search = (searchParams.get("search") ?? "").trim();
    const requestedCategory = searchParams.get("category");

    const category =
        requestedCategory === "skin" || requestedCategory === "hair"
            ? requestedCategory
            : "all";

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

    const filteredProducts = useMemo(() => {
        const query = search.toLowerCase();

        return products.filter((product) => {
            const matchesSearch =
                !query ||
                product.name.toLowerCase().includes(query) ||
                product.description?.toLowerCase().includes(query) ||
                product.category.toLowerCase().includes(query);

            const matchesCategory =
                category === "all" || product.category === category;

            return matchesSearch && matchesCategory;
        });
    }, [products, search, category]);

    let heading = "For You";
    let description =
        "Explore everyday essentials for your skincare and haircare routine.";

    if (search) {
        heading = `Results for "${search}"`;
        description = `${filteredProducts.length} matching product${
            filteredProducts.length === 1 ? "" : "s"
        } found.`;
    } else if (category === "skin") {
        heading = "Skin Care";
        description =
            "Find the right essentials for your everyday skincare routine.";
    } else if (category === "hair") {
        heading = "Hair Care";
        description = "Discover essentials for your everyday haircare routine.";
    }

    return (
        <main className="min-h-screen bg-[#FBF8F3]">
            <section className="border-b border-[#E7E2DA] bg-white">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                    <Link
                        href="/"
                        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#687169] transition hover:text-[#26352B]"
                    >
                        <FiArrowLeft size={16} />
                        Back to home
                    </Link>

                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#7B8A74] sm:text-sm">
                        Dermiscaa Collection
                    </p>

                    <h1 className="break-words text-3xl font-semibold tracking-tight text-[#26352B] sm:text-4xl lg:text-5xl">
                        {heading}
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[#687169] sm:text-base">
                        {description}
                    </p>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                {!loading && !error && filteredProducts.length > 0 && (
                    <p className="mb-5 text-sm text-[#687169]">
                        Showing {filteredProducts.length}{" "}
                        {filteredProducts.length === 1 ? "product" : "products"}
                    </p>
                )}

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
                    <div className="rounded-2xl border border-[#E7E2DA] bg-white px-5 py-12 text-center">
                        <p className="text-[#687169]">{error}</p>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="mt-4 rounded-full bg-[#26352B] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3C5141]"
                        >
                            Try again
                        </button>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="rounded-2xl border border-[#E7E2DA] bg-white px-5 py-12 text-center sm:py-16">
                        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E7EBDD] text-[#52634F]">
                            <FiSearch size={23} />
                        </span>

                        <h2 className="mt-4 text-xl font-semibold text-[#26352B]">
                            No products found
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#687169]">
                            {search
                                ? "Try another product name, or explore our complete collection."
                                : "There are no products in this category yet. Explore our complete collection instead."}
                        </p>

                        <Link
                            href="/shop"
                            className="mt-6 inline-flex items-center justify-center rounded-full bg-[#26352B] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#3C5141]"
                        >
                            Explore all products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
