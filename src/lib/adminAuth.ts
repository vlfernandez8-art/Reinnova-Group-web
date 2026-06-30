import { cookies } from "next/headers";
import { type NextRequest, type NextResponse } from "next/server";
import { getAdminBySession, revokeSession } from "@/lib/eventsDataStore";

export const ADMIN_SESSION_COOKIE = "reinnova-admin-session";

export async function getAdminFromSessionCookie() {
  const cookieStore = cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }

  const admin = await getAdminBySession(token);
  if (!admin) {
    return null;
  }

  return admin;
}

export async function clearAdminSessionCookie(request: NextRequest, response: NextResponse) {
  const cookieToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (cookieToken) {
    await revokeSession(cookieToken);
  }

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: "",
    maxAge: 0,
    path: "/",
  });
}
