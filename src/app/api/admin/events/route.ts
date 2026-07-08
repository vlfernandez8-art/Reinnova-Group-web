import { NextRequest, NextResponse } from "next/server";
import { createEvent, getAllEvents } from "@/lib/eventsDataStore";
import { getAdminFromSessionCookie } from "@/lib/adminAuth";
import { type EventPayload } from "@/lib/eventsTypes";
import { isValidSameOriginRequest } from "@/lib/security";

function sanitizeStatus(value: string) {
  return value === "publicado" ? "publicado" : "borrador";
}

export async function GET() {
  const admin = await getAdminFromSessionCookie();
  if (!admin) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const events = await getAllEvents();
  return NextResponse.json({ events });
}

export async function POST(request: NextRequest) {
  const admin = await getAdminFromSessionCookie();
  if (!admin) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!isValidSameOriginRequest(request)) {
    return NextResponse.json({ error: "invalid_request" }, { status: 403 });
  }

  try {
    const body = (await request.json()) as EventPayload;
    const payload: EventPayload = {
      ...body,
      status: sanitizeStatus(body.status),
    };
    const event = await createEvent(payload);
    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error("admin_event_create_error", error);
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }
}
