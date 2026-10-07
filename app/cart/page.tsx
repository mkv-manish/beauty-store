"use client";

import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/store/store";
import { removeFromCart, updateQuantity } from "@/store/cartSlice";

export default function CartPage() {
    const dispatch = useDispatch();

    const items = useSelector((state: RootState) => state.cart.items);

    const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );

    if (items.length === 0) {
        return (
            <main className="min-h-[60vh] px-4 py-20">
                <div className="mx-auto max-w-2xl text-center">
                    <h1 className="text-3xl font-bold text-[#26332A]">
                        Your Cart is Empty
                    </h1>

                    <p className="mt-3 text-gray-500">
                        You have not added any products to your cart yet.
                    </p>

                    <Link
                        href="/shop"
                        className="mt-7 inline-block rounded-lg bg-[#71806A] px-6 py-3 font-medium text-white hover:bg-[#5C6B55]"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-5xl px-4 py-10 md:py-14">
            <div>
                <h1 className="text-3xl font-bold text-[#26332A]">
                    Shopping Cart
                </h1>

                <p className="mt-2 text-gray-500">
                    Review your products before checkout.
                </p>
            </div>

            <div className="mt-8 space-y-4">
                {items.map((item) => (
                    <div
                        key={item._id}
                        className="flex flex-col gap-4 rounded-2xl border bg-white p-4 sm:flex-row sm:items-center"
                    >
                        <Image
                            src={item.image}
                            alt={item.name}
                            width={120}
                            height={120}
                            className="h-28 w-full rounded-xl object-cover sm:h-24 sm:w-24"
                        />

                        <div className="flex-1">
                            <h2 className="font-semibold text-[#26332A]">
                                {item.name}
                            </h2>

                            <p className="mt-1 text-gray-600">₹{item.price}</p>

                            <p className="mt-1 text-xs text-gray-500">
                                Stock: {item.stock}
                            </p>

                            <div className="mt-4 flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        dispatch(
                                            updateQuantity({
                                                id: item._id,
                                                quantity: item.quantity - 1,
                                            }),
                                        )
                                    }
                                    disabled={item.quantity <= 1}
                                    className="h-9 w-9 rounded-lg border border-gray-300 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    -
                                </button>

                                <span className="min-w-6 text-center font-medium">
                                    {item.quantity}
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        dispatch(
                                            updateQuantity({
                                                id: item._id,
                                                quantity: item.quantity + 1,
                                            }),
                                        )
                                    }
                                    disabled={item.quantity >= item.stock}
                                    className="h-9 w-9 rounded-lg border border-gray-300 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-5 sm:flex-col sm:items-end">
                            <p className="font-semibold text-[#26332A]">
                                ₹{item.price * item.quantity}
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    dispatch(removeFromCart(item._id))
                                }
                                className="text-sm text-red-500 hover:text-red-600"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 rounded-2xl bg-[#F9F5EE] p-6">
                <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-[#26332A]">
                        Total
                    </span>

                    <span className="text-xl font-bold text-[#26332A]">
                        ₹{total}
                    </span>
                </div>

                <Link
                    href="/checkout"
                    className="mt-5 block rounded-xl bg-[#71806A] px-6 py-3.5 text-center font-medium text-white hover:bg-[#5C6B55]"
                >
                    Proceed to Checkout
                </Link>
            </div>
        </main>
    );
}
