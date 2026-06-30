import { NextResponse } from "next/server";
import { getEventById, getRegistrations } from "@/lib/eventsDataStore";
import { getAdminFromSessionCookie } from "@/lib/adminAuth";

export async function GET(_: Request, context: { params: { id: string } }) {
  const admin = await getAdminFromSessionCookie();
  if (!admin) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const event = await getEventById(context.params.id);
  if (!event) {
    return NextResponse.json({ error: "event_not_found" }, { status: 404 });
  }

  const registrations = await getRegistrations(context.params.id);
  return NextResponse.json({ event, registrations });
}
