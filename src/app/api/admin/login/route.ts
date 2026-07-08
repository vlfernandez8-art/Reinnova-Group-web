import { NextRequest, NextResponse } from "next/server";
import { createSession, getAdminByEmail, verifyAdminPassword } from "@/lib/eventsDataStore";
import { ADMIN_SESSION_COOKIE } from "@/lib/adminAuth";
import { checkRateLimit, getClientIp, isValidSameOriginRequest, rateLimitResponse } from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    if (!isValidSameOriginRequest(request)) {
      return NextResponse.json({ error: "invalid_request" }, { status: 403 });
    }

    const body = (await request.json()) as { email?: string; password?: string };
    const email = body.email?.trim().toLowerCase();
    const password = body.password?.trim();

    if (!email || !password) {
      return NextResponse.json({ error: "missing_credentials" }, { status: 400 });
    }

    const ip = getClientIp(request);
    const limit = checkRateLimit(`admin-login:${ip}:${email}`, 5, 15 * 60 * 1000);
    if (!limit.ok) {
      return rateLimitResponse(limit.retryAfter);
    }

    const admin = await getAdminByEmail(email);
    if (!admin || !verifyAdminPassword(password, admin.passwordHash)) {
      return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
    }

    const session = await createSession(admin.id);
    const response = NextResponse.json({ ok: true });
    response.cookies.set({
      name: ADMIN_SESSION_COOKIE,
      value: session.id,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: Math.max(60, Number(process.env.ADMIN_SESSION_TTL_SECONDS ?? 60 * 60 * 24)),
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  } catch (error) {
    console.error("admin_login_error", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
