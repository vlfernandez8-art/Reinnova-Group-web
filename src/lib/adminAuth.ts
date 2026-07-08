import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { type NextRequest, type NextResponse } from "next/server";
import { getAdminBySession, revokeSession } from "@/lib/eventsDataStore";

export const ADMIN_SESSION_COOKIE = "reinnova-admin-session";
const SESSION_VERSION = "v2";

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD_PEPPER;
  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_SESSION_SECRET_REQUIRED");
  }

  return secret || "local-dev-admin-session-secret";
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function createAdminSessionToken(admin: { id: string; email: string }) {
  const payload = Buffer.from(
    JSON.stringify({
      adminUserId: admin.id,
      email: admin.email,
      expiresAt: Date.now() + Math.max(60, Number(process.env.ADMIN_SESSION_TTL_SECONDS ?? 60 * 60 * 24)) * 1000,
    }),
  ).toString("base64url");

  return `${SESSION_VERSION}.${payload}.${sign(payload)}`;
}

function readSignedAdminSession(token: string) {
  const [version, payload, signature] = token.split(".");
  if (version !== SESSION_VERSION || !payload || !signature) {
    return null;
  }

  if (!safeEqual(signature, sign(payload))) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      adminUserId?: string;
      email?: string;
      expiresAt?: number;
    };

    if (!parsed.adminUserId || !parsed.email || !parsed.expiresAt || parsed.expiresAt < Date.now()) {
      return null;
    }

    return {
      id: parsed.adminUserId,
      email: parsed.email,
      passwordHash: "",
      createdAt: "",
    };
  } catch {
    return null;
  }
}

export async function getAdminFromSessionCookie() {
  const cookieStore = cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }

  const signedAdmin = readSignedAdminSession(token);
  if (signedAdmin) {
    return signedAdmin;
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
