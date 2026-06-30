import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, clearAdminSessionCookie } from "@/lib/adminAuth";

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ ok: true });
  await clearAdminSessionCookie(request, response);
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: "",
    maxAge: 0,
    path: "/",
  });
  return response;
}
