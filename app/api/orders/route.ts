import { configuredDiscounts, discountFor } from "@/lib/discounts";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { checkOrigin, currentUser } from "@/lib/auth";
import { cartLines, text, phone, InputError } from "@/lib/validation";
export async function POST(request: Request) {
  if (!checkOrigin(request)) return NextResponse.json({ message: "Invalid origin." }, { status: 403 });
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ message: "Please login to place an order." }, { status: 401 });
    const body = await request.json();
    const name = text(body?.name, "Name", 100);
    const mobile = phone(body?.phone);
    const address = text(body?.address, "Address", 1000);
    const lines = cartLines(body?.items);
    const requestKey = text(request.headers.get("Idempotency-Key"), "Request key", 100);
    const previous = await Order.findOne({ user: user._id, requestKey });
    if (previous) return NextResponse.json({ order: previous });
    const session = await mongoose.startSession();
    let order;
    try {
      await session.withTransaction(async () => {
        const items = [];
        let total = 0;
        for (const line of lines) {
          // Conditional decrement and transaction prevent overselling and roll
          // back every reservation if any item or order write fails.
          const product = await Product.findOneAndUpdate({ _id: line.product, stock: { $gte: line.quantity } }, { $inc: { stock: -line.quantity } }, { new: true, session });
          if (!product) throw new InputError("A product is unavailable or has insufficient stock. Please review your cart.");
          total += product.price * line.quantity;
          items.push({ product: product._id, name: product.name, price: product.price, quantity: line.quantity, image: product.image });
        }
        const offer = discountFor(body?.discountCode, total, configuredDiscounts());
        [order] = await Order.create([{ user: user._id, requestKey, name, phone: mobile, address, items, subtotal: total, discount: offer.discount, discountCode: offer.code, total: Math.round((total - offer.discount) * 100) / 100, paymentMethod: "COD", status: "Pending" }], { session });
      });
    } finally { await session.endSession(); }
    return NextResponse.json({ message: "Order placed successfully.", order }, { status: 201 });
  } catch (error) {
    if ((error as { code?: number }).code === 11000) {
      const user = await currentUser();
      const order = user && await Order.findOne({ user: user._id, requestKey: request.headers.get("Idempotency-Key") });
      if (order) return NextResponse.json({ order });
    }
    if (error instanceof InputError || error instanceof SyntaxError) return NextResponse.json({ message: error.message }, { status: 400 });
    console.error("Order failed", error);
    return NextResponse.json({ message: "Unable to place order. Please try again." }, { status: 500 });
  }
}
