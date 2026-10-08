"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { FiArrowUpRight, FiShoppingBag } from "react-icons/fi";

import { RootState } from "@/store/store";
import { addToCart } from "@/store/cartSlice";

type Product = {
    _id: string;
    name: string;
    price: number;
    category: "skin" | "hair";
    image: string;
    description: string;
    ingredients: string;
    howToUse: string;
    stock: number;
};

type ProductCardProps = {
    product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
    const dispatch = useDispatch();
    const router = useRouter();

    const cartItems = useSelector((state: RootState) => state.cart.items);

    const [isAdded, setIsAdded] = useState(false);

    useEffect(() => {
        const itemInCart = cartItems.some((item) => item._id === product._id);

        setIsAdded(itemInCart);
    }, [cartItems, product._id]);

    function handleCartClick() {
        if (product.stock <= 0) {
            return;
        }

        if (isAdded) {
            router.push("/cart");
            return;
        }

        dispatch(
            addToCart({
                _id: product._id,
                name: product.name,
                price: product.price,
                image: product.image,
                stock: product.stock,
                quantity: 1,
            }),
        );

        setIsAdded(true);
    }

    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E7E2DA] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            {/* Product Image */}
            <Link
                href={`/product/${product._id}`}
                className="relative block aspect-square overflow-hidden bg-[#F6F1EB]"
            >
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </Link>

            {/* Product Content */}
            <div className="flex flex-1 flex-col p-3 sm:p-4">
                <Link href={`/product/${product._id}`}>
                    <h3 className="line-clamp-2 min-h-[42px] text-sm font-semibold leading-5 text-[#26352B] transition-colors hover:text-[#7B8A74] sm:text-base">
                        {product.name}
                    </h3>
                </Link>

                <p className="mt-2 text-base font-semibold text-[#26352B] sm:text-lg">
                    ₹{product.price}
                </p>

                <div className="mt-auto pt-4">
                    {product.stock <= 0 ? (
                        <button
                            type="button"
                            disabled
                            className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-[#E7E2DA] px-3 py-2.5 text-xs font-medium text-[#687169] sm:text-sm"
                        >
                            Out of Stock
                        </button>
                    ) : isAdded ? (
                        <button
                            type="button"
                            onClick={handleCartClick}
                            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#26352B] px-3 py-2.5 text-xs font-medium text-white transition-all hover:bg-[#34473A] sm:text-sm"
                        >
                            <FiShoppingBag size={16} />
                            Go to Cart
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleCartClick}
                            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#7B8A74] px-3 py-2.5 text-xs font-medium text-white transition-all hover:bg-[#687761] sm:text-sm"
                        >
                            <FiShoppingBag size={16} />
                            Add to Cart
                        </button>
                    )}
                </div>

                {/* Product Details Link */}
                <Link
                    href={`/product/${product._id}`}
                    className="mt-2 flex items-center justify-center gap-1 text-xs font-medium text-[#687169] transition-colors hover:text-[#26352B] sm:text-sm"
                >
                    View Details
                    <FiArrowUpRight size={14} />
                </Link>
            </div>
        </article>
    );
}
