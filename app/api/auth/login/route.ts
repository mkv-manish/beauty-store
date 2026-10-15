import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { checkOrigin, sessionResponse } from "@/lib/auth";
import { allowAuth } from "@/lib/rate-limit";
import { email, phone, text, InputError } from "@/lib/validation";
const dummyHash = bcrypt.hashSync("unused-comparison-password", 12);
export async function POST(request: Request) {
  if (!checkOrigin(request)) return NextResponse.json({ message: "Invalid origin." }, { status: 403 });
  try {
    const body = await request.json();
    const raw = text(body?.identifier, "Email or mobile number", 254);
    const identifier = raw.includes("@") ? email(raw) : phone(raw);
    if (typeof body?.password !== "string" || !body.password || new TextEncoder().encode(body.password).length > 72) throw new InputError("Enter a valid password.");
    if (!await allowAuth(identifier, "login")) return NextResponse.json({ message: "Too many attempts. Try again in 15 minutes." }, { status: 429, headers: { "Retry-After": "900" } });
    const user = await User.findOne(identifier.includes("@") ? { email: identifier } : { phone: identifier });
    const match = await bcrypt.compare(body.password, user?.password ?? dummyHash);
    if (!user || !match) return NextResponse.json({ message: "Invalid email/mobile number or password." }, { status: 401 });
    return sessionResponse(user);
  } catch (error) {
    if (error instanceof InputError || error instanceof SyntaxError) return NextResponse.json({ message: error.message }, { status: 400 });
    return NextResponse.json({ message: "Login failed." }, { status: 500 });
  }
}
