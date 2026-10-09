import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

export default function Footer() {
    return (
        <footer className="border-t border-[#E7E2DA] bg-[#FBF8F3]">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
                <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
                    {/* Brand */}
                    <div>
                        <Link
                            href="/"
                            aria-label="Dermisca home"
                            className="inline-flex items-center"
                        >
                            <Image
                                src="/images/logo/logo.png"
                                alt="Dermisca"
                                width={160}
                                height={55}
                                className="h-16 w-auto object-contain"
                            />
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

                        <div className="mt-5 flex flex-col items-start gap-3">
                            {[
                                { label: "Home", href: "/" },
                                { label: "Shop", href: "/shop" },
                                { label: "Cart", href: "/cart" },
                                { label: "My Orders", href: "/orders" },
                            ].map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-sm text-[#687169] transition-colors hover:text-[#26352B]"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Brand Description */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-[#26352B]">
                            Dermisca Care
                        </h3>

                        <p className="mt-5 max-w-sm text-sm leading-6 text-[#687169]">
                            Explore our skincare and haircare collection and
                            build a simple everyday routine.
                        </p>

                        <Link
                            href="/shop"
                            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#7B8A74] transition-colors hover:text-[#26352B]"
                        >
                            Explore Collection
                            <FiArrowUpRight size={16} />
                        </Link>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-10 border-t border-[#E7E2DA] pt-6 text-center">
                    <p className="text-xs text-[#687169]">
                        © {new Date().getFullYear()} Dermisca. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
