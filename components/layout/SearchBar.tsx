"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FiSearch, FiX } from "react-icons/fi";

export default function SearchBar() {
    const router = useRouter();
    const [search, setSearch] = useState("");

    function handleSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const query = search.trim();

        if (query) {
            router.push(`/shop?search=${encodeURIComponent(query)}`);
        } else {
            router.push("/shop");
        }
    }

    function clearSearch() {
        setSearch("");
    }

    return (
        <form
            onSubmit={handleSearch}
            role="search"
            className="flex h-10 w-full min-w-0 items-center rounded-full border border-[#E7E2DA] bg-[#F7F6F1] px-3 transition focus-within:border-[#7B8A74] focus-within:ring-2 focus-within:ring-[#7B8A74]/10 sm:h-11 sm:px-4"
        >
            <FiSearch
                size={18}
                className="shrink-0 text-[#687169]"
                aria-hidden="true"
            />

            <input
                type="search"
                name="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search skincare, haircare..."
                aria-label="Search products"
                className="h-full min-w-0 flex-1 bg-transparent px-2.5 text-sm text-[#26352B] outline-none placeholder:text-[#92998F] sm:px-3"
            />

            {search && (
                <button
                    type="button"
                    onClick={clearSearch}
                    aria-label="Clear search"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#687169] transition hover:bg-[#E7E2DA]"
                >
                    <FiX size={16} />
                </button>
            )}
        </form>
    );
}
