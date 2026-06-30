import { NextResponse } from "next/server";
import { buildCsvForRegistrations, getEventById } from "@/lib/eventsDataStore";
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

  const csv = await buildCsvForRegistrations(context.params.id);
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename=\"inscriptos-${event.id}.csv\"`,
    },
  });
}
