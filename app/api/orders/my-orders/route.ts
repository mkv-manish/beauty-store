import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { verifyToken } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    await connectDB();

    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Please login to view your orders." },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    let decoded;

    try {
      decoded = verifyToken(token);
    } catch {
      return NextResponse.json(
        { message: "Invalid or expired token." },
        { status: 401 }
      );
    }

    const orders = await Order.find({
      user: decoded.userId,
    }).sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch {
    return NextResponse.json(
      {
        message: "Failed to fetch orders.",
      },
      { status: 500 }
    );
  }
}