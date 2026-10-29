"use client";

import { BagIcon as FiShoppingBag } from "@/components/ui/BeautyIcons";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { FiCalendar, FiPackage } from "react-icons/fi";
import Link from "next/link";
import ErrorNotice from "@/components/ui/ErrorNotice";

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
    const [revision, setRevision] = useState(0);
    const [needsLogin, setNeedsLogin] = useState(false);

    useEffect(() => {
        let controller: AbortController | undefined;
        async function getOrders() {
            controller?.abort();
            controller = new AbortController();
            const signal = controller.signal;
            setLoading(true); setError(""); setOrders([]); setNeedsLogin(false);
            try {
                const response = await fetch("/api/orders/my-orders", { cache: "no-store", signal });

                if (!signal.aborted) setNeedsLogin(response.status === 401);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Unable to load orders.");
                }

                if (!signal.aborted) setOrders(data);
            } catch (error) {
                if (signal.aborted) return;
                setError(
                    error instanceof Error
                        ? error.message
                        : "Unable to load orders.",
                );
            } finally {
                if (!signal.aborted) setLoading(false);
            }
        }

        function storage(event: StorageEvent) { if (event.key === "dermisca-auth-event") void getOrders(); }
        function visible() { if (document.visibilityState === "visible") void getOrders(); }
        void getOrders();
        window.addEventListener("auth-change", getOrders);
        window.addEventListener("storage", storage);
        document.addEventListener("visibilitychange", visible);
        return () => { controller?.abort(); window.removeEventListener("auth-change", getOrders); window.removeEventListener("storage", storage); document.removeEventListener("visibilitychange", visible); };
    }, [revision]);

    if (loading) {
        return (
            <main className="min-h-[70vh] bg-[#F4FAF8] px-4 py-20">
                <div className="mx-auto max-w-5xl animate-pulse space-y-4">
                    <div className="h-10 w-40 rounded bg-[#D3E9E5]" />
                    <div className="h-32 rounded-2xl bg-[#D3E9E5]" />
                    <div className="h-32 rounded-2xl bg-[#D3E9E5]" />
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="section-shell min-h-[60vh]">
                <h1 className="section-title mb-5">My orders</h1>
                <ErrorNotice title={needsLogin ? "Sign in to view your orders" : "Orders couldn’t load"} action={needsLogin ? <Link href="/login?next=/orders">Sign in</Link> : <button type="button" onClick={() => setRevision(value => value + 1)}>Try again</button>}>
                    {error}
                </ErrorNotice>
            </main>
        );
    }

    if (orders.length === 0) {
        return (
            <main className="min-h-[70vh] bg-[#F4FAF8] px-4 py-16 sm:px-6 sm:py-24">
                <div className="mx-auto max-w-md text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#E5F2EF] text-[#287C78]">
                        <FiPackage size={30} />
                    </div>

                    <h1 className="mt-6 text-2xl font-bold text-[#203C3B]">
                        No orders yet
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-[#617B78]">
                        Your previous orders will appear here.
                    </p>

                    <Link
                        href="/shop"
                        className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#287C78] px-6 py-3 text-sm font-semibold text-white"
                    >
                        <FiShoppingBag size={17} />
                        Start Shopping
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#F4FAF8]">
            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#287C78]">
                        Your Account
                    </p>

                    <h1 className="mt-2 text-2xl font-semibold text-[#203C3B] sm:text-3xl">
                        My Orders
                    </h1>

                    <p className="mt-2 text-sm text-[#617B78]">
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
                            className="overflow-hidden rounded-2xl border border-[#D9E7E3] bg-white"
                        >
                            {/* Order Header */}
                            <div className="border-b border-[#D9E7E3] p-5 sm:p-6">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-xs text-[#617B78]">
                                            Order ID
                                        </p>

                                        <p className="mt-1 break-all text-sm font-semibold text-[#203C3B]">
                                            {order._id}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="rounded-full bg-[#D3E9E5] px-3 py-1.5 text-xs font-semibold capitalize text-[#617B78]">
                                            {order.status}
                                        </span>

                                        <span className="rounded-full bg-[#EFF7F5] px-3 py-1.5 text-xs font-medium text-[#617B78]">
                                            {order.paymentMethod}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center gap-2 text-xs text-[#617B78]">
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
                                                <p className="text-sm font-medium text-[#203C3B]">
                                                    {item.name}
                                                </p>

                                                <p className="mt-1 text-xs text-[#617B78]">
                                                    ₹{item.price} ×{" "}
                                                    {item.quantity}
                                                </p>
                                            </div>

                                            <p className="shrink-0 text-sm font-semibold text-[#203C3B]">
                                                ₹{item.price * item.quantity}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="my-5 border-t border-[#D9E7E3]" />

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-[#617B78]">
                                        Order Total
                                    </span>

                                    <span className="text-xl font-bold text-[#203C3B]">
                                        ₹{order.total}
                                    </span>
                                </div>

                                <div className="mt-5 rounded-xl bg-[#F4FAF8] p-4">
                                    <p className="text-xs font-semibold text-[#203C3B]">
                                        Delivery Address
                                    </p>

                                    <p className="mt-1 text-sm leading-6 text-[#617B78]">
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
