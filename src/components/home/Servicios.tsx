const services = [
  [
    "Contannova",
    "Automatización contable y auditoría inteligente",
    "Cruza, valida y analiza información entre bancos, AFIP y sistemas internos para reducir errores y construir reporting confiable.",
  ],
  [
    "Infrannova",
    "Gestión integral de obras con metodología BIM",
    "Integra planificación, ejecución, recursos, materiales y costos para controlar desvíos y replanificar con datos.",
  ],
  [
    "Sitennova",
    "Gestión operativa en campo",
    "Control de activos, inventario, instalaciones y movimientos para locaciones distribuidas o entornos complejos.",
  ],
  [
    "Safennova",
    "Gestión de personal, seguridad y cumplimiento",
    "Centraliza legajos, vencimientos, accesos, seguridad e higiene para anticipar riesgos operativos y legales.",
  ],
  [
    "Diagnóstico empresarial",
    "Madurez operativa e impacto económico",
    "Identifica fugas, puntos de dolor y oportunidades antes de implementar software o automatización.",
  ],
  [
    "Implementación acompañada",
    "Reinnova Group + Reinnova Consulting",
    "Tecnología, control de gestión y mejora operativa trabajando juntos para que el cambio llegue a la operación real.",
  ],
];

export function Servicios() {
  return (
    <section id="servicios" className="border-y border-white/10 bg-black/30 py-24">
      <div className="section-shell">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-accent">Ecosistema Reinnova Group</p>
        <h2 className="font-heading text-4xl font-bold md:text-5xl">Soluciones para automatizar, medir y escalar</h2>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-white/68">
          Plataformas independientes o combinadas para que la empresa tenga visibilidad, disciplina operativa y velocidad de decisión.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map(([brand, title, text]) => (
            <article key={brand} className="glow-card rounded-lg border border-white/10 bg-white/[0.035] p-7">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-accent">{brand}</p>
              <h3 className="mt-4 font-heading text-2xl font-bold">{title}</h3>
              <p className="mt-4 leading-7 text-white/68">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
