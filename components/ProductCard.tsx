"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { FiArrowUpRight } from "react-icons/fi";

type Product = {
    _id: string;
    name: string;
    price: number;
    category: string;
    image: string;
};

type ProductCardProps = {
    product: Product;
    index?: number;
};

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
                duration: 0.45,
                delay: index * 0.05,
                ease: "easeOut",
            }}
            whileHover={{ y: -4 }}
            className="group overflow-hidden rounded-2xl border border-[#E7E2DA] bg-white shadow-sm"
        >
            {/* Product Image */}
            <Link href={`/product/${product._id}`}>
                <div className="aspect-square overflow-hidden bg-[#F4EEE7]">
                    <motion.div
                        className="h-full w-full"
                        whileHover={{ scale: 1.04 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        <Image
                            src={product.image}
                            alt={product.name}
                            width={500}
                            height={500}
                            className="h-full w-full object-cover"
                        />
                    </motion.div>
                </div>
            </Link>

            {/* Product Information */}
            <div className="p-3 sm:p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#7B8A74] sm:text-xs">
                    {product.category} care
                </p>

                <h2 className="mt-1.5 line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-[#26352B] sm:mt-2 sm:min-h-12 sm:text-lg sm:leading-6">
                    {product.name}
                </h2>

                <p className="mt-2 text-base font-bold text-[#26352B] sm:text-lg">
                    ₹{product.price}
                </p>

                <Link
                    href={`/product/${product._id}`}
                    className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-[#7B8A74] px-2 py-2.5 text-xs font-medium text-white transition-all hover:bg-[#687761] hover:shadow-sm sm:mt-4 sm:px-4 sm:py-3 sm:text-sm"
                >
                    View Product
                    <FiArrowUpRight
                        size={16}
                        className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                </Link>
            </div>
        </motion.article>
    );
}
