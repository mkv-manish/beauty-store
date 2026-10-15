import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Review from "@/models/Review";
import Product from "@/models/Product";
import { connectDB } from "@/lib/db";
import { checkOrigin, currentUser } from "@/lib/auth";
import { text, InputError } from "@/lib/validation";
import { allowAuth } from "@/lib/rate-limit";
type Context = { params: Promise<{ id: string }> };
export async function GET(request: Request, { params }: Context) {
  const { id } = await params;
  if (!/^[a-f0-9]{24}$/i.test(id)) return NextResponse.json({ message: "Invalid product." }, { status: 400 });
  const page = Number(new URL(request.url).searchParams.get("page") ?? 1);
  if (!Number.isSafeInteger(page) || page < 1 || page > 10000) return NextResponse.json({ message: "Invalid page." }, { status: 400 });
  try {
    await connectDB();
    if (!await Product.exists({ _id: id })) return NextResponse.json({ message: "Product not found." }, { status: 404 });
    const [reviews, stats] = await Promise.all([
      Review.find({ product: id }).select("name rating comment createdAt").sort({ createdAt: -1, _id: -1 }).skip((page - 1) * 10).limit(10).lean(),
      Review.aggregate([{ $match: { product: new mongoose.Types.ObjectId(id) } }, { $group: { _id: null, rating: { $avg: "$rating" }, count: { $sum: 1 } } }]),
    ]);
    return NextResponse.json({ reviews, rating: stats[0]?.rating ?? 0, count: stats[0]?.count ?? 0, page, pages: Math.ceil((stats[0]?.count ?? 0) / 10) });
  } catch { return NextResponse.json({ message: "Unable to load reviews." }, { status: 500 }); }
}
export async function POST(request: Request, { params }: Context) {
  if (!checkOrigin(request)) return NextResponse.json({ message: "Invalid origin." }, { status: 403 });
  try {
    const { id } = await params;
    if (!/^[a-f0-9]{24}$/i.test(id)) throw new InputError("Invalid product.");
    const user = await currentUser();
    if (!user) return NextResponse.json({ message: "Please sign in to write a review." }, { status: 401 });
    const body = await request.json();
    if (!Number.isInteger(body?.rating) || body.rating < 1 || body.rating > 5) throw new InputError("Choose a rating from 1 to 5.");
    const comment = text(body?.comment, "Review", 1000);
    if (!await Product.exists({ _id: id })) return NextResponse.json({ message: "Product not found." }, { status: 404 });
    if (!await allowAuth(user._id.toString(), "review")) return NextResponse.json({ message: "Too many updates. Please try again in 15 minutes." }, { status: 429 });
    await Review.findOneAndUpdate({ product: id, user: user._id }, { $set: { rating: body.rating, comment, name: user.name } }, { upsert: true, runValidators: true });
    return NextResponse.json({ message: "Your review has been saved." });
  } catch (error) { return NextResponse.json({ message: error instanceof InputError ? error.message : "Unable to save your review." }, { status: error instanceof InputError || error instanceof SyntaxError ? 400 : 500 }); }
}
