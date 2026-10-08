import Link from "next/link";
import { FiArrowUpRight, FiInstagram, FiMail } from "react-icons/fi";

export default function Footer() {
    return (
        <footer className="border-t border-[#E7E2DA] bg-[#FBF8F3]">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
                <div className="grid gap-10 md:grid-cols-3">
                    {/* Brand */}
                    <div>
                        <Link
                            href="/"
                            className="text-2xl font-bold tracking-tight text-[#26352B]"
                        >
                            Dermiscaa
                        </Link>

                        <p className="mt-4 max-w-sm text-sm leading-6 text-[#687169]">
                            Simple skincare and haircare essentials for your
                            everyday beauty routine.
                        </p>

                        <p className="mt-4 text-sm font-medium text-[#7B8A74]">
                            Pure care. Everyday confidence.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-[#26352B]">
                            Quick Links
                        </h3>

                        <div className="mt-5 flex flex-col gap-3">
                            <Link
                                href="/"
                                className="text-sm text-[#687169] transition-colors hover:text-[#26352B]"
                            >
                                Home
                            </Link>

                            <Link
                                href="/shop"
                                className="text-sm text-[#687169] transition-colors hover:text-[#26352B]"
                            >
                                Shop
                            </Link>

                            <Link
                                href="/cart"
                                className="text-sm text-[#687169] transition-colors hover:text-[#26352B]"
                            >
                                Cart
                            </Link>

                            <Link
                                href="/orders"
                                className="text-sm text-[#687169] transition-colors hover:text-[#26352B]"
                            >
                                My Orders
                            </Link>
                        </div>
                    </div>

                    {/* Connect */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-[#26352B]">
                            Dermiscaa Care
                        </h3>

                        <p className="mt-5 text-sm leading-6 text-[#687169]">
                            Explore our skincare and haircare collection and
                            build a simple everyday routine.
                        </p>
                    </div>
                </div>

                <div className="mt-10 border-t border-[#E7E2DA] pt-6 text-center">
                    <p className="text-xs text-[#687169]">
                        © 2026 Dermiscaa. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
