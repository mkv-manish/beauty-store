"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
    FiArrowRight,
    FiMinus,
    FiPlus,
    FiShoppingBag,
    FiTrash2,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateQuantity } from "@/store/cartSlice";
import type { RootState } from "@/store/store";

export default function CartPage() {
    const dispatch = useDispatch();

    const items = useSelector((state: RootState) => state.cart.items);

    const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );

    if (items.length === 0) {
        return (
            <main className="min-h-[70vh] bg-[#FBF8F3] px-4 py-16 sm:px-6 sm:py-24">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mx-auto max-w-md text-center"
                >
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#EFDCD6] text-[#7B8A74]">
                        <FiShoppingBag size={30} />
                    </div>

                    <h1 className="mt-6 text-2xl font-bold text-[#26352B]">
                        Your cart is empty
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-[#687169]">
                        Add something from our collection to get started.
                    </p>

                    <Link
                        href="/shop"
                        className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#7B8A74] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#687761]"
                    >
                        Continue Shopping
                        <FiArrowRight size={16} />
                    </Link>
                </motion.div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#FBF8F3]">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7B8A74]">
                        Your Selection
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-[#26352B] sm:text-4xl">
                        Shopping Cart
                    </h1>

                    <p className="mt-2 text-sm text-[#687169]">
                        Review your products before checkout.
                    </p>
                </motion.div>

                <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_350px]">
                    {/* Items */}
                    <div className="space-y-3">
                        {items.map((item, index) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="rounded-2xl border border-[#E7E2DA] bg-white p-3 sm:p-5"
                            >
                                <div className="flex gap-3 sm:gap-5">
                                    {/* Image */}
                                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#F4EEE7] sm:h-32 sm:w-32">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            width={200}
                                            height={200}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <h2 className="line-clamp-2 text-sm font-semibold text-[#26352B] sm:text-base">
                                                    {item.name}
                                                </h2>

                                                <p className="mt-1 text-sm font-semibold text-[#26352B]">
                                                    ₹{item.price}
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    dispatch(
                                                        removeFromCart(
                                                            item._id,
                                                        ),
                                                    )
                                                }
                                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#8C625D] transition hover:bg-[#F8ECE9]"
                                                aria-label={`Remove ${item.name}`}
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>

                                        <p className="mt-2 text-xs text-[#687169]">
                                            {item.stock} available
                                        </p>

                                        {/* Quantity */}
                                        <div className="mt-4 flex items-center justify-between gap-3">
                                            <div className="flex items-center overflow-hidden rounded-lg border border-[#DDD7CE]">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        dispatch(
                                                            updateQuantity({
                                                                id: item._id,
                                                                quantity:
                                                                    item.quantity -
                                                                    1,
                                                            }),
                                                        )
                                                    }
                                                    disabled={
                                                        item.quantity <= 1
                                                    }
                                                    className="flex h-8 w-8 items-center justify-center text-[#26352B] hover:bg-[#F4EEE7] disabled:opacity-40"
                                                >
                                                    <FiMinus size={13} />
                                                </button>

                                                <span className="flex h-8 min-w-9 items-center justify-center border-x border-[#DDD7CE] text-xs font-semibold text-[#26352B]">
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        dispatch(
                                                            updateQuantity({
                                                                id: item._id,
                                                                quantity:
                                                                    item.quantity +
                                                                    1,
                                                            }),
                                                        )
                                                    }
                                                    disabled={
                                                        item.quantity >=
                                                        item.stock
                                                    }
                                                    className="flex h-8 w-8 items-center justify-center text-[#26352B] hover:bg-[#F4EEE7] disabled:opacity-40"
                                                >
                                                    <FiPlus size={13} />
                                                </button>
                                            </div>

                                            <p className="text-sm font-bold text-[#26352B]">
                                                ₹{item.price * item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Summary */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="h-fit rounded-2xl border border-[#E7E2DA] bg-white p-5 sm:p-6 lg:sticky lg:top-24"
                    >
                        <h2 className="text-lg font-bold text-[#26352B]">
                            Order Summary
                        </h2>

                        <div className="mt-6 flex items-center justify-between text-sm text-[#687169]">
                            <span>Items</span>
                            <span>{items.length}</span>
                        </div>

                        <div className="mt-3 flex items-center justify-between text-sm text-[#687169]">
                            <span>Payment</span>
                            <span>Cash on Delivery</span>
                        </div>

                        <div className="my-5 border-t border-[#E7E2DA]" />

                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-[#26352B]">
                                Total
                            </span>

                            <span className="text-xl font-bold text-[#26352B]">
                                ₹{total}
                            </span>
                        </div>

                        <Link
                            href="/checkout"
                            className="mt-6 flex h-12 items-center justify-center gap-2 rounded-xl bg-[#7B8A74] text-sm font-semibold text-white transition hover:bg-[#687761]"
                        >
                            Proceed to Checkout
                            <FiArrowRight size={17} />
                        </Link>

                        <Link
                            href="/shop"
                            className="mt-3 flex h-11 items-center justify-center rounded-xl border border-[#DDD7CE] text-sm font-medium text-[#26352B] transition hover:bg-[#F4EEE7]"
                        >
                            Continue Shopping
                        </Link>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
