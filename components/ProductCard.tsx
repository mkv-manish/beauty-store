import Image from "next/image";
import Link from "next/link";

type Product = {
    _id: string;
    name: string;
    price: number;
    category: string;
    image: string;
};

export default function ProductCard({ product }: { product: Product }) {
    return (
        <div className="overflow-hidden rounded-2xl border bg-white">
            <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={400}
                className="h-64 w-full object-cover"
            />

            <div className="p-4">
                <p className="text-sm capitalize text-gray-500">
                    {product.category} care
                </p>

                <h2 className="mt-1 font-semibold text-[#26332A]">
                    {product.name}
                </h2>

                <p className="mt-2 font-semibold">₹{product.price}</p>

                <Link
                    href={`/product/${product._id}`}
                    className="mt-4 block rounded-lg bg-[#71806A] py-2 text-center text-white"
                >
                    View Product
                </Link>
            </div>
        </div>
    );
}
