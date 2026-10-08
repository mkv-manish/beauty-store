"use client";

import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { motion } from "motion/react";
import {
    FiArrowLeft,
    FiMinus,
    FiPlus,
    FiShoppingBag,
    FiCheck,
} from "react-icons/fi";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/cartSlice";

type Product = {
    _id: string;
    name: string;
    price: number;
    category: string;
    image: string;
    description: string;
    ingredients: string;
    howToUse: string;
    stock: number;
};

export default function ProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const dispatch = useDispatch();

    const [product, setProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function getProduct() {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(`/api/products/${id}`);

                if (!response.ok) {
                    throw new Error();
                }

                const data = await response.json();
                setProduct(data);
            } catch {
                setError("Unable to load this product.");
            } finally {
                setLoading(false);
            }
        }

        getProduct();
    }, [id]);

    function decreaseQuantity() {
        setQuantity((current) => Math.max(1, current - 1));
    }

    function increaseQuantity() {
        if (!product) return;

        setQuantity((current) => Math.min(product.stock, current + 1));
    }

    function handleAddToCart() {
        if (!product || product.stock < 1) return;

        dispatch(
            addToCart({
                _id: product._id,
                name: product.name,
                price: product.price,
                image: product.image,
                stock: product.stock,
                quantity,
            }),
        );

        setMessage("Added to your cart.");
    }

    if (loading) {
        return (
            <main className="min-h-[70vh] bg-[#FBF8F3] px-4 py-20">
                <div className="mx-auto max-w-6xl animate-pulse">
                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="aspect-square rounded-3xl bg-[#EDE8E0]" />
                        <div className="space-y-5 py-4">
                            <div className="h-4 w-24 rounded bg-[#EDE8E0]" />
                            <div className="h-10 w-3/4 rounded bg-[#EDE8E0]" />
                            <div className="h-6 w-28 rounded bg-[#EDE8E0]" />
                            <div className="h-20 rounded bg-[#EDE8E0]" />
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (error || !product) {
        return (
            <main className="min-h-[70vh] bg-[#FBF8F3] px-4 py-20">
                <div className="mx-auto max-w-xl rounded-3xl border border-[#E7E2DA] bg-white p-10 text-center">
                    <p className="text-sm text-red-500">
                        {error || "Product not found."}
                    </p>

                    <Link
                        href="/shop"
                        className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#7B8A74] px-5 py-3 text-sm font-semibold text-white"
                    >
                        <FiArrowLeft size={16} />
                        Back to Shop
                    </Link>
                </div>
            </main>
        );
    }

    const outOfStock = product.stock < 1;

    return (
        <main className="min-h-screen bg-[#FBF8F3]">
            <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-12">
                {/* Back */}
                <Link
                    href="/shop"
                    className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-[#687169] transition hover:text-[#26352B]"
                >
                    <FiArrowLeft size={16} />
                    Back to Shop
                </Link>

                <div className="grid gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="overflow-hidden rounded-3xl border border-[#E7E2DA] bg-white"
                    >
                        <div className="aspect-square bg-[#F4EEE7]">
                            <Image
                                src={product.image}
                                alt={product.name}
                                width={700}
                                height={700}
                                priority
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </motion.div>

                    {/* Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.05 }}
                        className="flex flex-col justify-center"
                    >
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7B8A74]">
                            {product.category} care
                        </p>

                        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-[#26352B] sm:text-4xl">
                            {product.name}
                        </h1>

                        <p className="mt-4 text-2xl font-bold text-[#26352B]">
                            ₹{product.price}
                        </p>

                        <div className="mt-6 h-px bg-[#E7E2DA]" />

                        <p className="mt-6 text-sm leading-7 text-[#687169] sm:text-base">
                            {product.description}
                        </p>

                        {/* Ingredients */}
                        <div className="mt-7">
                            <h2 className="text-sm font-semibold text-[#26352B]">
                                Ingredients
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-[#687169]">
                                {product.ingredients}
                            </p>
                        </div>

                        {/* How To Use */}
                        <div className="mt-6">
                            <h2 className="text-sm font-semibold text-[#26352B]">
                                How to Use
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-[#687169]">
                                {product.howToUse}
                            </p>
                        </div>

                        {/* Stock */}
                        <div className="mt-6">
                            {outOfStock ? (
                                <p className="text-sm font-medium text-red-500">
                                    Out of stock
                                </p>
                            ) : (
                                <p className="text-sm font-medium text-[#7B8A74]">
                                    {product.stock} items available
                                </p>
                            )}
                        </div>

                        {/* Quantity */}
                        {!outOfStock && (
                            <div className="mt-5">
                                <p className="mb-2 text-sm font-medium text-[#26352B]">
                                    Quantity
                                </p>

                                <div className="flex w-fit items-center overflow-hidden rounded-xl border border-[#DDD7CE] bg-white">
                                    <button
                                        type="button"
                                        onClick={decreaseQuantity}
                                        disabled={quantity <= 1}
                                        className="flex h-11 w-11 items-center justify-center text-[#26352B] transition hover:bg-[#F4EEE7] disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <FiMinus size={16} />
                                    </button>

                                    <span className="flex h-11 min-w-12 items-center justify-center border-x border-[#DDD7CE] text-sm font-semibold text-[#26352B]">
                                        {quantity}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={increaseQuantity}
                                        disabled={quantity >= product.stock}
                                        className="flex h-11 w-11 items-center justify-center text-[#26352B] transition hover:bg-[#F4EEE7] disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <FiPlus size={16} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Add Cart */}
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            disabled={outOfStock}
                            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#7B8A74] px-5 text-sm font-semibold text-white transition hover:bg-[#687761] disabled:cursor-not-allowed disabled:bg-[#B9BEB6]"
                        >
                            <FiShoppingBag size={18} />

                            {outOfStock ? "Out of Stock" : "Add to Cart"}
                        </button>

                        {message && (
                            <motion.p
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-3 flex items-center justify-center gap-2 text-sm font-medium text-[#7B8A74]"
                            >
                                <FiCheck size={16} />
                                {message}
                            </motion.p>
                        )}
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
