"use client";

import Link from "next/link";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { type EventRecord } from "@/lib/eventsTypes";

export function AdminEventsManager({ initialEvents }: { initialEvents: EventRecord[] }) {
  const [events, setEvents] = useState<EventRecord[]>(initialEvents);
  const [error, setError] = useState("");

  const refresh = async () => {
    const response = await fetch("/api/admin/events");
    if (!response.ok) return;
    const payload = (await response.json()) as { events: EventRecord[] };
    setEvents(payload.events);
  };

  const togglePublish = async (event: EventRecord) => {
    const next = event.status === "publicado" ? "borrador" : "publicado";
    await fetch(`/api/admin/events/${event.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    await refresh();
  };

  const removeEvent = async (event: EventRecord) => {
    if (!window.confirm("Seguro que quieres eliminar esta capacitacion?")) {
      return;
    }

    const response = await fetch(`/api/admin/events/${event.id}`, { method: "DELETE" });
    if (!response.ok) {
      const payload = (await response.json()) as { message?: string };
      setError(payload?.message || "No se pudo eliminar la capacitacion.");
      return;
    }

    await refresh();
  };

  return (
    <section className="section-shell py-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="font-heading text-4xl font-bold">Eventos</h2>
        <Link
          href="/soy-reinnova/admin/eventos/nuevo"
          className="inline-flex items-center gap-2 rounded bg-accent px-4 py-3 font-bold text-black"
        >
          <Plus size={16} /> Nueva capacitacion
        </Link>
      </div>

      {error ? <p className="mb-4 rounded border border-danger/40 bg-danger/10 p-3 text-sm text-danger">{error}</p> : null}

      <div className="glow-card overflow-hidden rounded border border-white/12 bg-white/[0.03]">
        <div className="border-b border-white/10 p-4">
          <label className="inline-flex w-full max-w-sm items-center gap-2 rounded border border-white/14 px-3 py-2">
            <Search size={16} />
            <input className="w-full bg-transparent outline-none" placeholder="Buscar por titulo" />
          </label>
        </div>

        <div className="divide-y divide-white/10">
          {events.length === 0 ? (
            <p className="p-6 text-white/70">Aun no hay capacitaciones cargadas.</p>
          ) : (
            events.map((event) => (
              <article key={event.id} className="grid gap-3 p-4 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="font-heading text-lg font-bold">{event.title}</p>
                  <p className="mt-1 text-sm text-white/70">
                    {event.date} | {event.time} | {event.modality} | {event.targetAudience}
                  </p>
                  <p className="mt-2 text-xs text-white/54">Estado: {event.status}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => togglePublish(event)}
                    className="rounded border border-white/14 px-3 py-2 text-sm"
                  >
                    {event.status === "publicado" ? "Despublicar" : "Publicar"}
                  </button>
                  <Link
                    href={`/soy-reinnova/admin/eventos/${event.id}`}
                    className="inline-flex items-center gap-1 rounded border border-white/14 px-3 py-2 text-sm"
                  >
                    <Pencil size={14} />
                    Ver/Editar
                  </Link>
                  <Link
                    href={`/soy-reinnova/admin/eventos/${event.id}/inscriptos`}
                    className="rounded border border-white/14 px-3 py-2 text-sm"
                  >
                    Ver inscriptos
                  </Link>
                  <button
                    onClick={() => removeEvent(event)}
                    className="inline-flex items-center gap-1 rounded border border-danger/30 px-3 py-2 text-sm text-danger"
                  >
                    <Trash2 size={14} />
                    Eliminar
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
