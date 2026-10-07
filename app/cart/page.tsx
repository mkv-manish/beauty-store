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
            <main className="px-4 py-20 text-center">
                <h1 className="text-3xl font-bold text-[#26332A]">
                    Your Cart is Empty
                </h1>

                <p className="mt-3 text-gray-500">
                    Add some products to your cart.
                </p>

                <Link
                    href="/shop"
                    className="mt-6 inline-block rounded-lg bg-[#71806A] px-6 py-3 text-white"
                >
                    Continue Shopping
                </Link>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-5xl px-4 py-10">
            <h1 className="text-3xl font-bold text-[#26332A]">Shopping Cart</h1>

            <div className="mt-8 space-y-4">
                {items.map((item) => (
                    <div
                        key={item._id}
                        className="flex gap-4 rounded-2xl border bg-white p-4"
                    >
                        <Image
                            src={item.image}
                            alt={item.name}
                            width={100}
                            height={100}
                            className="h-24 w-24 rounded-xl object-cover"
                        />

                        <div className="flex-1">
                            <h2 className="font-semibold">{item.name}</h2>

                            <p className="mt-1">₹{item.price}</p>

                            <div className="mt-3 flex items-center gap-3">
                                <button
                                    onClick={() =>
                                        dispatch(
                                            updateQuantity({
                                                id: item._id,
                                                quantity: Math.max(
                                                    1,
                                                    item.quantity - 1,
                                                ),
                                            }),
                                        )
                                    }
                                    className="h-8 w-8 rounded border"
                                >
                                    -
                                </button>

                                <span>{item.quantity}</span>

                                <button
                                    onClick={() =>
                                        dispatch(
                                            updateQuantity({
                                                id: item._id,
                                                quantity: Math.min(
                                                    item.stock,
                                                    item.quantity + 1,
                                                ),
                                            }),
                                        )
                                    }
                                    className="h-8 w-8 rounded border"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => dispatch(removeFromCart(item._id))}
                            className="text-sm text-red-500"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-8 rounded-2xl bg-[#F9F5EE] p-6">
                <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>₹{total}</span>
                </div>

                <Link
                    href="/checkout"
                    className="mt-5 block rounded-lg bg-[#71806A] py-3 text-center text-white"
                >
                    Proceed to Checkout
                </Link>
            </div>
        </main>
    );
}
