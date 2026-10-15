import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
export const SESSION_COOKIE = "dermisca-session";
function secret() {
  const value = process.env.JWT_SECRET;
  if (!value || value.length < 32) throw new Error("JWT_SECRET must contain at least 32 characters.");
  return value;
}
export function createToken(userId: string) {
  return jwt.sign({ userId }, secret(), { expiresIn: "7d", algorithm: "HS256" });
}
export function verifyToken(token: string) {
  const value = jwt.verify(token, secret(), { algorithms: ["HS256"] });
  if (typeof value === "string" || typeof value.userId !== "string" || !/^[a-f0-9]{24}$/i.test(value.userId)) throw new Error("Invalid session.");
  return { userId: value.userId };
}
export async function currentUser() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  let id: string;
  try { id = verifyToken(token).userId; } catch { return null; }
  await connectDB();
  return User.findById(id).select("name email phone");
}
export function publicUser(user: { _id: { toString(): string }; name: string; email: string; phone?: string }) {
  return { id: user._id.toString(), name: user.name, email: user.email, phone: user.phone };
}
export function sessionResponse(user: Parameters<typeof publicUser>[0], status = 200) {
  const response = NextResponse.json({ user: publicUser(user) }, { status });
  response.cookies.set(SESSION_COOKIE, createToken(user._id.toString()), {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
export function checkOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const source = new URL(origin);
    // Next can expose an internal hostname in request.url. Compare the browser
    // origin to the actual HTTP Host, without trusting forwarded host headers.
    const host = request.headers.get("host") ?? new URL(request.url).host;
    return (source.protocol === "http:" || source.protocol === "https:") && source.host === host;
  } catch { return false; }
}
