"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, RotateCcw } from "lucide-react";
import { currency } from "@/lib/calcularImpacto";
import { maturityLevels, solutionColumns } from "@/lib/scoring";
import { DiagnosticResult, DiagnosticoState } from "@/lib/types";

const urgencyClasses = {
  green: "border-success/40 bg-success/10 text-success",
  orange: "border-warning/40 bg-warning/10 text-warning",
  red: "border-danger/40 bg-danger/10 text-danger",
};

const levelClasses = {
  A: "border-danger/35 bg-danger/10",
  B: "border-warning/35 bg-warning/10",
  C: "border-success/35 bg-success/10",
};

const selectedLevelClasses = {
  A: "border-danger bg-danger/20 shadow-[0_0_0_2px_rgba(255,51,102,.35),0_18px_70px_rgba(255,51,102,.16)]",
  B: "border-warning bg-warning/20 shadow-[0_0_0_2px_rgba(255,184,0,.35),0_18px_70px_rgba(255,184,0,.14)]",
  C: "border-success bg-success/20 shadow-[0_0_0_2px_rgba(0,255,136,.30),0_18px_70px_rgba(0,255,136,.12)]",
};

export function Paso5Resultados({
  state,
  result,
  onReset,
  onBack,
}: {
  state: DiagnosticoState;
  result: DiagnosticResult;
  onReset: () => void;
  onBack: () => void;
}) {
  const diagnosticWhatsapp = generateWhatsappUrl(state, "diagnostico");
  const servicesWhatsapp = generateWhatsappUrl(state, "servicios");
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const sentKey = useRef(`${state.company.email}-${state.company.empresa}-${result.score}`);

  useEffect(() => {
    let cancelled = false;
    const localKey = `reinnova-report-sent-${sentKey.current}`;

    async function sendReport() {
      setEmailStatus("sending");
      try {
        const response = await fetch("/api/send-report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ state, result }),
        });
        const payload = (await response.json()) as { sent?: boolean; skipped?: boolean };

        if (payload.sent) {
          window.localStorage.setItem(localKey, "1");
        }

        if (!cancelled) {
          setEmailStatus(payload.sent || payload.skipped ? "sent" : "error");
        }
      } catch {
        if (!cancelled) setEmailStatus("error");
      }
    }

    if (!window.localStorage.getItem(localKey)) {
      sendReport();
    }

    return () => {
      cancelled = true;
    };
  }, [result, state]);

  return (
    <div className="grid gap-8">
      <section className={`rounded-lg border p-6 ${urgencyClasses[result.urgencia.color]}`}>
        <p className="text-sm font-bold uppercase tracking-[0.16em]">Nivel {result.perfil}</p>
        <h2 className="mt-3 font-heading text-4xl font-bold text-white">{result.perfilTitulo}</h2>
        <p className="mt-3 text-lg text-white/78">{result.urgencia.label}</p>
      </section>

      <section>
        <h3 className="font-heading text-2xl font-bold">Cuadro de niveles</h3>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {maturityLevels.map((level) => {
            const isSelected = result.perfil === level.id;

            return (
              <article
                key={level.id}
                className={`relative rounded-lg border p-5 transition ${
                  isSelected ? selectedLevelClasses[level.id] : levelClasses[level.id]
                }`}
              >
                {isSelected ? (
                  <span className="absolute right-4 top-4 rounded bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-black">
                    Resultado
                  </span>
                ) : null}
                <p className="text-sm font-bold uppercase tracking-[0.16em]">Nivel {level.id}</p>
                <h4 className="mt-3 font-heading text-xl font-bold text-white">{level.title}</h4>
                <p className="mt-3 text-sm leading-6 text-white/68">{level.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="glass rounded-lg p-6">
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <Gauge value={result.maturityScore} />
          <div>
            <h3 className="font-heading text-2xl font-bold">Impacto económico estimado</h3>
            <div className="mt-5 grid gap-3">
              <Row label="Horas improductivas" value={`${currency(result.impact.costo_horas)} / mes`} />
              <Row label="Errores y reprocesos" value={`${currency(result.impact.costo_errores)} / mes`} />
              <Row label="Decisiones sin información" value={`${currency(result.impact.riesgo_decision)} / mes`} />
            </div>
            <div className="mt-5 border-t border-white/10 pt-5">
              <p className="font-heading text-3xl font-bold">{currency(result.impact.total_mensual)} / mes</p>
              <p className="mt-1 text-xl text-white/70">{currency(result.impact.total_anual)} / año</p>
              <p className="mt-3 text-sm text-white/48">
                Estimación conservadora basada en tus respuestas y en el volumen de facturación informado.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h3 className="font-heading text-2xl font-bold">Los 3 puntos de dolor principales</h3>
        <p className="mt-2 text-sm text-white/55">Los montos asignados suman el total del impacto económico mensual estimado.</p>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {result.dolores.map((dolor, index) => (
            <article key={dolor.block} className="glow-card rounded-lg border border-white/10 bg-white/[0.035] p-5">
              <p className="text-sm font-bold text-accent">Punto de dolor #{index + 1}</p>
              <h4 className="mt-3 font-heading text-xl font-bold">{dolor.block}</h4>
              <p className="mt-3 text-sm leading-6 text-white/66">{dolor.symptom}</p>
              <p className="mt-4 font-bold text-warning">{currency(dolor.monthlyCost)} / mes</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-white/[0.035] p-6">
        <h3 className="font-heading text-2xl font-bold">Solución propuesta</h3>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {solutionColumns.map((column) => (
            <article key={column.title} className="glow-card rounded-lg border border-white/10 bg-black/20 p-5">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-accent">{column.title}</p>
              <h4 className="mt-3 font-heading text-xl font-bold">{column.subtitle}</h4>
              <div className="mt-4 grid gap-3 text-sm leading-6 text-white/70">
                {column.items.map((item) => (
                  <p key={item}>✓ {item}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {emailStatus === "sending" ? <p className="text-sm text-white/55">Enviando reporte interno a Reinnova...</p> : null}
      {emailStatus === "sent" ? <p className="text-sm text-success">Solicitud recibida. El equipo de Reinnova ya puede revisar tu diagnóstico.</p> : null}
      {emailStatus === "error" ? <p className="text-sm text-white/55">Solicitud recibida. Si querés acelerar la respuesta, escribinos por WhatsApp.</p> : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <a href={diagnosticWhatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded bg-accent px-6 py-4 font-bold text-black">
          <MessageCircle size={18} />
          Quiero mi diagnóstico profesional gratuito
        </a>
        <a href={servicesWhatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded border border-white/16 px-6 py-4 font-bold">
          <MessageCircle size={18} />
          Quiero conocer sus servicios
        </a>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button className="rounded border border-white/12 px-6 py-4 font-bold" onClick={onBack} type="button">
          Volver
        </button>
        <button className="inline-flex items-center justify-center gap-2 rounded border border-white/12 px-6 py-4 font-bold" onClick={onReset} type="button">
          <RotateCcw size={18} />
          Reiniciar diagnóstico
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col justify-between gap-1 rounded border border-white/10 bg-black/20 px-4 py-3 sm:flex-row">
      <span className="text-white/68">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Gauge({ value }: { value: number }) {
  const radius = 82;
  const circumference = 2 * Math.PI * radius;
  const dash = (value / 100) * circumference;
  const color = getGaugeColor(value);

  return (
    <div className="grid place-items-center">
      <svg width="190" height="190" viewBox="0 0 190 190" role="img" aria-label={`Madurez ${value}%`}>
        <circle cx="95" cy="95" r={radius} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="14" />
        <circle
          cx="95"
          cy="95"
          r={radius}
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeWidth="14"
          strokeDasharray={`${dash} ${circumference}`}
          transform="rotate(-90 95 95)"
        />
        <text x="95" y="99" textAnchor="middle" fill="white" fontSize="30" fontWeight="700">
          {value}%
        </text>
        <text x="95" y="122" textAnchor="middle" fill="#8892A4" fontSize="12">
          madurez
        </text>
      </svg>
    </div>
  );
}

function getGaugeColor(value: number) {
  if (value <= 50) return "var(--color-danger)";
  if (value <= 79) return "var(--color-warning)";
  return "var(--color-success)";
}

function generateWhatsappUrl(state: DiagnosticoState, intent: "diagnostico" | "servicios") {
  const request = intent === "diagnostico" ? "Quiero mi diagnostico" : "Quiero conocer sus servicios";
  const message = `Hola, soy ${state.company.nombre} (${state.company.cargo}) de la empresa ${state.company.empresa}. ${request}`;
  return `https://wa.me/5492995201981?text=${encodeURIComponent(message)}`;
}
