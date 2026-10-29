"use client";
import CartLoading from "@/components/cart/CartLoading";
import { useCart } from "@/store/useCart";

import { BagIcon as FiShoppingBag } from "@/components/ui/BeautyIcons";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
    FiArrowRight,
    FiMinus,
    FiPlus,
    FiTrash2,
} from "react-icons/fi";
import { useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "@/store/cartSlice";

export default function CartPage() {
    const dispatch = useDispatch();

    const { items, hydrated } = useCart();

    const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );

    if (!hydrated) return <CartLoading />;

    if (items.length === 0) {
        return (
            <main className="min-h-[70vh] bg-[#F4FAF8] px-4 py-16 sm:px-6 sm:py-24">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mx-auto max-w-md text-center"
                >
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#E5F2EF] text-[#287C78]">
                        <FiShoppingBag size={30} />
                    </div>

                    <h1 className="mt-6 text-2xl font-bold text-[#203C3B]">
                        Your cart is empty
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-[#617B78]">
                        Add something from our collection to get started.
                    </p>

                    <Link
                        href="/shop"
                        className="commerce-action mt-7 inline-flex items-center gap-2 rounded-full bg-[#287C78] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#246662]"
                    >
                        Continue Shopping
                        <FiArrowRight size={16} />
                    </Link>
                </motion.div>
            </main>
        );
    }

    return (
        <main className="commerce-page cart-page min-h-screen bg-[#F4FAF8]">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="mt-2 text-2xl font-semibold text-[#203C3B] sm:text-3xl">
                        Shopping Cart
                    </h1>

                    <p className="mt-2 text-sm text-[#617B78]">
                        Review your products before checkout.
                    </p>
                </motion.div>

                <div className="mt-8 grid gap-6 md:grid-cols-[minmax(0,1fr)_280px] lg:grid-cols-[minmax(0,1fr)_350px]">
                    {/* Items */}
                    <div className="space-y-3">
                        {items.map((item, index) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="rounded-2xl border border-[#D9E7E3] bg-white p-3 sm:p-5"
                            >
                                <div className="flex gap-3 sm:gap-5">
                                    {/* Image */}
                                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#EFF7F5] sm:h-32 sm:w-32">
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
                                                <h2 className="line-clamp-2 text-sm font-semibold text-[#203C3B] sm:text-base">
                                                    {item.name}
                                                </h2>

                                                <p className="mt-1 text-sm font-semibold text-[#203C3B]">
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
                                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#8C625D] transition hover:bg-[#F8ECE9]"
                                                aria-label={`Remove ${item.name}`}
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>

                                        <p className="stock-label mt-2">
                                            <span className="stock-dot" /> In stock · {item.stock} available
                                        </p>

                                        {/* Quantity */}
                                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                            <div className="flex items-center overflow-hidden rounded-lg border border-[#D9E7E3]">
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
                                                    aria-label={`Decrease quantity of ${item.name}`}
                                                    disabled={
                                                        item.quantity <= 1
                                                    }
                                                    className="flex h-11 w-11 items-center justify-center text-[#203C3B] hover:bg-[#EFF7F5] disabled:opacity-40"
                                                >
                                                    <FiMinus size={13} />
                                                </button>

                                                <span className="flex h-11 min-w-9 items-center justify-center border-x border-[#D9E7E3] text-xs font-semibold text-[#203C3B]">
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
                                                    aria-label={`Increase quantity of ${item.name}`}
                                                    disabled={
                                                        item.quantity >=
                                                        item.stock
                                                    }
                                                    className="flex h-11 w-11 items-center justify-center text-[#203C3B] hover:bg-[#EFF7F5] disabled:opacity-40"
                                                >
                                                    <FiPlus size={13} />
                                                </button>
                                            </div>

                                            <p className="text-sm font-bold text-[#203C3B]">
                                                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
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
                        className="h-fit rounded-2xl border border-[#D9E7E3] bg-white p-5 sm:p-6 lg:sticky lg:top-24"
                    >
                        <h2 className="text-lg font-bold text-[#203C3B]">
                            Order Summary
                        </h2>

                        <div className="mt-6 flex items-center justify-between text-sm text-[#617B78]">
                            <span>Items</span>
                            <span>{items.reduce((count, item) => count + item.quantity, 0)}</span>
                        </div>

                        <div className="mt-3 flex items-center justify-between text-sm text-[#617B78]">
                            <span>Payment</span>
                            <span>Cash on Delivery</span>
                        </div>

                        <div className="my-5 border-t border-[#D9E7E3]" />

                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-[#203C3B]">
                                Total
                            </span>

                            <span className="text-xl font-bold text-[#203C3B]">
                                ₹{total.toLocaleString("en-IN")}
                            </span>
                        </div>

                        <Link
                            href="/checkout"
                            className="commerce-action mt-6 flex h-12 items-center justify-center gap-2 rounded-xl bg-[#287C78] text-sm font-semibold text-white transition hover:bg-[#246662]"
                        >
                            Proceed to Checkout
                            <FiArrowRight size={17} />
                        </Link>

                        <Link
                            href="/shop"
                            className="mt-3 flex h-11 items-center justify-center rounded-xl border border-[#D9E7E3] text-sm font-medium text-[#203C3B] transition hover:bg-[#EFF7F5]"
                        >
                            Continue Shopping
                        </Link>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
