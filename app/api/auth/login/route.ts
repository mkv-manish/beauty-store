import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { createToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, password } = body;

    if (
      typeof identifier !== "string" ||
      !identifier.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return NextResponse.json(
        { message: "Email or mobile number and password are required." },
        { status: 400 }
      );
    }

    const value = identifier.trim();
    const isEmail = value.includes("@");

    if (!isEmail && !/^[6-9]\d{9}$/.test(value)) {
      return NextResponse.json(
        { message: "Enter a valid email or 10-digit mobile number." },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne(
      isEmail
        ? { email: value.toLowerCase() }
        : { phone: value }
    );

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email/mobile number or password." },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Invalid email/mobile number or password." },
        { status: 401 }
      );
    }

    const token = createToken(user._id.toString());

    return NextResponse.json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Login failed." },
      { status: 500 }
    );
  }
}
