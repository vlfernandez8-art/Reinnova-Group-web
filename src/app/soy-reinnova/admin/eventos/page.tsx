import { AdminEventsManager } from "@/components/admin/AdminEventsManager";
import { getAllEvents } from "@/lib/eventsDataStore";

export const revalidate = 0;

export default async function AdminEventsPage() {
  const events = await getAllEvents();
  return <AdminEventsManager initialEvents={events} />;
}
