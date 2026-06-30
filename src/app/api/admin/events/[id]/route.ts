import { NextRequest, NextResponse } from "next/server";
import { deleteEvent, getEventById, updateEvent } from "@/lib/eventsDataStore";
import { getAdminFromSessionCookie } from "@/lib/adminAuth";
import { type EventPayload } from "@/lib/eventsTypes";

function sanitizeStatus(value: string) {
  return value === "publicado" ? "publicado" : "borrador";
}

export async function GET(_: NextRequest, context: { params: { id: string } }) {
  const admin = await getAdminFromSessionCookie();
  if (!admin) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const event = await getEventById(context.params.id);
  if (!event) {
    return NextResponse.json({ error: "event_not_found" }, { status: 404 });
  }
  return NextResponse.json({ event });
}

export async function PATCH(request: NextRequest, context: { params: { id: string } }) {
  const admin = await getAdminFromSessionCookie();
  if (!admin) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<EventPayload>;
    const payload: Partial<EventPayload> = {
      ...body,
      ...(typeof body.status === "string" ? { status: sanitizeStatus(body.status) } : {}),
    };
    const event = await updateEvent(context.params.id, payload);
    return NextResponse.json({ event });
  } catch (error) {
    return NextResponse.json({ error: "invalid_payload", message: String(error) }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, context: { params: { id: string } }) {
  const admin = await getAdminFromSessionCookie();
  if (!admin) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    await deleteEvent(context.params.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "delete_error", message: String(error) }, { status: 400 });
  }
}
