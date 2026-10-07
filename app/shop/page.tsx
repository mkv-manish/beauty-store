"use client";

import { useEffect, useState } from "react";
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
        async function getProducts() {
            try {
                const response = await fetch("/api/products");

                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }

                const data = await response.json();
                setProducts(data);
            } catch {
                setError("Unable to load products.");
            } finally {
                setLoading(false);
            }
        }

        getProducts();
    }, []);

    let filteredProducts = products.filter((product) => {
        const matchSearch = product.name
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchCategory =
            category === "all" || product.category === category;

        return matchSearch && matchCategory;
    });

    if (sort === "low") {
        filteredProducts.sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    if (loading) {
        return <p className="p-10 text-center">Loading products...</p>;
    }

    if (error) {
        return <p className="p-10 text-center text-red-500">{error}</p>;
    }

    return (
        <main className="mx-auto max-w-6xl px-4 py-10">
            <h1 className="text-3xl font-bold text-[#26332A]">Shop</h1>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="rounded-lg border px-4 py-3 outline-none"
                />

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="rounded-lg border px-4 py-3"
                >
                    <option value="all">All Categories</option>
                    <option value="skin">Skin Care</option>
                    <option value="hair">Hair Care</option>
                </select>

                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="rounded-lg border px-4 py-3"
                >
                    <option value="default">Sort by Price</option>
                    <option value="low">Low to High</option>
                    <option value="high">High to Low</option>
                </select>
            </div>

            {filteredProducts.length === 0 ? (
                <p className="py-16 text-center text-gray-500">
                    No products found.
                </p>
            ) : (
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}
        </main>
    );
}
