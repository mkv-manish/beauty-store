import { connectDB } from "@/lib/db";
import mongoose from "mongoose";
import Review from "@/models/Review";
import Product from "@/models/Product";
import Order from "@/models/Order";
const BEST_SELLER_LIMIT = 4;
export async function bestSellers() {
  await connectDB();
  const ranking = await Order.aggregate([
    { $match: { status: { $in: ["Confirmed", "Delivered"] } } },
    { $unwind: "$items" }, { $group: { _id: "$items.product", sold: { $sum: "$items.quantity" } } },
    { $sort: { sold: -1, _id: 1 } },
    { $lookup: { from: Product.collection.name, localField: "_id", foreignField: "_id", as: "product" } },
    { $unwind: "$product" }, { $limit: BEST_SELLER_LIMIT }, { $replaceRoot: { newRoot: "$product" } },
  ]);
  if (ranking.length >= BEST_SELLER_LIMIT) return ranking;
  // Fill the display with real catalogue products while sales history grows;
  // never create sales counts or duplicate the ranked products.
  const picks = await Product.find({ _id: { $nin: ranking.map(product => product._id) } }).sort({ stock: -1, createdAt: -1, _id: 1 }).limit(BEST_SELLER_LIMIT - ranking.length).lean();
  return [...ranking, ...picks];
}

export async function withRatings<T extends { _id: unknown }>(products: T[]) {
  if (!products.length) return [];
  const stats = await Review.aggregate([
    { $match: { product: { $in: products.map(product => new mongoose.Types.ObjectId(String(product._id))) } } },
    { $group: { _id: "$product", rating: { $avg: "$rating" }, reviewCount: { $sum: 1 } } },
  ]);
  return products.map(product => {
    const stat = stats.find(stat => String(stat._id) === String(product._id));
    return { ...product, rating: stat?.rating ?? 0, reviewCount: stat?.reviewCount ?? 0 };
  });
}
