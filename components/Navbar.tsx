"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FiMenu, FiX, FiShoppingBag, FiLogOut, FiUser } from "react-icons/fi";
type User = { name: string; email: string };
export default function Navbar() {
    const [user, setUser] = useState<User | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch {
                localStorage.removeItem("user");
            }
        }
    }, []);
    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
    }
    function closeMenu() {
        setMenuOpen(false);
    }
    return (
        <header className="relative z-50 w-full border-b border-[#E7E2DA] bg-[#FBF8F3]">
            {" "}
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
                {" "}
                {/* Logo */}{" "}
                <Link
                    href="/"
                    onClick={closeMenu}
                    className="flex items-center"
                >
                    {" "}
                    <img
                        src="/images/logo/logo.png"
                        alt="Dermisca"
                        className="h-16 w-auto object-contain"
                    />{" "}
                </Link>{" "}
                {/* Desktop Navigation */}{" "}
                <nav className="hidden items-center gap-7 md:flex">
                    {" "}
                    <Link
                        href="/"
                        className="text-sm font-medium text-[#26352B] transition-colors hover:text-[#7B8A74]"
                    >
                        {" "}
                        Home{" "}
                    </Link>{" "}
                    <Link
                        href="/shop"
                        className="text-sm font-medium text-[#26352B] transition-colors hover:text-[#7B8A74]"
                    >
                        {" "}
                        Shop{" "}
                    </Link>{" "}
                    <Link
                        href="/cart"
                        className="flex items-center gap-2 text-sm font-medium text-[#26352B] transition-colors hover:text-[#7B8A74]"
                    >
                        {" "}
                        <FiShoppingBag size={17} /> Cart{" "}
                    </Link>{" "}
                    {user && (
                        <Link
                            href="/orders"
                            className="text-sm font-medium text-[#26352B] transition-colors hover:text-[#7B8A74]"
                        >
                            {" "}
                            My Orders{" "}
                        </Link>
                    )}{" "}
                    {user ? (
                        <button
                            type="button"
                            onClick={logout}
                            className="flex items-center gap-2 text-sm font-medium text-[#8C625D] transition-colors hover:text-red-600"
                        >
                            {" "}
                            <FiLogOut size={16} /> Logout{" "}
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            className="rounded-full bg-[#7B8A74] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#687761] hover:shadow-sm"
                        >
                            {" "}
                            Login{" "}
                        </Link>
                    )}{" "}
                </nav>{" "}
                {/* Mobile Menu Button */}{" "}
                <button
                    type="button"
                    onClick={() => setMenuOpen((value) => !value)}
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#DDD7CE] bg-white text-[#26352B] transition hover:bg-[#F4EEE7] md:hidden"
                >
                    {" "}
                    {menuOpen ? <FiX size={21} /> : <FiMenu size={21} />}{" "}
                </button>{" "}
            </div>{" "}
            {/* Mobile Menu */}{" "}
            <AnimatePresence>
                {" "}
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden border-t border-[#E7E2DA] bg-white md:hidden"
                    >
                        {" "}
                        <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
                            {" "}
                            <div className="flex flex-col gap-1">
                                {" "}
                                <Link
                                    href="/"
                                    onClick={closeMenu}
                                    className="rounded-xl px-4 py-3 text-sm font-medium text-[#26352B] hover:bg-[#FBF8F3]"
                                >
                                    {" "}
                                    Home{" "}
                                </Link>{" "}
                                <Link
                                    href="/shop"
                                    onClick={closeMenu}
                                    className="rounded-xl px-4 py-3 text-sm font-medium text-[#26352B] hover:bg-[#FBF8F3]"
                                >
                                    {" "}
                                    Shop{" "}
                                </Link>{" "}
                                <Link
                                    href="/cart"
                                    onClick={closeMenu}
                                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#26352B] hover:bg-[#FBF8F3]"
                                >
                                    {" "}
                                    <FiShoppingBag size={17} /> Cart{" "}
                                </Link>{" "}
                                {user && (
                                    <>
                                        {" "}
                                        <Link
                                            href="/orders"
                                            onClick={closeMenu}
                                            className="rounded-xl px-4 py-3 text-sm font-medium text-[#26352B] hover:bg-[#FBF8F3]"
                                        >
                                            {" "}
                                            My Orders{" "}
                                        </Link>{" "}
                                        <div className="my-2 border-t border-[#EEE9E2]" />{" "}
                                        <div className="flex items-center gap-3 px-4 py-3">
                                            {" "}
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EFDCD6] text-[#26352B]">
                                                {" "}
                                                <FiUser size={17} />{" "}
                                            </div>{" "}
                                            <div className="min-w-0">
                                                {" "}
                                                <p className="text-xs text-[#687169]">
                                                    {" "}
                                                    Signed in as{" "}
                                                </p>{" "}
                                                <p className="truncate text-sm font-medium text-[#26352B]">
                                                    {" "}
                                                    {user.name}{" "}
                                                </p>{" "}
                                            </div>{" "}
                                        </div>{" "}
                                        <button
                                            type="button"
                                            onClick={logout}
                                            className="mt-1 flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-[#8C625D] hover:bg-[#FBF8F3]"
                                        >
                                            {" "}
                                            <FiLogOut size={17} /> Logout{" "}
                                        </button>{" "}
                                    </>
                                )}{" "}
                                {!user && (
                                    <Link
                                        href="/login"
                                        onClick={closeMenu}
                                        className="mt-2 rounded-xl bg-[#7B8A74] px-4 py-3 text-center text-sm font-medium text-white"
                                    >
                                        {" "}
                                        Login{" "}
                                    </Link>
                                )}{" "}
                            </div>{" "}
                        </nav>{" "}
                    </motion.div>
                )}{" "}
            </AnimatePresence>{" "}
        </header>
    );
}
