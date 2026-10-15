import { isCategory } from "@/config/categories";
import { configuredDiscounts } from "@/lib/discounts";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { bestSellers, withRatings } from "@/lib/products";
export async function GET(request: Request) {
  try {
    const query = new URL(request.url).searchParams;
    const page = Number(query.get("page") ?? 1);
    const limit = Number(query.get("limit") ?? 12);
    if (!Number.isSafeInteger(page) || page < 1 || page > 10000 || !Number.isSafeInteger(limit) || limit < 1 || limit > 48) return NextResponse.json({ message: "Invalid pagination." }, { status: 400 });
    const category = query.get("category");
    const search = (query.get("search") ?? "").trim().slice(0, 100);
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const ids = query.get("ids")?.split(",");
    if (ids && (ids.length > 48 || ids.some(id => !/^[a-f0-9]{24}$/i.test(id)))) return NextResponse.json({ message: "Invalid wishlist products." }, { status: 400 });
    const filter = { ...(ids ? { _id: { $in: ids } } : {}), ...(isCategory(category) ? { category } : {}), ...(search ? { $or: [{ name: { $regex: escaped, $options: "i" } }, { description: { $regex: escaped, $options: "i" } }] } : {}) };
    const sort = query.get("sort");
    await connectDB();
    const [products, total, featured] = await Promise.all([
      Product.find(filter).sort(sort === "price-asc" ? { price: 1, _id: 1 } : sort === "price-desc" ? { price: -1, _id: 1 } : { createdAt: -1, _id: 1 }).skip((page - 1) * limit).limit(limit).lean(),
      Product.countDocuments(filter),
      query.get("home") === "true" ? bestSellers() : Promise.resolve(undefined),
    ]);
    const [rated, ratedFeatured] = await Promise.all([withRatings(products), featured ? withRatings(featured) : Promise.resolve(undefined)]);
    return NextResponse.json({ products: rated, total, page, pages: Math.ceil(total / limit), ...(featured ? { bestSellers: ratedFeatured, offers: configuredDiscounts().filter(offer => !offer.expiresAt || Date.parse(offer.expiresAt) > Date.now()) } : {}) });
  } catch { return NextResponse.json({ message: "Failed to fetch products." }, { status: 500 }); }
}
