"use client";
import ErrorNotice from "@/components/ui/ErrorNotice";
import CartLoading from "@/components/cart/CartLoading";
import { useCart } from "@/store/useCart";

import DiscountCode from "@/components/checkout/DiscountCode";
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
import { useDispatch } from "react-redux";
import { clearCart } from "@/store/cartSlice";

export default function CheckoutPage() {
    const router = useRouter();
    const dispatch = useDispatch();

    const { items, hydrated } = useCart();

    const [discountCode, setDiscountCode] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError("");

        if (items.length === 0) {
            setError("Your cart is empty.");
            return;
        }

        try {
            setLoading(true);

            const signature = JSON.stringify({ name, phone, address, discountCode, items: items.map(item => ({ product: item._id, quantity: item.quantity })) });
            let pending: { signature: string; key: string } | null = null;
            try { pending = JSON.parse(sessionStorage.getItem("pending-order") ?? "null"); } catch { /* Replace malformed saved request. */ }
            const requestKey = pending?.signature === signature ? pending.key : crypto.randomUUID();
            sessionStorage.setItem("pending-order", JSON.stringify({ signature, key: requestKey }));
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Idempotency-Key": requestKey,
                },
                body: JSON.stringify({
                    name,
                    phone,
                    address,
                    paymentMethod: "COD",
                    discountCode,

                    items: items.map((item) => ({
                        product: item._id,
                        quantity: item.quantity,
                    })),
                }),
            });

            const data = await response.json();

            if (response.status === 401) { router.push("/login?next=/checkout"); return; }
            if (!response.ok) {
                throw new Error(data.message || "Unable to place order.");
            }

            // Clear cart only after successful order
            sessionStorage.removeItem("pending-order");
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

    if (!hydrated) return <CartLoading />;

    if (items.length === 0) {
        return (
            <main className="min-h-[70vh] bg-[#F4FAF8] px-4 py-20">
                <div className="mx-auto max-w-md rounded-3xl border border-[#D9E7E3] bg-white p-8 text-center sm:p-10">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E5F2EF] text-[#287C78]">
                        <FiCheck size={26} />
                    </div>

                    <h1 className="mt-5 text-2xl font-bold text-[#203C3B]">
                        Your cart is empty
                    </h1>

                    <p className="mt-2 text-sm text-[#617B78]">
                        Add products before proceeding to checkout.
                    </p>

                    <Link
                        href="/shop"
                        className="commerce-action mt-6 inline-flex rounded-full bg-[#287C78] px-6 py-3 text-sm font-semibold text-white"
                    >
                        Go to Shop
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="commerce-page checkout-page min-h-screen bg-[#F4FAF8]">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
                <Link
                    href="/cart"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#617B78] hover:text-[#203C3B]"
                >
                    <FiArrowLeft size={16} />
                    Back to Cart
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4"
                >
                    <h1 className="mt-2 text-2xl font-semibold text-[#203C3B] sm:text-3xl">
                        Checkout
                    </h1>

                    <p className="mt-2 text-sm text-[#617B78]">
                        Enter your details to place your Cash on Delivery order.
                    </p>
                </motion.div>

                <div className="mt-8 grid gap-6 md:grid-cols-[minmax(0,1fr)_300px] lg:grid-cols-[minmax(0,1fr)_350px]">
                    {/* Form */}
                    <motion.form
                        id="delivery-form"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        onSubmit={handleSubmit}
                        className="rounded-2xl border border-[#D9E7E3] bg-white p-5 sm:p-7"
                    >
                        <h2 className="text-lg font-bold text-[#203C3B]">
                            Delivery Details
                        </h2>

                        <div className="mt-6 space-y-5">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="mb-2 block text-sm font-medium text-[#203C3B]"
                                >
                                    Full Name
                                </label>

                                <div className="relative">
                                    <FiUser
                                        size={17}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#287C78]"
                                    />

                                    <input
                                        id="name"
                                        autoComplete="name"
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(event) =>
                                            setName(event.target.value)
                                        }
                                        placeholder="Enter your name"
                                        className="h-12 w-full rounded-xl border border-[#D9E7E3] bg-white pl-11 pr-4 text-sm text-[#203C3B] outline-none focus:border-[#287C78] focus:ring-2 focus:ring-[#E5F2EF]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="phone"
                                    className="mb-2 block text-sm font-medium text-[#203C3B]"
                                >
                                    Phone Number
                                </label>

                                <div className="relative">
                                    <FiPhone
                                        size={17}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#287C78]"
                                    />

                                    <input
                                        id="phone"
                                        type="tel"
                                        autoComplete="tel-national"
                                        inputMode="numeric"
                                        pattern="[6-9][0-9]{9}"
                                        maxLength={10}
                                        required
                                        value={phone}
                                        onChange={(event) =>
                                            setPhone(event.target.value)
                                        }
                                        placeholder="Enter your phone number"
                                        className="h-12 w-full rounded-xl border border-[#D9E7E3] bg-white pl-11 pr-4 text-sm text-[#203C3B] outline-none focus:border-[#287C78] focus:ring-2 focus:ring-[#E5F2EF]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="address"
                                    className="mb-2 block text-sm font-medium text-[#203C3B]"
                                >
                                    Delivery Address
                                </label>

                                <div className="relative">
                                    <FiMapPin
                                        size={17}
                                        className="absolute left-4 top-4 text-[#287C78]"
                                    />

                                    <textarea
                                        id="address"
                                        autoComplete="street-address"
                                        required
                                        value={address}
                                        onChange={(event) =>
                                            setAddress(event.target.value)
                                        }
                                        placeholder="Enter your complete address"
                                        rows={5}
                                        className="w-full resize-none rounded-xl border border-[#D9E7E3] bg-white py-3 pl-11 pr-4 text-sm leading-6 text-[#203C3B] outline-none focus:border-[#287C78] focus:ring-2 focus:ring-[#E5F2EF]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment */}
                        <div className="mt-7 border-t border-[#D9E7E3] pt-7">
                            <h2 className="text-lg font-bold text-[#203C3B]">
                                Payment Method
                            </h2>

                            <div className="mt-4 rounded-xl border border-[#287C78] bg-[#F4FAF8] p-4">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#287C78]">
                                        <div className="h-2.5 w-2.5 rounded-full bg-[#287C78]" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-[#203C3B]">
                                            Cash on Delivery
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-[#617B78]">
                                            Pay when your order is delivered.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <ErrorNotice className="mt-4" title="Your order couldn’t be placed">{error}</ErrorNotice>
                        )}


                    </motion.form>

                    {/* Summary */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="h-fit rounded-2xl border border-[#D9E7E3] bg-white p-5 sm:p-7 lg:sticky lg:top-24"
                    >
                        <h2 className="text-lg font-bold text-[#203C3B]">
                            Order Summary
                        </h2>

                        <div className="mt-6 space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item._id}
                                    className="flex items-center justify-between gap-4"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-[#203C3B]">
                                            {item.name}
                                        </p>

                                        <p className="mt-1 text-xs text-[#617B78]">
                                            Qty: {item.quantity}
                                        </p>
                                    </div>

                                    <p className="shrink-0 text-sm font-semibold text-[#203C3B]">
                                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <DiscountCode items={items} onCode={setDiscountCode} />
                        <p className="mt-3 text-xs leading-5 text-[#617B78]">
                            Pay on delivery. Prices and availability are confirmed when you place your order.
                        </p>
                        <button
                            type="submit"
                            form="delivery-form"
                            disabled={loading}
                            className="commerce-action mt-7 flex h-12 w-full items-center justify-center rounded-xl bg-[#287C78] text-sm font-semibold text-white transition hover:bg-[#246662] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Placing Order..." : "Place Order"}
                        </button>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
