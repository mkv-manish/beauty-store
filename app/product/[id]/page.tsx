"use client";

import Image from "next/image";
import { use, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/cartSlice";

type Product = {
    _id: string;
    name: string;
    price: number;
    category: string;
    image: string;
    description: string;
    ingredients: string;
    howToUse: string;
    stock: number;
};

export default function ProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const dispatch = useDispatch();

    const [product, setProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function getProduct() {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(`/api/products/${id}`);

                if (!response.ok) {
                    throw new Error("Unable to load product.");
                }

                const data = await response.json();
                setProduct(data);
            } catch {
                setError("Unable to load product. Please try again.");
            } finally {
                setLoading(false);
            }
        }

        getProduct();
    }, [id]);

    function handleAddToCart() {
        if (!product || product.stock < 1) {
            return;
        }

        dispatch(
            addToCart({
                _id: product._id,
                name: product.name,
                price: product.price,
                image: product.image,
                stock: product.stock,
                quantity,
            }),
        );

        setMessage("Product added to cart successfully.");
    }

    if (loading) {
        return (
            <main className="px-4 py-20 text-center">
                <p className="text-gray-600">Loading product...</p>
            </main>
        );
    }

    if (error || !product) {
        return (
            <main className="px-4 py-20 text-center">
                <h1 className="text-2xl font-semibold text-[#26332A]">
                    Product not found
                </h1>

                <p className="mt-3 text-gray-600">
                    {error || "This product is not available."}
                </p>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-6xl px-4 py-10 md:py-16">
            <div className="grid gap-8 md:grid-cols-2 md:gap-12">
                {/* Product Image */}
                <div className="overflow-hidden rounded-2xl bg-[#F9F5EE]">
                    <Image
                        src={product.image}
                        alt={product.name}
                        width={600}
                        height={600}
                        priority
                        className="aspect-square w-full object-cover"
                    />
                </div>

                {/* Product Information */}
                <div className="flex flex-col justify-center">
                    <p className="text-sm capitalize tracking-wide text-[#71806A]">
                        {product.category} care
                    </p>

                    <h1 className="mt-3 text-3xl font-bold text-[#26332A] md:text-4xl">
                        {product.name}
                    </h1>

                    <p className="mt-4 text-2xl font-semibold text-[#26332A]">
                        ₹{product.price}
                    </p>

                    <p className="mt-5 leading-7 text-gray-600">
                        {product.description}
                    </p>

                    <div className="mt-6 border-t pt-5">
                        <h2 className="font-semibold text-[#26332A]">
                            Ingredients
                        </h2>

                        <p className="mt-2 leading-6 text-gray-600">
                            {product.ingredients}
                        </p>
                    </div>

                    <div className="mt-5 border-t pt-5">
                        <h2 className="font-semibold text-[#26332A]">
                            How to Use
                        </h2>

                        <p className="mt-2 leading-6 text-gray-600">
                            {product.howToUse}
                        </p>
                    </div>

                    <p className="mt-5 text-sm text-gray-500">
                        {product.stock > 0
                            ? `${product.stock} items available`
                            : "Currently out of stock"}
                    </p>

                    {/* Quantity Selector */}
                    <div className="mt-5">
                        <p className="mb-3 text-sm font-medium text-[#26332A]">
                            Quantity
                        </p>

                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() =>
                                    setQuantity((value) =>
                                        Math.max(1, value - 1),
                                    )
                                }
                                disabled={quantity <= 1}
                                aria-label="Decrease quantity"
                                className="h-10 w-10 rounded-lg border border-gray-300 disabled:opacity-40"
                            >
                                -
                            </button>

                            <span className="min-w-6 text-center font-medium">
                                {quantity}
                            </span>

                            <button
                                type="button"
                                onClick={() =>
                                    setQuantity((value) =>
                                        Math.min(product.stock, value + 1),
                                    )
                                }
                                disabled={quantity >= product.stock}
                                aria-label="Increase quantity"
                                className="h-10 w-10 rounded-lg border border-gray-300 disabled:opacity-40"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Add to Cart */}
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={product.stock < 1}
                        className="mt-6 w-full rounded-xl bg-[#71806A] px-6 py-3.5 font-medium text-white transition hover:bg-[#5C6B55] disabled:cursor-not-allowed disabled:bg-gray-400"
                    >
                        {product.stock < 1 ? "Out of Stock" : "Add to Cart"}
                    </button>

                    {message && (
                        <p
                            role="status"
                            className="mt-3 rounded-lg bg-[#E5EDDF] p-3 text-sm text-[#26332A]"
                        >
                            {message}
                        </p>
                    )}
                </div>
            </div>
        </main>
    );
}
