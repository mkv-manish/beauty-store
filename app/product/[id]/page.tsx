import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import ProductDetails from "./ProductDetails";
import Product from "@/models/Product";
import { connectDB } from "@/lib/db";
const getProduct = cache(async (id: string) => {
  if (!/^[a-f0-9]{24}$/i.test(id)) return null;
  await connectDB();
  return Product.findById(id).lean();
});
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const product = await getProduct((await params).id);
  if (!product) return { title: "Product not found | Dermiscaa" };
  return { title: `${product.name} | Dermiscaa`, description: product.description, openGraph: { title: product.name, description: product.description, images: [product.image] } };
}
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const product = await getProduct((await params).id);
  if (!product) notFound();
  return <ProductDetails product={JSON.parse(JSON.stringify(product))} />;
}
