"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { FiSearch, FiSliders, FiPackage } from "react-icons/fi";
import ProductCard from "@/components/ProductCard";

type Product = {
    _id: string;
    name: string;
    price: number;
    category: string;
    image: string;
};

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [sort, setSort] = useState("default");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const categoryFromUrl = params.get("category");

        if (categoryFromUrl === "skin" || categoryFromUrl === "hair") {
            setCategory(categoryFromUrl);
        }
    }, []);

    useEffect(() => {
        async function getProducts() {
            try {
                setLoading(true);
                setError("");

                const response = await fetch("/api/products");

                if (!response.ok) {
                    throw new Error();
                }

                const data = await response.json();
                setProducts(data);
            } catch {
                setError("Unable to load products. Please try again.");
            } finally {
                setLoading(false);
            }
        }

        getProducts();
    }, []);

    let filteredProducts = products.filter((product) => {
        const matchesSearch = product.name
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesCategory =
            category === "all" || product.category === category;

        return matchesSearch && matchesCategory;
    });

    if (sort === "low") {
        filteredProducts = [...filteredProducts].sort(
            (a, b) => a.price - b.price,
        );
    }

    if (sort === "high") {
        filteredProducts = [...filteredProducts].sort(
            (a, b) => b.price - a.price,
        );
    }

    if (loading) {
        return (
            <main className="min-h-[60vh] bg-[#FBF8F3] px-4 py-20">
                <div className="mx-auto flex max-w-7xl flex-col items-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 1.1,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="h-9 w-9 rounded-full border-2 border-[#E7E2DA] border-t-[#7B8A74]"
                    />

                    <p className="mt-4 text-sm text-[#687169]">
                        Loading products...
                    </p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-[60vh] bg-[#FBF8F3] px-4 py-20">
                <div className="mx-auto max-w-7xl rounded-2xl border border-[#E7E2DA] bg-white p-10 text-center">
                    <p className="text-sm text-red-500">{error}</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#FBF8F3]">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7B8A74]">
                        Dermiscaa Collection
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#26352B] sm:text-4xl">
                        Shop
                    </h1>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-[#687169] sm:text-base">
                        Discover skincare and haircare essentials for your
                        everyday routine.
                    </p>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.08 }}
                    className="mt-7 grid gap-3 md:grid-cols-3"
                >
                    <div className="relative">
                        <FiSearch
                            size={17}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7B8A74]"
                        />

                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            className="h-12 w-full rounded-xl border border-[#E7E2DA] bg-white pl-11 pr-4 text-sm text-[#26352B] outline-none transition focus:border-[#7B8A74] focus:ring-2 focus:ring-[#EFDCD6]"
                        />
                    </div>

                    <div className="relative">
                        <FiSliders
                            size={17}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7B8A74]"
                        />

                        <select
                            value={category}
                            onChange={(event) =>
                                setCategory(event.target.value)
                            }
                            className="h-12 w-full appearance-none rounded-xl border border-[#E7E2DA] bg-white pl-11 pr-4 text-sm text-[#26352B] outline-none focus:border-[#7B8A74] focus:ring-2 focus:ring-[#EFDCD6]"
                        >
                            <option value="all">All Categories</option>
                            <option value="skin">Skin Care</option>
                            <option value="hair">Hair Care</option>
                        </select>
                    </div>

                    <select
                        value={sort}
                        onChange={(event) => setSort(event.target.value)}
                        className="h-12 w-full rounded-xl border border-[#E7E2DA] bg-white px-4 text-sm text-[#26352B] outline-none focus:border-[#7B8A74] focus:ring-2 focus:ring-[#EFDCD6]"
                    >
                        <option value="default">Sort by</option>
                        <option value="low">Price: Low to High</option>
                        <option value="high">Price: High to Low</option>
                    </select>
                </motion.div>

                {/* Count */}
                <div className="mt-7 flex items-center gap-2 text-sm text-[#687169]">
                    <FiPackage size={16} />

                    <span>
                        {filteredProducts.length}{" "}
                        {filteredProducts.length === 1 ? "product" : "products"}
                    </span>
                </div>

                {/* Products */}
                {filteredProducts.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-20 text-center"
                    >
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EFDCD6] text-[#7B8A74]">
                            <FiSearch size={22} />
                        </div>

                        <h2 className="mt-4 text-lg font-semibold text-[#26352B]">
                            No products found
                        </h2>

                        <p className="mt-2 text-sm text-[#687169]">
                            Try another search or category.
                        </p>
                    </motion.div>
                ) : (
                    <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-5 lg:grid-cols-3 xl:gap-6">
                        {filteredProducts.map((product, index) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                index={index}
                            />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
