import { NextResponse } from "next/server";
import { getAdminFromSessionCookie } from "@/lib/adminAuth";

export async function GET() {
  const admin = await getAdminFromSessionCookie();
  if (!admin) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    admin: { id: admin.id, email: admin.email },
  });
}
