import { Suspense } from "react";
import ShopContent from "./ShopContent";

export default function ShopPage() {
    return (
        <Suspense
            fallback={
                <main className="min-h-screen bg-[#FBF8F3]">
                    <section className="border-b border-[#E7E2DA] bg-white">
                        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
                            <div className="h-3 w-40 animate-pulse rounded bg-[#EDE8E0]" />
                            <div className="mt-4 h-10 w-48 animate-pulse rounded bg-[#EDE8E0]" />
                            <div className="mt-4 h-4 max-w-lg animate-pulse rounded bg-[#EDE8E0]" />
                        </div>
                    </section>

                    <section className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 py-10 sm:gap-5 sm:px-6 lg:grid-cols-4 lg:gap-6 lg:px-8">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <div
                                key={index}
                                className="overflow-hidden rounded-2xl border border-[#E7E2DA] bg-white"
                            >
                                <div className="aspect-square animate-pulse bg-[#EDE8E0]" />

                                <div className="space-y-3 p-4">
                                    <div className="h-3 w-20 animate-pulse rounded bg-[#EDE8E0]" />
                                    <div className="h-5 w-3/4 animate-pulse rounded bg-[#EDE8E0]" />
                                    <div className="h-5 w-16 animate-pulse rounded bg-[#EDE8E0]" />
                                    <div className="h-10 animate-pulse rounded-xl bg-[#EDE8E0]" />
                                </div>
                            </div>
                        ))}
                    </section>
                </main>
            }
        >
            <ShopContent />
        </Suspense>
    );
}
