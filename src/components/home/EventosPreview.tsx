import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3, Globe } from "lucide-react";
import { type PublicEventRecord } from "@/lib/eventsTypes";

export function EventosPreview({ events }: { events: PublicEventRecord[] }) {
  const featuredEvents = events.slice(0, 3);

  return (
    <section id="eventos" className="border-y border-white/10 bg-black/35 py-24">
      <div className="section-shell grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-accent">Eventos</p>
          <h2 className="font-heading text-4xl font-bold md:text-5xl">Eventos y capacitaciones cortas</h2>
          <p className="mt-5 text-lg leading-8 text-white/68">
            Encuentros virtuales, practicos y dinamicos para ordenar tu empresa, mejorar la administracion y detectar oportunidades de mejora.
          </p>
          <Link
            href="/eventos"
            className="mt-8 inline-flex items-center gap-2 rounded bg-accent px-6 py-4 font-bold text-black transition hover:bg-white"
          >
            Ver proximos eventos
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid gap-4">
          {featuredEvents.length > 0 ? (
            featuredEvents.map((event) => (
              <article key={event.id} className="glow-card rounded-lg border border-white/10 bg-white/[0.03] p-5">
                <div className="mb-3 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-accent">
                  <span className="inline-flex items-center gap-2">
                    <Globe size={14} />
                    {event.modality}
                  </span>
                </div>
                <h3 className="font-heading text-2xl font-bold">{event.title}</h3>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/68">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays size={14} />
                    {event.date}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Clock3 size={14} />
                    {event.time}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-white/72">{event.targetAudience}</p>
              </article>
            ))
          ) : (
            <div className="rounded border border-white/10 bg-white/[0.03] p-8 text-white/75">
              Proximamente publicaremos nuevas capacitaciones de Reinnova Group.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
