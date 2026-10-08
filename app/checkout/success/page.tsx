"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CheckoutSuccessPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("id");

    return (
        <main className="min-h-[60vh] px-4 py-20">
            <div className="mx-auto max-w-xl rounded-2xl border bg-white p-8 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E5EDDF]">
                    <span className="text-2xl text-[#71806A]">✓</span>
                </div>

                <h1 className="mt-6 text-3xl font-bold text-[#26332A]">
                    Order Placed Successfully!
                </h1>

                <p className="mt-3 leading-6 text-gray-600">
                    Thank you for shopping with Dermisca. Your order has been
                    placed successfully.
                </p>

                {orderId && (
                    <div className="mt-6 rounded-lg bg-[#F9F5EE] p-4">
                        <p className="text-sm text-gray-500">Order ID</p>

                        <p className="mt-1 break-all font-medium text-[#26332A]">
                            {orderId}
                        </p>
                    </div>
                )}

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Link
                        href="/shop"
                        className="rounded-lg bg-[#71806A] px-6 py-3 font-medium text-white hover:bg-[#5C6B55]"
                    >
                        Continue Shopping
                    </Link>

                    <Link
                        href="/orders"
                        className="rounded-lg border border-[#71806A] px-6 py-3 font-medium text-[#71806A]"
                    >
                        My Orders
                    </Link>
                </div>
            </div>
        </main>
    );
}
