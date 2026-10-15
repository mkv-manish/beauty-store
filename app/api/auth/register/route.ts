import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { checkOrigin, sessionResponse } from "@/lib/auth";
import { allowAuth } from "@/lib/rate-limit";
import { email, phone, text, password, InputError } from "@/lib/validation";
export async function POST(request: Request) {
  if (!checkOrigin(request)) return NextResponse.json({ message: "Invalid origin." }, { status: 403 });
  try {
    const body = await request.json();
    const name = text(body?.name, "Name", 100);
    const normalizedEmail = email(body?.email);
    const normalizedPhone = phone(body?.phone);
    const plainPassword = password(body?.password);
    if (!await allowAuth(normalizedEmail, "register")) return NextResponse.json({ message: "Too many attempts. Try again in 15 minutes." }, { status: 429, headers: { "Retry-After": "900" } });
    if (await User.exists({ $or: [{ email: normalizedEmail }, { phone: normalizedPhone }] })) return NextResponse.json({ message: "Email or mobile number is already registered." }, { status: 409 });
    const user = await User.create({ name, email: normalizedEmail, phone: normalizedPhone, password: await bcrypt.hash(plainPassword, 12) });
    return sessionResponse(user, 201);
  } catch (error) {
    if (error instanceof InputError || error instanceof SyntaxError) return NextResponse.json({ message: error.message }, { status: 400 });
    if ((error as { code?: number }).code === 11000) return NextResponse.json({ message: "Email or mobile number is already registered." }, { status: 409 });
    return NextResponse.json({ message: "Registration failed." }, { status: 500 });
  }
}
