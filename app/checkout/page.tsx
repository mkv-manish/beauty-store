"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

import { clearCart } from "@/store/cartSlice";
import { RootState } from "@/store/store";

export default function CheckoutPage() {
    const dispatch = useDispatch();

    const items = useSelector((state: RootState) => state.cart.items);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError("");

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
                },
                body: JSON.stringify({
                    name,
                    phone,
                    address,
                    items: items.map((item) => ({
                        productId: item._id,
                        quantity: item.quantity,
                    })),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to place order.");
            }

            dispatch(clearCart());

            window.location.href = `/checkout/success?id=${data.order._id}`;
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to place order.",
            );
        } finally {
            setLoading(false);
        }
    }

    if (items.length === 0) {
        return (
            <main className="min-h-[60vh] px-4 py-20">
                <div className="mx-auto max-w-xl text-center">
                    <h1 className="text-3xl font-bold text-[#26332A]">
                        Your Cart is Empty
                    </h1>

                    <p className="mt-3 text-gray-500">
                        Add products to your cart before checkout.
                    </p>

                    <Link
                        href="/shop"
                        className="mt-6 inline-block rounded-lg bg-[#71806A] px-6 py-3 font-medium text-white"
                    >
                        Go to Shop
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-4xl px-4 py-10 md:py-14">
            <h1 className="text-3xl font-bold text-[#26332A]">Checkout</h1>

            <p className="mt-2 text-gray-500">
                Enter your details to place your order.
            </p>

            <div className="mt-8 grid gap-8 md:grid-cols-2">
                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl border bg-white p-6"
                >
                    <h2 className="text-xl font-semibold text-[#26332A]">
                        Delivery Details
                    </h2>

                    <div className="mt-6">
                        <label
                            htmlFor="name"
                            className="mb-2 block text-sm font-medium text-[#26332A]"
                        >
                            Name
                        </label>

                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Enter your name"
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#71806A]"
                        />
                    </div>

                    <div className="mt-5">
                        <label
                            htmlFor="phone"
                            className="mb-2 block text-sm font-medium text-[#26332A]"
                        >
                            Phone
                        </label>

                        <input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(event) => setPhone(event.target.value)}
                            placeholder="Enter your phone number"
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#71806A]"
                        />
                    </div>

                    <div className="mt-5">
                        <label
                            htmlFor="address"
                            className="mb-2 block text-sm font-medium text-[#26332A]"
                        >
                            Address
                        </label>

                        <textarea
                            id="address"
                            value={address}
                            onChange={(event) => setAddress(event.target.value)}
                            placeholder="Enter your complete address"
                            rows={4}
                            required
                            className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#71806A]"
                        />
                    </div>

                    <div className="mt-6 rounded-xl bg-[#F9F5EE] p-4">
                        <p className="text-sm font-medium text-[#26332A]">
                            Payment Method
                        </p>

                        <div className="mt-3 flex items-center gap-3">
                            <input
                                type="radio"
                                id="cod"
                                name="payment"
                                checked
                                readOnly
                            />

                            <label
                                htmlFor="cod"
                                className="text-sm text-gray-700"
                            >
                                Cash on Delivery (COD)
                            </label>
                        </div>
                    </div>

                    {error && (
                        <p
                            role="alert"
                            className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-600"
                        >
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-6 w-full rounded-xl bg-[#71806A] px-6 py-3.5 font-medium text-white hover:bg-[#5C6B55] disabled:cursor-not-allowed disabled:bg-gray-400"
                    >
                        {loading ? "Placing Order..." : "Place Order"}
                    </button>
                </form>

                <div className="h-fit rounded-2xl bg-[#F9F5EE] p-6">
                    <h2 className="text-xl font-semibold text-[#26332A]">
                        Order Summary
                    </h2>

                    <div className="mt-6 space-y-4">
                        {items.map((item) => (
                            <div
                                key={item._id}
                                className="flex justify-between gap-4 text-sm"
                            >
                                <div>
                                    <p className="font-medium text-[#26332A]">
                                        {item.name}
                                    </p>

                                    <p className="mt-1 text-gray-500">
                                        ₹{item.price} × {item.quantity}
                                    </p>
                                </div>

                                <p className="font-medium text-[#26332A]">
                                    ₹{item.price * item.quantity}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 border-t border-gray-300 pt-5">
                        <div className="flex justify-between text-lg font-bold text-[#26332A]">
                            <span>Total</span>
                            <span>₹{total}</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
