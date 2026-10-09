"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
    FiMenu,
    FiX,
    FiShoppingBag,
    FiLogOut,
    FiUser,
    FiChevronRight,
} from "react-icons/fi";

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

        // Load saved login state on initial render.
        loadUser();

        // Update immediately after login, registration or logout.
        window.addEventListener("auth-change", loadUser);

        // Sync changes made in another browser tab.
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

    useEffect(() => {
        if (!menuOpen) return;

        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setMenuOpen(false);
            }
        }

        window.addEventListener("keydown", handleEscape);

        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, [menuOpen]);

    function closeMenu() {
        setMenuOpen(false);
    }

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Notify Navbar and any other component listening for auth changes.
        window.dispatchEvent(new Event("auth-change"));

        setUser(null);
        setMenuOpen(false);

        router.replace("/");
        router.refresh();
    }

    const linkClass =
        "text-sm font-medium text-[#26352B] transition hover:text-[#7B8A74]";

    const mobileLinkClass =
        "flex min-h-[54px] items-center justify-between border-b border-[#EAE5DB] py-3 text-[15px] font-medium text-[#26352B] transition-colors hover:text-[#71806A]";

    return (
        <header className="relative z-50 w-full border-b border-[#E7E2DA] bg-[#FBF8F3]">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
                {/* Logo */}
                <Link
                    href="/"
                    onClick={closeMenu}
                    className="flex shrink-0 items-center"
                >
                    <img
                        src="/images/logo/logo.png"
                        alt="Dermisca"
                        className="h-[58px] w-auto object-contain"
                    />
                </Link>

                {/* Desktop navigation */}
                <nav className="hidden items-center gap-6 lg:flex">
                    <Link href="/" className={linkClass}>
                        Home
                    </Link>

                    <Link href="/shop" className={linkClass}>
                        Shop
                    </Link>

                    <Link
                        href="/cart"
                        className={`flex items-center gap-2 ${linkClass}`}
                    >
                        <FiShoppingBag size={17} />
                        Cart
                    </Link>

                    {authLoaded && user && (
                        <Link href="/orders" className={linkClass}>
                            My Orders
                        </Link>
                    )}

                    {authLoaded && user && (
                        <div className="flex items-center gap-2.5 border-l border-[#E7E2DA] pl-4">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E7EBDD] text-[#52634F]">
                                <FiUser size={18} />
                            </div>

                            <div className="max-w-[145px]">
                                <p className="truncate text-sm font-semibold text-[#26352B]">
                                    {user.name}
                                </p>
                                <p className="truncate text-xs text-[#777D74]">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    )}

                    {authLoaded &&
                        (user ? (
                            <button
                                type="button"
                                onClick={logout}
                                className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-[#8C625D] transition hover:bg-[#F1E8E2] hover:text-red-700"
                            >
                                <FiLogOut size={16} />
                                Logout
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="rounded-full bg-[#7B8A74] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#687761]"
                            >
                                Login
                            </Link>
                        ))}
                </nav>

                {/* Mobile menu button */}
                <button
                    type="button"
                    onClick={() => setMenuOpen((open) => !open)}
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={menuOpen}
                    aria-controls="mobile-navigation"
                    className="flex h-10 w-10 items-center justify-center rounded-full text-[#26352B] transition hover:bg-[#F0EDE5] lg:hidden"
                >
                    {menuOpen ? <FiX size={23} /> : <FiMenu size={23} />}
                </button>
            </div>

            {/* Mobile drawer */}
            <AnimatePresence>
                {menuOpen && (
                    <>
                        <motion.button
                            type="button"
                            aria-label="Close navigation"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeMenu}
                            className="fixed inset-0 z-[60] cursor-default bg-[#1D281F]/40 lg:hidden"
                        />

                        <motion.aside
                            id="mobile-navigation"
                            role="dialog"
                            aria-modal="true"
                            aria-label="Mobile navigation"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{
                                type: "tween",
                                duration: 0.28,
                                ease: "easeOut",
                            }}
                            className="fixed right-0 top-0 z-[70] flex h-[100dvh] w-[min(86vw,360px)] flex-col overflow-y-auto bg-[#FBF8F3] shadow-2xl lg:hidden"
                        >
                            {/* Drawer header */}
                            <div className="flex min-h-[72px] items-center justify-between border-b border-[#E7E2DA] px-5">
                                <Link href="/" onClick={closeMenu}>
                                    <img
                                        src="/images/logo/logo.png"
                                        alt="Dermisca"
                                        className="h-[54px] w-auto object-contain"
                                    />
                                </Link>

                                <button
                                    type="button"
                                    onClick={closeMenu}
                                    aria-label="Close menu"
                                    className="flex h-10 w-10 items-center justify-center rounded-full text-[#26352B] hover:bg-[#EEEAE1]"
                                >
                                    <FiX size={22} />
                                </button>
                            </div>

                            {/* Account information */}
                            <div className="px-6 pb-5 pt-7">
                                {authLoaded && user ? (
                                    <>
                                        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#E7EBDD] text-[#52634F]">
                                            <FiUser size={20} />
                                        </div>

                                        <p className="mt-1 break-words text-xl font-semibold text-[#26352B]">
                                            {user.name}
                                        </p>

                                        {user.email && (
                                            <p className="mt-1 break-all text-sm text-[#777D74]">
                                                {user.email}
                                            </p>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#7B8A74]">
                                            DERMISCA
                                        </p>

                                        <h2 className="mt-2 text-2xl font-medium leading-snug tracking-tight text-[#26352B]">
                                            A little care,
                                            <br />
                                            every day.
                                        </h2>

                                        <p className="mt-2 text-sm leading-6 text-[#777D74]">
                                            Natural care for your skin and hair.
                                        </p>
                                    </>
                                )}
                            </div>

                            {/* Mobile links */}
                            <nav className="px-6">
                                <Link
                                    href="/"
                                    onClick={closeMenu}
                                    className={mobileLinkClass}
                                >
                                    Home
                                    <FiChevronRight
                                        size={18}
                                        className="text-[#9AA08F]"
                                    />
                                </Link>

                                <Link
                                    href="/shop"
                                    onClick={closeMenu}
                                    className={mobileLinkClass}
                                >
                                    Shop all products
                                    <FiChevronRight
                                        size={18}
                                        className="text-[#9AA08F]"
                                    />
                                </Link>

                                <Link
                                    href="/cart"
                                    onClick={closeMenu}
                                    className={mobileLinkClass}
                                >
                                    <span className="flex items-center gap-3">
                                        <FiShoppingBag
                                            size={19}
                                            className="text-[#7B8A74]"
                                        />
                                        Cart
                                    </span>
                                    <FiChevronRight
                                        size={18}
                                        className="text-[#9AA08F]"
                                    />
                                </Link>

                                {authLoaded && user && (
                                    <Link
                                        href="/orders"
                                        onClick={closeMenu}
                                        className={mobileLinkClass}
                                    >
                                        My Orders
                                        <FiChevronRight
                                            size={18}
                                            className="text-[#9AA08F]"
                                        />
                                    </Link>
                                )}
                            </nav>

                            {/* Login / Logout */}
                            <div className="mt-auto px-6 pb-8 pt-7">
                                {authLoaded && user ? (
                                    <button
                                        type="button"
                                        onClick={logout}
                                        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-[#DCD5C9] text-sm font-medium text-[#8C625D] transition hover:bg-[#F1E8E2]"
                                    >
                                        <FiLogOut size={17} />
                                        Logout
                                    </button>
                                ) : (
                                    <Link
                                        href="/login"
                                        onClick={closeMenu}
                                        className="flex min-h-12 w-full items-center justify-center rounded-full bg-[#7B8A74] px-5 text-sm font-semibold text-white transition hover:bg-[#687761]"
                                    >
                                        Login / Sign up
                                        <FiChevronRight
                                            size={17}
                                            className="ml-2"
                                        />
                                    </Link>
                                )}

                                <p className="mt-5 text-center text-[10px] uppercase tracking-[0.18em] text-[#9A9B90]">
                                    Thoughtful care, naturally.
                                </p>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
}
