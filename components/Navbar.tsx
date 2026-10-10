"use client";

import Link from "next/link";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiMenu, FiX, FiShoppingBag, FiLogOut, FiUser } from "react-icons/fi";
import SearchBar from "@/components/layout/SearchBar";
import CategoryNav from "@/components/layout/CategoryNav";

type User = {
    name: string;
    email: string;
};

export default function Navbar() {
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [authLoaded, setAuthLoaded] = useState(false);

    useEffect(() => {
        function loadUser() {
            const savedUser = localStorage.getItem("user");

            if (!savedUser) {
                setUser(null);
                setAuthLoaded(true);
                return;
            }

            try {
                const parsedUser = JSON.parse(savedUser);

                if (!parsedUser || typeof parsedUser !== "object") {
                    throw new Error("Invalid user data");
                }

                setUser({
                    name: parsedUser.name || "User",
                    email: parsedUser.email || "",
                });
            } catch {
                localStorage.removeItem("user");
                setUser(null);
            }

            setAuthLoaded(true);
        }

        loadUser();

        window.addEventListener("auth-change", loadUser);
        window.addEventListener("storage", loadUser);

        return () => {
            window.removeEventListener("auth-change", loadUser);
            window.removeEventListener("storage", loadUser);
        };
    }, []);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";

        return () => {
            document.body.style.overflow = "";
        };
    }, [menuOpen]);

    function closeMenu() {
        setMenuOpen(false);
    }

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.dispatchEvent(new Event("auth-change"));

        setUser(null);
        closeMenu();

        router.replace("/");
        router.refresh();
    }

    return (
        <header className="relative z-50 border-b border-[#E7E2DA] bg-white">
            {/* Main header */}
            <div className="mx-auto flex min-h-[72px] max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:gap-6 lg:px-8">
                {/* Logo */}
                <Link
                    href="/"
                    onClick={closeMenu}
                    aria-label="Dermiscaa home"
                    className="flex shrink-0 items-center"
                >
                    <Image
                        src="/images/logo/logo.png"
                        alt="Dermiscaa"
                        width={160}
                        height={60}
                        priority
                        className="h-11 w-auto object-contain sm:h-12"
                    />
                </Link>

                {/* Search */}
                <div className="min-w-0 flex-1">
                    <SearchBar />
                </div>

                {/* Desktop account and cart */}
                <div className="hidden shrink-0 items-center gap-4 lg:flex">
                    {authLoaded && user ? (
                        <div className="flex max-w-[155px] items-center gap-2">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E7EBDD] text-[#52634F]">
                                <FiUser size={18} />
                            </span>

                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-[#26352B]">
                                    {user.name}
                                </p>
                                <button
                                    type="button"
                                    onClick={logout}
                                    className="text-xs text-[#687169] transition hover:text-[#8C625D]"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        authLoaded && (
                            <Link
                                href="/login"
                                className="rounded-lg bg-[#26352B] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3C5141]"
                            >
                                Login
                            </Link>
                        )
                    )}

                    <Link
                        href="/cart"
                        className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-[#26352B] transition hover:bg-[#F5F3ED]"
                    >
                        <FiShoppingBag size={21} />
                        <span>Cart</span>
                    </Link>
                </div>

                {/* Mobile actions */}
                <div className="flex shrink-0 items-center gap-1 lg:hidden">
                    <Link
                        href="/cart"
                        aria-label="Shopping cart"
                        className="flex h-10 w-10 items-center justify-center rounded-full text-[#26352B] hover:bg-[#F5F3ED]"
                    >
                        <FiShoppingBag size={21} />
                    </Link>

                    <button
                        type="button"
                        onClick={() => setMenuOpen((open) => !open)}
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={menuOpen}
                        className="flex h-10 w-10 items-center justify-center rounded-full text-[#26352B] hover:bg-[#F5F3ED]"
                    >
                        {menuOpen ? <FiX size={23} /> : <FiMenu size={23} />}
                    </button>
                </div>
            </div>

            {/* Category navigation */}
            <Suspense
                fallback={
                    <div className="h-12 border-t border-[#E7E2DA] bg-white" />
                }
            >
                <CategoryNav />
            </Suspense>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="fixed inset-0 z-[100] bg-black/30 lg:hidden">
                    <button
                        type="button"
                        aria-label="Close menu"
                        onClick={closeMenu}
                        className="absolute inset-0 h-full w-full cursor-default"
                    />

                    <aside className="absolute right-0 top-0 flex h-full w-[min(85%,360px)] flex-col overflow-y-auto bg-[#FBF8F3] shadow-xl">
                        <div className="flex items-center justify-between border-b border-[#E7E2DA] px-5 py-4">
                            <Link href="/" onClick={closeMenu}>
                                <Image
                                    src="/images/logo/logo.png"
                                    alt="Dermiscaa"
                                    width={145}
                                    height={55}
                                    className="h-10 w-auto object-contain"
                                />
                            </Link>

                            <button
                                type="button"
                                onClick={closeMenu}
                                aria-label="Close menu"
                                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#EEEAE1]"
                            >
                                <FiX size={22} />
                            </button>
                        </div>

                        <div className="border-b border-[#E7E2DA] px-5 py-6">
                            {authLoaded && user ? (
                                <>
                                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E7EBDD] text-[#52634F]">
                                        <FiUser size={21} />
                                    </div>
                                    <p className="mt-3 text-lg font-semibold text-[#26352B]">
                                        {user.name}
                                    </p>
                                    {user.email && (
                                        <p className="mt-1 break-all text-sm text-[#687169]">
                                            {user.email}
                                        </p>
                                    )}
                                </>
                            ) : (
                                <>
                                    <p className="text-xl font-semibold text-[#26352B]">
                                        Welcome to Dermiscaa
                                    </p>
                                    <p className="mt-2 text-sm text-[#687169]">
                                        Pure care. Everyday confidence.
                                    </p>
                                </>
                            )}
                        </div>

                        <nav className="px-5">
                            {[
                                { label: "Home", href: "/" },
                                { label: "Shop all products", href: "/shop" },
                                ...(user
                                    ? [{ label: "My Orders", href: "/orders" }]
                                    : []),
                                { label: "Cart", href: "/cart" },
                            ].map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={closeMenu}
                                    className="flex min-h-14 items-center justify-between border-b border-[#E7E2DA] text-sm font-medium text-[#26352B] transition hover:text-[#7B8A74]"
                                >
                                    {item.label}
                                    <span className="text-lg text-[#9AA08F]">
                                        ›
                                    </span>
                                </Link>
                            ))}
                        </nav>

                        <div className="mt-auto px-5 py-6">
                            {authLoaded &&
                                (user ? (
                                    <button
                                        type="button"
                                        onClick={logout}
                                        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#E7E2DA] text-sm font-semibold text-[#8C625D] transition hover:bg-[#F1E8E2]"
                                    >
                                        <FiLogOut size={17} />
                                        Logout
                                    </button>
                                ) : (
                                    <Link
                                        href="/login"
                                        onClick={closeMenu}
                                        className="flex min-h-12 w-full items-center justify-center rounded-xl bg-[#26352B] text-sm font-semibold text-white transition hover:bg-[#3C5141]"
                                    >
                                        Login / Sign up
                                    </Link>
                                ))}
                        </div>
                    </aside>
                </div>
            )}
        </header>
    );
}
