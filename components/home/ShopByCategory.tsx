"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { FiArrowUpRight, FiDroplet, FiFeather } from "react-icons/fi";

export default function ShopByCategory() {
    return (
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
    );
}
