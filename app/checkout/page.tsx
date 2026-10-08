"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
    FiArrowLeft,
    FiCheck,
    FiMapPin,
    FiPhone,
    FiUser,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "@/store/cartSlice";
import type { RootState } from "@/store/store";

export default function CheckoutPage() {
    const router = useRouter();
    const dispatch = useDispatch();

    const items = useSelector((state: RootState) => state.cart.items);

    const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/login");
            return;
        }

        if (items.length === 0) {
            setError("Your cart is empty.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name,
                    phone,
                    address,
                    paymentMethod: "COD",
                    items: items.map((item) => ({
                        product: item._id,
                        quantity: item.quantity,
                    })),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to place order.");
            }

            dispatch(clearCart());

            router.push(`/checkout/success?orderId=${data.order._id}`);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Unable to place order.",
            );
        } finally {
            setLoading(false);
        }
    }

    if (items.length === 0) {
        return (
            <main className="min-h-[70vh] bg-[#FBF8F3] px-4 py-20">
                <div className="mx-auto max-w-md rounded-3xl border border-[#E7E2DA] bg-white p-8 text-center sm:p-10">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EFDCD6] text-[#7B8A74]">
                        <FiCheck size={26} />
                    </div>

                    <h1 className="mt-5 text-2xl font-bold text-[#26352B]">
                        Your cart is empty
                    </h1>

                    <p className="mt-2 text-sm text-[#687169]">
                        Add products before proceeding to checkout.
                    </p>

                    <Link
                        href="/shop"
                        className="mt-6 inline-flex rounded-full bg-[#7B8A74] px-6 py-3 text-sm font-semibold text-white"
                    >
                        Go to Shop
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#FBF8F3]">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
                <Link
                    href="/cart"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#687169] hover:text-[#26352B]"
                >
                    <FiArrowLeft size={16} />
                    Back to Cart
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6"
                >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7B8A74]">
                        Almost There
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-[#26352B] sm:text-4xl">
                        Checkout
                    </h1>

                    <p className="mt-2 text-sm text-[#687169]">
                        Enter your details to place your Cash on Delivery order.
                    </p>
                </motion.div>

                <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_350px]">
                    {/* Form */}
                    <motion.form
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        onSubmit={handleSubmit}
                        className="rounded-2xl border border-[#E7E2DA] bg-white p-5 sm:p-7"
                    >
                        <h2 className="text-lg font-bold text-[#26352B]">
                            Delivery Details
                        </h2>

                        <div className="mt-6 space-y-5">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="mb-2 block text-sm font-medium text-[#26352B]"
                                >
                                    Full Name
                                </label>

                                <div className="relative">
                                    <FiUser
                                        size={17}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7B8A74]"
                                    />

                                    <input
                                        id="name"
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(event) =>
                                            setName(event.target.value)
                                        }
                                        placeholder="Enter your name"
                                        className="h-12 w-full rounded-xl border border-[#E1DBD2] bg-white pl-11 pr-4 text-sm text-[#26352B] outline-none focus:border-[#7B8A74] focus:ring-2 focus:ring-[#EFDCD6]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="phone"
                                    className="mb-2 block text-sm font-medium text-[#26352B]"
                                >
                                    Phone Number
                                </label>

                                <div className="relative">
                                    <FiPhone
                                        size={17}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7B8A74]"
                                    />

                                    <input
                                        id="phone"
                                        type="tel"
                                        required
                                        value={phone}
                                        onChange={(event) =>
                                            setPhone(event.target.value)
                                        }
                                        placeholder="Enter your phone number"
                                        className="h-12 w-full rounded-xl border border-[#E1DBD2] bg-white pl-11 pr-4 text-sm text-[#26352B] outline-none focus:border-[#7B8A74] focus:ring-2 focus:ring-[#EFDCD6]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="address"
                                    className="mb-2 block text-sm font-medium text-[#26352B]"
                                >
                                    Delivery Address
                                </label>

                                <div className="relative">
                                    <FiMapPin
                                        size={17}
                                        className="absolute left-4 top-4 text-[#7B8A74]"
                                    />

                                    <textarea
                                        id="address"
                                        required
                                        value={address}
                                        onChange={(event) =>
                                            setAddress(event.target.value)
                                        }
                                        placeholder="Enter your complete address"
                                        rows={5}
                                        className="w-full resize-none rounded-xl border border-[#E1DBD2] bg-white py-3 pl-11 pr-4 text-sm leading-6 text-[#26352B] outline-none focus:border-[#7B8A74] focus:ring-2 focus:ring-[#EFDCD6]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment */}
                        <div className="mt-7 border-t border-[#E7E2DA] pt-7">
                            <h2 className="text-lg font-bold text-[#26352B]">
                                Payment Method
                            </h2>

                            <div className="mt-4 rounded-xl border border-[#7B8A74] bg-[#F7F6F1] p-4">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#7B8A74]">
                                        <div className="h-2.5 w-2.5 rounded-full bg-[#7B8A74]" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-[#26352B]">
                                            Cash on Delivery
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-[#687169]">
                                            Pay when your order is delivered.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-7 flex h-12 w-full items-center justify-center rounded-xl bg-[#7B8A74] text-sm font-semibold text-white transition hover:bg-[#687761] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Placing Order..." : "Place Order"}
                        </button>
                    </motion.form>

                    {/* Summary */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="h-fit rounded-2xl border border-[#E7E2DA] bg-white p-5 sm:p-7 lg:sticky lg:top-24"
                    >
                        <h2 className="text-lg font-bold text-[#26352B]">
                            Order Summary
                        </h2>

                        <div className="mt-6 space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item._id}
                                    className="flex items-center justify-between gap-4"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-[#26352B]">
                                            {item.name}
                                        </p>

                                        <p className="mt-1 text-xs text-[#687169]">
                                            Qty: {item.quantity}
                                        </p>
                                    </div>

                                    <p className="shrink-0 text-sm font-semibold text-[#26352B]">
                                        ₹{item.price * item.quantity}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="my-6 border-t border-[#E7E2DA]" />

                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-[#26352B]">
                                Total
                            </span>

                            <span className="text-xl font-bold text-[#26352B]">
                                ₹{total}
                            </span>
                        </div>

                        <p className="mt-3 text-xs leading-5 text-[#687169]">
                            Final order total is calculated securely from the
                            product prices stored in the database.
                        </p>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
