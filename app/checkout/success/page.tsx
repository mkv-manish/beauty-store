"use client";

import { BagIcon as FiShoppingBag } from "@/components/ui/BeautyIcons";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FiCheck } from "react-icons/fi";

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");

    return (
        <main className="min-h-screen bg-[#F4FAF8] px-4 py-16 sm:px-6 sm:py-20">
            <div className="mx-auto max-w-lg">
                <div className="rounded-3xl border border-[#D9E7E3] bg-white p-8 text-center shadow-sm sm:p-10">
                    {/* Success Icon */}
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#D3E9E5] text-[#287C78]">
                        <FiCheck size={36} />
                    </div>

                    {/* Heading */}
                    <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#287C78]">
                        Order Confirmed
                    </p>

                    <h1 className="mt-2 text-2xl font-semibold text-[#203C3B] sm:text-3xl">
                        Thank You!
                    </h1>

                    <p className="mt-4 text-sm leading-6 text-[#617B78]">
                        Your order has been placed successfully. We will contact
                        you shortly regarding your delivery.
                    </p>

                    {/* Order ID */}
                    {orderId && (
                        <div className="mt-6 rounded-2xl bg-[#F4FAF8] p-4">
                            <p className="text-xs text-[#617B78]">Order ID</p>

                            <p className="mt-1 break-all text-sm font-semibold text-[#203C3B]">
                                {orderId}
                            </p>
                        </div>
                    )}

                    {/* COD */}
                    <div className="mt-4 rounded-2xl border border-[#D9E7E3] bg-white p-4">
                        <p className="text-sm font-semibold text-[#203C3B]">
                            Cash on Delivery
                        </p>

                        <p className="mt-1 text-xs text-[#617B78]">
                            Pay when your order is delivered.
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link
                            href="/shop"
                            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#287C78] px-5 text-sm font-semibold text-white transition hover:bg-[#246662]"
                        >
                            <FiShoppingBag size={17} />
                            Continue Shopping
                        </Link>

                        <Link
                            href="/orders"
                            className="flex h-12 flex-1 items-center justify-center rounded-xl border border-[#D9E7E3] bg-white px-5 text-sm font-semibold text-[#203C3B] transition hover:bg-[#EFF7F5]"
                        >
                            My Orders
                        </Link>
                    </div>

                    <Link
                        href="/"
                        className="mt-5 inline-block text-sm font-medium text-[#617B78] transition hover:text-[#203C3B]"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </main>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense
            fallback={
                <main className="min-h-screen bg-[#F4FAF8] px-4 py-20">
                    <div className="mx-auto max-w-lg rounded-3xl border border-[#D9E7E3] bg-white p-10 text-center">
                        <div className="mx-auto h-12 w-12 animate-pulse rounded-full bg-[#D9E7E3]" />

                        <div className="mx-auto mt-5 h-6 w-40 animate-pulse rounded bg-[#D9E7E3]" />

                        <div className="mx-auto mt-3 h-4 w-64 animate-pulse rounded bg-[#D3E9E5]" />
                    </div>
                </main>
            }
        >
            <SuccessContent />
        </Suspense>
    );
}
