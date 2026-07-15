"use client";

import { CalendarDays, Clock3, Globe, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { type PublicEventRecord } from "@/lib/eventsTypes";

type RegistrationValues = {
  fullName: string;
  company: string;
  position: string;
  email: string;
  phone: string;
};

const INITIAL_FORM: RegistrationValues = {
  fullName: "",
  company: "",
  position: "",
  email: "",
  phone: "",
};

type EventInputState = Omit<PublicEventRecord, "status">;

export function PublicEventsSection({ events }: { events: PublicEventRecord[] }) {
  const [selectedEvent, setSelectedEvent] = useState<PublicEventRecord | null>(null);
  const [formValues, setFormValues] = useState<RegistrationValues>(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const hasEvents = events.length > 0;

  const closeModal = () => {
    setSelectedEvent(null);
    setFormValues(INITIAL_FORM);
    setErrorMessage("");
    setPrivacyAccepted(false);
  };

  const updateField = (key: keyof RegistrationValues, value: string) => {
    setFormValues((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: EventInputState) => {
    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    const payload = {
      fullName: formValues.fullName.trim(),
      company: formValues.company.trim(),
      position: formValues.position.trim(),
      email: formValues.email.trim(),
      phone: formValues.phone.trim(),
    };

    if (!payload.fullName || !payload.company || !payload.position || !payload.email || !payload.phone) {
      setSaving(false);
      setErrorMessage("Completa todos los campos obligatorios.");
      return;
    }

    if (!privacyAccepted) {
      setSaving(false);
      setErrorMessage("Debés aceptar la Política de Privacidad y los Términos de Uso.");
      return;
    }

    const response = await fetch(`/api/events/${event.id}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setSaving(false);
      setErrorMessage(body?.message ?? "No se pudo completar la inscripcion.");
      return;
    }

    setSaving(false);
    setSuccessMessage("Tu inscripcion fue registrada correctamente. Te enviamos la confirmacion por mail.");
    setTimeout(() => {
      closeModal();
    }, 900);
  };

  const formattedEvents = useMemo(() => {
    return events.map((event) => ({
      ...event,
      dateLabel: event.date,
    }));
  }, [events]);

  return (
    <section id="eventos" className="border-y border-white/10 bg-black/35 py-24">
      <div className="section-shell">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-accent">Eventos</p>
        <h2 className="font-heading text-4xl font-bold md:text-5xl">Eventos y capacitaciones cortas</h2>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-white/68">
          Encuentros virtuales, practicos y dinamicos para ordenar tu empresa, mejorar la administracion y detectar oportunidades
          de mejora.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {hasEvents ? (
            formattedEvents.map((event) => (
              <article key={event.id} className="glow-card rounded-lg border border-white/10 bg-white/[0.03] p-7">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Virtual</span>
                  <span
                    className={`rounded px-2 py-1 text-[11px] font-bold ${
                      event.status === "publicado" ? "bg-success/20 text-success" : "bg-warning/20 text-warning"
                    }`}
                  >
                    {event.status}
                  </span>
                </div>
                <h3 className="font-heading text-2xl font-bold">{event.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/68">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays size={14} />
                    {event.dateLabel}
                  </span>
                </p>
                <p className="mt-2 text-sm leading-6 text-white/68">
                  <span className="inline-flex items-center gap-2">
                    <Clock3 size={14} />
                    {event.time}
                  </span>
                </p>
                <p className="mt-3 text-sm leading-7 text-white/68">{event.targetAudience}</p>
                <p className="mt-3 text-sm leading-7 text-white/74">{event.description}</p>
                <div className="mt-6 flex items-center justify-between text-sm text-white/78">
                  <span className="inline-flex items-center gap-1">
                    <Globe size={14} />
                    {event.modality}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedEvent(event)}
                    className="rounded bg-accent px-4 py-2 font-bold text-black transition hover:bg-white"
                  >
                    Inscribirme
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded border border-white/10 bg-white/[0.03] p-8 text-white/75 md:col-span-2 xl:col-span-3">
              Proximamente publicaremos nuevas capacitaciones de Reinnova Group.
            </div>
          )}
        </div>
      </div>

      {selectedEvent ? (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/75 p-4">
          <div className="glow-card w-full max-w-lg rounded-lg border border-white/12 bg-black/70 p-6">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-heading text-2xl font-bold">Inscribirme a {selectedEvent.title}</h3>
              <button className="rounded border border-white/20 px-2 py-1 text-white/70" onClick={closeModal}>
                Cerrar
              </button>
            </div>

            <p className="mt-2 text-sm text-white/72">
              {selectedEvent.date} / {selectedEvent.time} / {selectedEvent.modality}
            </p>
            <p className="mt-1 text-sm text-white/72">A quien esta dirigida: {selectedEvent.targetAudience}</p>

            <div className="mt-6 grid gap-3">
              <label className="grid gap-1 text-sm">
                <span>Nombre y apellido</span>
                <input
                  className="input"
                  value={formValues.fullName}
                  onChange={(event) => updateField("fullName", event.target.value)}
                  placeholder="Nombre y apellido"
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span>Empresa</span>
                <input
                  className="input"
                  value={formValues.company}
                  onChange={(event) => updateField("company", event.target.value)}
                  placeholder="Empresa"
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span>Puesto</span>
                <input
                  className="input"
                  value={formValues.position}
                  onChange={(event) => updateField("position", event.target.value)}
                  placeholder="Puesto"
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span>Mail</span>
                <input
                  className="input"
                  value={formValues.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  type="email"
                  placeholder="mail@empresa.com"
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span>Numero de telefono</span>
                <input
                  className="input"
                  value={formValues.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  placeholder="Tu numero de telefono"
                />
              </label>
              <label className="flex items-start gap-3 rounded border border-white/10 bg-white/[0.03] p-3 text-sm leading-5 text-white/72">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 accent-cyan-400"
                  checked={privacyAccepted}
                  onChange={(event) => setPrivacyAccepted(event.target.checked)}
                />
                <span>
                  Acepto la{" "}
                  <Link href="/politica-de-privacidad" target="_blank" className="font-bold text-accent underline underline-offset-4">
                    Política de Privacidad
                  </Link>{" "}
                  y los{" "}
                  <Link href="/terminos-de-uso" target="_blank" className="font-bold text-accent underline underline-offset-4">
                    Términos de Uso
                  </Link>{" "}
                  para gestionar mi inscripción y recibir comunicaciones relacionadas con el evento.
                </span>
              </label>
              {errorMessage ? <p className="rounded border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">{errorMessage}</p> : null}
              {successMessage ? <p className="rounded border border-success/35 bg-success/10 px-3 py-2 text-sm text-success">{successMessage}</p> : null}

              <button
                type="button"
                onClick={() => handleSubmit(selectedEvent)}
                disabled={saving}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded bg-accent px-4 py-3 font-bold text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                <MessageCircle size={16} />
                {saving ? "Enviando..." : "Enviar inscripcion"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
