import { NextResponse } from "next/server";
import Order from "@/models/Order";
import { currentUser } from "@/lib/auth";
export async function GET() {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ message: "Please login to view your orders." }, { status: 401 });
    return NextResponse.json(await Order.find({ user: user._id }).sort({ createdAt: -1 }).limit(100), { headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ message: "Failed to fetch orders." }, { status: 500 }); }
}
