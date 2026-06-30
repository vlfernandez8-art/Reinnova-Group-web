"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { type EventPayload, type EventRecord } from "@/lib/eventsTypes";

const STATUS_OPTIONS = [
  { value: "borrador", label: "Borrador" },
  { value: "publicado", label: "Publicado" },
];

type FormValues = EventPayload;

const EMPTY_FORM: FormValues = {
  title: "",
  description: "",
  date: "",
  time: "",
  duration: "",
  modality: "Virtual",
  targetAudience: "",
  accessLink: "",
  status: "borrador",
};

export function EventEditorForm({
  event,
  mode,
}: {
  event?: EventRecord;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>(event ? { ...event } : EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateField = (key: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const submit = async () => {
    setLoading(true);
    setError("");

    if (
      !values.title.trim() ||
      !values.description.trim() ||
      !values.date.trim() ||
      !values.time.trim() ||
      !values.duration.trim() ||
      !values.modality.trim() ||
      !values.targetAudience.trim()
    ) {
      setLoading(false);
      setError("Completa todos los campos obligatorios.");
      return;
    }

    const endpoint = event ? `/api/admin/events/${event.id}` : "/api/admin/events";
    const method = event ? "PATCH" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: values.title,
        description: values.description,
        date: values.date,
        time: values.time,
        duration: values.duration,
        modality: values.modality,
        targetAudience: values.targetAudience,
        accessLink: values.accessLink,
        status: values.status,
      }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { message?: string };
      setLoading(false);
      setError(payload?.message ?? "No se pudo guardar la capacitacion.");
      return;
    }

    setLoading(false);
    router.push("/soy-reinnova/admin/eventos");
    router.refresh();
  };

  return (
    <section className="section-shell py-8">
      <h1 className="font-heading text-4xl font-bold">{mode === "edit" ? "Editar capacitacion" : "Nueva capacitacion"}</h1>

      {error ? <p className="mt-4 rounded border border-danger/35 bg-danger/10 p-3 text-sm text-danger">{error}</p> : null}

      <div className="mt-6 grid gap-4">
        <label className="grid gap-1 text-sm">
          <span>Titulo</span>
          <input className="input" value={values.title} onChange={(event) => updateField("title", event.target.value)} />
        </label>
        <label className="grid gap-1 text-sm">
          <span>Descripcion</span>
          <textarea
            className="input min-h-24"
            value={values.description}
            onChange={(event) => updateField("description", event.target.value)}
          />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-1 text-sm">
            <span>Fecha</span>
            <input className="input" value={values.date} placeholder="2026-06-20" onChange={(event) => updateField("date", event.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            <span>Hora</span>
            <input className="input" value={values.time} placeholder="19:00" onChange={(event) => updateField("time", event.target.value)} />
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-1 text-sm">
            <span>Duracion</span>
            <input
              className="input"
              value={values.duration}
              placeholder="60 min"
              onChange={(event) => updateField("duration", event.target.value)}
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span>Modalidad</span>
            <input className="input" value={values.modality} onChange={(event) => updateField("modality", event.target.value)} />
          </label>
        </div>
        <label className="grid gap-1 text-sm">
          <span>Publico objetivo</span>
          <input className="input" value={values.targetAudience} onChange={(event) => updateField("targetAudience", event.target.value)} />
        </label>
        <label className="grid gap-1 text-sm">
          <span>Link de acceso virtual</span>
          <input
            className="input"
            value={values.accessLink}
            placeholder="https://..."
            onChange={(event) => updateField("accessLink", event.target.value)}
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span>Estado</span>
          <select value={values.status} className="input" onChange={(event) => updateField("status", event.target.value)}>
            {STATUS_OPTIONS.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </label>

        <button
          onClick={submit}
          disabled={loading}
          className="mt-2 inline-flex items-center justify-center rounded bg-accent px-6 py-3 font-bold text-black disabled:opacity-60"
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </section>
  );
}
