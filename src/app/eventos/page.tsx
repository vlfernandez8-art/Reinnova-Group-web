import { PublicEventsSection } from "@/components/events/PublicEventsSection";
import { getPublishedEvents } from "@/lib/eventsDataStore";

export const revalidate = 0;

export default async function EventosPage() {
  const events = await getPublishedEvents();
  return (
    <main className="pt-20">
      <PublicEventsSection events={events} />
    </main>
  );
}
