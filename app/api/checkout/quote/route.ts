import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { cartLines, InputError } from "@/lib/validation";
import { configuredDiscounts, discountFor } from "@/lib/discounts";
import { checkOrigin } from "@/lib/auth";
export async function POST(request: Request) {
  if (!checkOrigin(request)) return NextResponse.json({ message: "Invalid origin." }, { status: 403 });
  try {
    const body = await request.json();
    const lines = cartLines(body?.items);
    await connectDB();
    const products = await Product.find({ _id: { $in: lines.map(line => line.product) } });
    let subtotal = 0;
    for (const line of lines) {
      const product = products.find(product => product._id.toString() === line.product);
      if (!product || product.stock < line.quantity) throw new InputError("An item is unavailable or has insufficient stock. Please update your cart.");
      subtotal += product.price * line.quantity;
    }
    const offer = discountFor(body?.discountCode, subtotal, configuredDiscounts());
    return NextResponse.json({ subtotal, ...offer, total: Math.round((subtotal - offer.discount) * 100) / 100 });
  } catch (error) {
    return NextResponse.json({ message: error instanceof InputError ? error.message : "Unable to check prices. Please try again." }, { status: error instanceof InputError || error instanceof SyntaxError ? 400 : 500 });
  }
}
