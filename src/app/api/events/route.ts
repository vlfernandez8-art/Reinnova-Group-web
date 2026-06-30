import { NextResponse } from "next/server";
import { getPublishedEvents } from "@/lib/eventsDataStore";

export async function GET() {
  const events = await getPublishedEvents();
  return NextResponse.json({ events });
}
