"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
    FiArrowRight,
    FiArrowUpRight,
    FiDroplet,
    FiFeather,
    FiHeart,
    FiShield,
} from "react-icons/fi";
import ProductCard from "@/components/ProductCard";

type Product = {
    _id: string;
    name: string;
    price: number;
    category: string;
    image: string;
};

const benefits = [
    {
        icon: FiFeather,
        title: "Thoughtful Ingredients",
        description:
            "Simple formulas made for an easy everyday beauty routine.",
    },
    {
        icon: FiHeart,
        title: "Everyday Care",
        description: "Skincare and haircare essentials designed for daily use.",
    },
    {
        icon: FiShield,
        title: "Quality Focused",
        description: "Carefully selected products with quality at the center.",
    },
];

export default function HomePage() {
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
                setProducts(data);
            } catch {
                setError("Unable to load products.");
            } finally {
                setLoading(false);
            }
        }

        getProducts();
    }, []);

    const bestSellers = products.slice(0, 4);

    return (
        <main className="overflow-hidden bg-white">
            {/* HERO BANNER */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="relative w-full overflow-hidden"
            >
                <Image
                    src="/images/home/hero_banner1.png"
                    alt="Dermiscaa beauty products"
                    width={1920}
                    height={800}
                    priority
                    sizes="100vw"
                    className="h-auto w-full object-contain"
                />
            </motion.div>

            {/* SHOP BY CATEGORY */}
            <section className="bg-white px-4 py-14 sm:px-6 sm:py-20">
                <div className="mx-auto max-w-7xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45 }}
                        className="text-center"
                    >
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7B8A74]">
                            Explore the collection
                        </p>

                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#26352B] sm:text-4xl">
                            Shop by Category
                        </h2>

                        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#687169] sm:text-base">
                            Find simple essentials for your skin and hair care
                            routine.
                        </p>
                    </motion.div>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-6">
                        {/* Skin Care */}
                        <motion.div
                            initial={{ opacity: 0, x: -25 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            whileHover={{ y: -5 }}
                        >
                            <Link
                                href="/shop?category=skin"
                                className="group block rounded-3xl border border-[#E7E2DA] bg-[#F4E3DE] p-6 sm:p-8"
                            >
                                <div className="flex min-h-52 flex-col justify-between sm:min-h-60">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#7B8A74]">
                                        <FiDroplet size={22} />
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#7B8A74]">
                                            Skin Care
                                        </p>

                                        <div className="mt-2 flex items-end justify-between gap-4">
                                            <h3 className="text-2xl font-bold text-[#26352B] sm:text-3xl">
                                                Fresh skin,
                                                <br />
                                                simple routine.
                                            </h3>

                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#26352B] transition-transform group-hover:translate-x-1">
                                                <FiArrowUpRight size={19} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>

                        {/* Hair Care */}
                        <motion.div
                            initial={{ opacity: 0, x: 25 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            whileHover={{ y: -5 }}
                        >
                            <Link
                                href="/shop?category=hair"
                                className="group block rounded-3xl border border-[#E7E2DA] bg-[#E3E8DE] p-6 sm:p-8"
                            >
                                <div className="flex min-h-52 flex-col justify-between sm:min-h-60">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#7B8A74]">
                                        <FiFeather size={22} />
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#7B8A74]">
                                            Hair Care
                                        </p>

                                        <div className="mt-2 flex items-end justify-between gap-4">
                                            <h3 className="text-2xl font-bold text-[#26352B] sm:text-3xl">
                                                Healthy hair,
                                                <br />
                                                everyday care.
                                            </h3>

                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#26352B] transition-transform group-hover:translate-x-1">
                                                <FiArrowUpRight size={19} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/*  BEST SELLERS  */}
            <section className="bg-[#FBF8F3] px-4 py-14 sm:px-6 sm:py-20">
                <div className="mx-auto max-w-7xl">
                    <div className="flex items-end justify-between gap-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
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
                        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
                            {[1, 2, 3, 4].map((item) => (
                                <div
                                    key={item}
                                    className="aspect-[0.82] animate-pulse rounded-2xl bg-[#EDE8E0]"
                                />
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
                    {!loading && !error && bestSellers.length === 0 && (
                        <div className="mt-8 rounded-2xl border border-[#E7E2DA] bg-white px-6 py-10 text-center">
                            <p className="text-sm text-[#687169]">
                                No products available right now.
                            </p>
                        </div>
                    )}

                    {/* Products */}
                    {!loading && !error && bestSellers.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 25 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6"
                        >
                            {bestSellers.map((product, index) => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                    index={index}
                                />
                            ))}
                        </motion.div>
                    )}

                    <Link
                        href="/shop"
                        className="mx-auto mt-7 flex w-fit items-center gap-2 rounded-full border border-[#DCD6CD] bg-white px-5 py-3 text-sm font-semibold text-[#26352B] transition-all hover:bg-[#F4EEE7] sm:hidden"
                    >
                        View All Products
                        <FiArrowRight size={16} />
                    </Link>
                </div>
            </section>

            {/*  WHY CHOOSE US  */}
            <section className="bg-white px-4 py-14 sm:px-6 sm:py-20">
                <div className="mx-auto max-w-7xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45 }}
                        className="mx-auto max-w-2xl text-center"
                    >
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7B8A74]">
                            Why Dermiscaa
                        </p>

                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#26352B] sm:text-4xl">
                            Beauty care, kept simple.
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-[#687169] sm:text-base">
                            Everything you need for a simple and comfortable
                            everyday routine.
                        </p>
                    </motion.div>

                    <div className="mt-10 grid gap-4 md:grid-cols-3 md:gap-6">
                        {benefits.map((benefit, index) => {
                            const Icon = benefit.icon;

                            return (
                                <motion.div
                                    key={benefit.title}
                                    initial={{
                                        opacity: 0,
                                        y: 20,
                                    }}
                                    whileInView={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 0.45,
                                        delay: index * 0.08,
                                    }}
                                    whileHover={{ y: -4 }}
                                    className="rounded-2xl border border-[#E7E2DA] bg-[#FBF8F3] p-6"
                                >
                                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F4E3DE] text-[#7B8A74]">
                                        <Icon size={20} />
                                    </div>

                                    <h3 className="mt-5 text-lg font-semibold text-[#26352B]">
                                        {benefit.title}
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-[#687169]">
                                        {benefit.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </main>
    );
}
