import Link from "next/link";

export default function Home() {
    return (
        <main>
            {/* Hero */}
            <section className="bg-[#F9F5EE] px-6 py-20 text-center">
                <p className="mb-3 text-sm uppercase tracking-widest text-[#71806A]">
                    Natural Beauty Care
                </p>

                <h1 className="mx-auto max-w-3xl text-4xl font-bold text-[#26332A] md:text-6xl">
                    Simple care for beautiful skin and hair.
                </h1>

                <p className="mx-auto mt-5 max-w-xl text-gray-600">
                    Discover gentle skincare and haircare products made for your
                    everyday beauty routine.
                </p>

                <Link
                    href="/shop"
                    className="mt-8 inline-block rounded-full bg-[#71806A] px-7 py-3 text-white"
                >
                    Shop Now
                </Link>
            </section>

            {/* Categories */}
            <section className="mx-auto max-w-6xl px-4 py-16">
                <h2 className="text-center text-3xl font-bold text-[#26332A]">
                    Shop by Category
                </h2>

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                    <Link
                        href="/shop?category=skin"
                        className="rounded-2xl bg-[#E8CFC8] p-10 text-center"
                    >
                        <h3 className="text-2xl font-semibold">Skin Care</h3>
                        <p className="mt-2 text-gray-700">
                            Gentle products for healthy skin.
                        </p>
                    </Link>

                    <Link
                        href="/shop?category=hair"
                        className="rounded-2xl bg-[#DCE5D5] p-10 text-center"
                    >
                        <h3 className="text-2xl font-semibold">Hair Care</h3>
                        <p className="mt-2 text-gray-700">
                            Everyday care for beautiful hair.
                        </p>
                    </Link>
                </div>
            </section>

            {/* Why Us */}
            <section className="bg-[#F9F5EE] px-4 py-16 text-center">
                <h2 className="text-3xl font-bold text-[#26332A]">
                    Why Choose Natura Glow?
                </h2>

                <div className="mx-auto mt-8 grid max-w-5xl gap-6 md:grid-cols-3">
                    <div>
                        <h3 className="font-semibold">Natural Care</h3>
                        <p className="mt-2 text-sm text-gray-600">
                            Products selected for everyday beauty care.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold">Quality Products</h3>
                        <p className="mt-2 text-sm text-gray-600">
                            Carefully selected skincare and haircare products.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold">Easy Shopping</h3>
                        <p className="mt-2 text-sm text-gray-600">
                            Simple and convenient shopping experience.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
