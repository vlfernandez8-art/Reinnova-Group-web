import { notFound } from "next/navigation";
import { EventEditorForm } from "@/components/admin/EventEditorForm";
import { getEventById } from "@/lib/eventsDataStore";

export const revalidate = 0;

export default async function EditEventPage({ params }: { params: { id: string } }) {
  const event = await getEventById(params.id);
  if (!event) {
    notFound();
  }
  return <EventEditorForm mode="edit" event={event} />;
}
