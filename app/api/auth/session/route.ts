import { NextResponse } from "next/server";
import { checkOrigin, currentUser, publicUser, SESSION_COOKIE } from "@/lib/auth";
export async function GET() {
  try {
    const user = await currentUser();
    return NextResponse.json({ user: user ? publicUser(user) : null }, { headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ message: "Unable to load session." }, { status: 503 }); }
}
export async function DELETE(request: Request) {
  if (!checkOrigin(request)) return NextResponse.json({ message: "Invalid origin." }, { status: 403 });
  const response = NextResponse.json({ message: "Logged out." });
  response.cookies.set(SESSION_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
  return response;
}
