import { EventEditorForm } from "@/components/admin/EventEditorForm";

export const revalidate = 0;

export default function NewEventPage() {
  return <EventEditorForm mode="create" />;
}
