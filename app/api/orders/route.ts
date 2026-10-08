import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { verifyToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await connectDB();

    // Check authorization
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          message: "Please login to place an order.",
        },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    let decoded: { userId: string };

    try {
      decoded = verifyToken(token) as { userId: string };
    } catch {
      return NextResponse.json(
        {
          message: "Invalid or expired token.",
        },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json();

    const {
      name,
      phone,
      address,
      items,
    } = body;

    // Basic validation
    if (
      !name ||
      !phone ||
      !address ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        {
          message: "Name, phone, address and cart items are required.",
        },
        { status: 400 }
      );
    }

    /*
      Checkout sends:

      {
        product: item._id,
        quantity: item.quantity
      }

      We also support productId just in case
      another page sends that field.
    */

    const productIds = items.map((item: any) => {
      return item.product || item.productId;
    });

    // Check invalid product IDs
    for (const productId of productIds) {
      if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
        return NextResponse.json(
          {
            message: "Invalid product ID.",
          },
          { status: 400 }
        );
      }
    }

    // Get products from database
    const products = await Product.find({
      _id: {
        $in: productIds,
      },
    });

    // Create quick product lookup
    const productMap = new Map(
      products.map((product) => [
        product._id.toString(),
        product,
      ])
    );

    // Check all products exist
    for (const productId of productIds) {
      if (!productMap.has(productId.toString())) {
        return NextResponse.json(
          {
            message: "One or more products were not found.",
          },
          { status: 400 }
        );
      }
    }

    let total = 0;

    const orderItems = [];

    // Prepare order items
    for (const item of items) {
      const productId = item.product || item.productId;
      const quantity = Number(item.quantity);

      if (!quantity || quantity < 1) {
        return NextResponse.json(
          {
            message: "Invalid product quantity.",
          },
          { status: 400 }
        );
      }

      const product = productMap.get(productId.toString());

      if (!product) {
        return NextResponse.json(
          {
            message: "Product not found.",
          },
          { status: 400 }
        );
      }

      // Check stock
      if (product.stock < quantity) {
        return NextResponse.json(
          {
            message: `${product.name} does not have enough stock.`,
          },
          { status: 400 }
        );
      }

      // Calculate total using database price
      total += product.price * quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image,
      });
    }

    // Create order
    const order = await Order.create({
      user: decoded.userId,
      name,
      phone,
      address,
      items: orderItems,
      total,
      paymentMethod: "COD",
      status: "Pending",
    });

    // Reduce product stock
    for (const item of items) {
      const productId = item.product || item.productId;
      const quantity = Number(item.quantity);

      const product = productMap.get(productId.toString());

      if (product) {
        product.stock -= quantity;
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
  } catch (error) {
    console.error("PLACE ORDER ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to place order.",
      },
      { status: 500 }
    );
  }
}