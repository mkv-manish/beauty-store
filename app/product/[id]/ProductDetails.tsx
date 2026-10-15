"use client";
import { useCart } from "@/store/useCart";

import { BagIcon as FiShoppingBag } from "@/components/ui/BeautyIcons";

import ProductReviews from "@/components/products/ProductReviews";
import WishlistButton from "@/components/products/WishlistButton";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import {
    FiArrowLeft,
    FiMinus,
    FiPlus,
    FiCheck,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/cartSlice";

import type { ProductData } from "@/types/product";
import { categoryLabel } from "@/config/categories";

export default function ProductDetails({ product }: { product: ProductData }) {
    const dispatch = useDispatch();
    const router = useRouter();
    const { items: cartItems } = useCart();
    const isAdded = cartItems.some(item => item._id === product._id);
    const outOfStock = product.stock < 1;
    const images = [...new Set([product.image, ...(product.images ?? [])])];
    const [activeImage, setActiveImage] = useState(product.image);
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState("");

    function decreaseQuantity() {
        setQuantity((current) => Math.max(1, current - 1));
    }

    function increaseQuantity() {
        if (!product) return;

        setQuantity((current) => Math.min(product.stock, current + 1));
    }

    function handleAddToCart() {
        if (!product || product.stock < 1) return;
        if (isAdded) { router.push("/cart"); return; }

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
                        className="relative h-fit overflow-hidden rounded-3xl border border-[#E7E2DA] bg-white"
                    >
                        <div className="absolute right-3 top-3 z-10"><WishlistButton id={product._id} name={product.name} /></div>
                        <div className="aspect-square bg-[#F4EEE7]">
                            <Image
                                src={activeImage}
                                alt={product.name}
                                width={700}
                                height={700}
                                sizes="(max-width: 767px) 100vw, 50vw"
                                priority
                                className="h-full w-full object-cover"
                            />
                        </div>
                        {images.length > 1 && <div className="flex gap-3 overflow-x-auto p-3" aria-label="Product images">{images.map((src, index) => <button key={src} type="button" aria-label={`View product image ${index + 1}`} aria-pressed={activeImage === src} onClick={() => setActiveImage(src)} className={`shrink-0 overflow-hidden rounded-xl border-2 ${activeImage === src ? "border-[#52634F]" : "border-transparent"}`}><Image src={src} alt={`${product.name}, view ${index + 1}`} width={64} height={64} sizes="64px" /></button>)}</div>}
                    </motion.div>

                    {/* Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.05 }}
                        className="flex flex-col justify-center"
                    >
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#52634F]">
                            {categoryLabel(product.category)}
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
                                <p className="stock-label">
                                    <span className="stock-dot" /> In stock · {product.stock} available
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
                                        aria-label="Decrease quantity" onClick={decreaseQuantity}
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
                                        aria-label="Increase quantity" onClick={increaseQuantity}
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
                            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#52634F] px-5 text-sm font-semibold text-white transition hover:bg-[#3C5141] disabled:cursor-not-allowed disabled:bg-[#B9BEB6]"
                        >
                            <FiShoppingBag size={18} />

                            {outOfStock ? "Out of Stock" : isAdded ? "Go to Cart" : "Add to Cart"}
                        </button>

                        {message && (
                            <motion.p
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-3 flex items-center justify-center gap-2 text-sm font-medium text-[#52634F]"
                            >
                                <FiCheck size={16} />
                                {message}
                            </motion.p>
                        )}
                    </motion.div>
                </div>
                <ProductReviews id={product._id} />
            </div>
        </main>
    );
}
