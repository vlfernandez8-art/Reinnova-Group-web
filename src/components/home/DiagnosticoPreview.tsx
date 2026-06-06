import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const benefits = [
  "Identificás los 3 puntos de dolor principales del negocio",
  "Recibís una estimación del impacto económico mensual",
  "Conocés el nivel de madurez operativa de tu empresa",
  "Activás una devolución profesional con Reinnova Group y Reinnova Consulting",
];

export function DiagnosticoPreview() {
  return (
    <section className="py-24">
      <div className="section-shell grid items-center gap-10 lg:grid-cols-[0.95fr_1fr]">
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-accent">Alianza con Reinnova Consulting</p>
          <h2 className="font-heading text-4xl font-bold md:text-5xl">
            Descubrí en 5 minutos qué necesita tu empresa antes de elegir tecnología
          </h2>
          <p className="mt-5 text-lg text-white/68">
            Test gratuito · Sin compromiso · Resultado inmediato con impacto económico real y orientación hacia la solución correcta.
          </p>
          <Link href="/diagnostico" className="mt-8 inline-flex items-center gap-2 rounded bg-accent px-6 py-4 font-bold text-black transition hover:bg-white">
            Iniciar diagnóstico gratuito
            <ArrowRight size={18} />
          </Link>
        </div>
        <div className="glass rounded-lg p-6">
          <div className="mb-6 flex gap-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <span key={step} className={`h-2 flex-1 rounded ${step <= 3 ? "bg-accent" : "bg-white/12"}`} />
            ))}
          </div>
          <div className="rounded border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm font-bold text-accent">Paso 3 de 5</p>
            <h3 className="mt-3 font-heading text-2xl font-bold">Preguntas dinámicas por rubro</h3>
            <div className="mt-6 grid gap-3">
              {benefits.map((benefit) => (
                <span key={benefit} className="flex gap-3 text-sm text-white/76">
                  <CheckCircle2 className="shrink-0 text-success" size={18} />
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
