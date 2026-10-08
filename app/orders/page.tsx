"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { FiCalendar, FiPackage, FiShoppingBag } from "react-icons/fi";
import Link from "next/link";

type OrderItem = {
    product: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
};

type Order = {
    _id: string;
    name: string;
    phone: string;
    address: string;
    items: OrderItem[];
    total: number;
    paymentMethod: string;
    status: string;
    createdAt: string;
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function getOrders() {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    setError("Please login to view your orders.");
                    return;
                }

                const response = await fetch("/api/orders/my-orders", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Unable to load orders.");
                }

                setOrders(data);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Unable to load orders.",
                );
            } finally {
                setLoading(false);
            }
        }

        getOrders();
    }, []);

    if (loading) {
        return (
            <main className="min-h-[70vh] bg-[#FBF8F3] px-4 py-20">
                <div className="mx-auto max-w-5xl animate-pulse space-y-4">
                    <div className="h-10 w-40 rounded bg-[#EDE8E0]" />
                    <div className="h-32 rounded-2xl bg-[#EDE8E0]" />
                    <div className="h-32 rounded-2xl bg-[#EDE8E0]" />
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-[70vh] bg-[#FBF8F3] px-4 py-20">
                <div className="mx-auto max-w-md rounded-3xl border border-[#E7E2DA] bg-white p-8 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EFDCD6] text-[#7B8A74]">
                        <FiPackage size={24} />
                    </div>

                    <h1 className="mt-5 text-xl font-bold text-[#26352B]">
                        My Orders
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-[#687169]">
                        {error}
                    </p>

                    <Link
                        href="/login"
                        className="mt-6 inline-flex rounded-full bg-[#7B8A74] px-6 py-3 text-sm font-semibold text-white"
                    >
                        Login
                    </Link>
                </div>
            </main>
        );
    }

    if (orders.length === 0) {
        return (
            <main className="min-h-[70vh] bg-[#FBF8F3] px-4 py-16 sm:px-6 sm:py-24">
                <div className="mx-auto max-w-md text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#EFDCD6] text-[#7B8A74]">
                        <FiPackage size={30} />
                    </div>

                    <h1 className="mt-6 text-2xl font-bold text-[#26352B]">
                        No orders yet
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-[#687169]">
                        Your previous orders will appear here.
                    </p>

                    <Link
                        href="/shop"
                        className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#7B8A74] px-6 py-3 text-sm font-semibold text-white"
                    >
                        <FiShoppingBag size={17} />
                        Start Shopping
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#FBF8F3]">
            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7B8A74]">
                        Your Account
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-[#26352B] sm:text-4xl">
                        My Orders
                    </h1>

                    <p className="mt-2 text-sm text-[#687169]">
                        View your Dermisca order history.
                    </p>
                </motion.div>

                <div className="mt-8 space-y-5">
                    {orders.map((order, index) => (
                        <motion.article
                            key={order._id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="overflow-hidden rounded-2xl border border-[#E7E2DA] bg-white"
                        >
                            {/* Order Header */}
                            <div className="border-b border-[#E7E2DA] p-5 sm:p-6">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-xs text-[#687169]">
                                            Order ID
                                        </p>

                                        <p className="mt-1 break-all text-sm font-semibold text-[#26352B]">
                                            {order._id}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="rounded-full bg-[#E2E9DF] px-3 py-1.5 text-xs font-semibold capitalize text-[#687761]">
                                            {order.status}
                                        </span>

                                        <span className="rounded-full bg-[#F4EEE7] px-3 py-1.5 text-xs font-medium text-[#687169]">
                                            {order.paymentMethod}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center gap-2 text-xs text-[#687169]">
                                    <FiCalendar size={14} />

                                    {new Date(
                                        order.createdAt,
                                    ).toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </div>
                            </div>

                            {/* Products */}
                            <div className="p-5 sm:p-6">
                                <div className="space-y-4">
                                    {order.items.map((item) => (
                                        <div
                                            key={`${order._id}-${item.product}`}
                                            className="flex items-center justify-between gap-4"
                                        >
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-[#26352B]">
                                                    {item.name}
                                                </p>

                                                <p className="mt-1 text-xs text-[#687169]">
                                                    ₹{item.price} ×{" "}
                                                    {item.quantity}
                                                </p>
                                            </div>

                                            <p className="shrink-0 text-sm font-semibold text-[#26352B]">
                                                ₹{item.price * item.quantity}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="my-5 border-t border-[#E7E2DA]" />

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-[#687169]">
                                        Order Total
                                    </span>

                                    <span className="text-xl font-bold text-[#26352B]">
                                        ₹{order.total}
                                    </span>
                                </div>

                                <div className="mt-5 rounded-xl bg-[#FBF8F3] p-4">
                                    <p className="text-xs font-semibold text-[#26352B]">
                                        Delivery Address
                                    </p>

                                    <p className="mt-1 text-sm leading-6 text-[#687169]">
                                        {order.address}
                                    </p>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </main>
    );
}
