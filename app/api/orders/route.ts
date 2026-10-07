import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Order from "@/models/Order";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    const { name, phone, address, items } = body;

    if (!name || !phone || !address || !items?.length) {
      return NextResponse.json(
        {
          message:
            "Name, phone, address and cart items are required.",
        },
        { status: 400 }
      );
    }

    const productIds = items.map(
      (item: { productId: string }) => item.productId
    );

    const products = await Product.find({
      _id: { $in: productIds },
    });

    if (products.length !== items.length) {
      return NextResponse.json(
        { message: "One or more products were not found." },
        { status: 400 }
      );
    }

    let total = 0;

    const orderItems = [];

    for (const item of items) {
      const product = products.find(
        (product) =>
          product._id.toString() === item.productId
      );

      if (!product) {
        return NextResponse.json(
          { message: "Product not found." },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          {
            message: `${product.name} does not have enough stock.`,
          },
          { status: 400 }
        );
      }

      total += product.price * item.quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
      });
    }

    const order = await Order.create({
      name,
      phone,
      address,
      items: orderItems,
      total,
      paymentMethod: "COD",
      status: "Pending",
    });

    for (const item of items) {
      const product = products.find(
        (product) =>
          product._id.toString() === item.productId
      );

      if (product) {
        product.stock -= item.quantity;
        await product.save();
      }
    }

    return NextResponse.json(
      {
        message: "Order placed successfully.",
        order,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: "Failed to place order." },
      { status: 500 }
    );
  }
}