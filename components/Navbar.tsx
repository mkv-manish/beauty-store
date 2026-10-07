"use client";

import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="border-b bg-[#F9F5EE]">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                <Link href="/" className="text-2xl font-bold text-[#26332A]">
                    Natura Glow
                </Link>

                <div className="flex gap-5 text-sm">
                    <Link href="/">Home</Link>
                    <Link href="/shop">Shop</Link>
                    <Link href="/cart">Cart</Link>
                    <Link href="/orders">Orders</Link>
                    <Link href="/login">Login</Link>
                </div>
            </div>
        </nav>
    );
}
