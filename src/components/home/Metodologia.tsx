const pillars = [
  ["Diagnóstico y base operativa", "Detectamos fugas, validamos datos y priorizamos procesos críticos. Alianza con Reinnova Consulting para ordenar gestión y control."],
  ["Estandarización y producto", "Convertimos procesos en flujos trazables, medibles y repetibles dentro del ecosistema Reinnova Group."],
  ["Automatización e IA", "Integramos sistemas, dashboards y automatizaciones para escalar sin sumar carga administrativa."],
];

export function Metodologia() {
  return (
    <section id="metodologia" className="border-y border-white/10 bg-white/[0.025] py-24">
      <div className="section-shell">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-accent">Alianza con Reinnova Consulting</p>
        <h2 className="font-heading text-4xl font-bold md:text-5xl">Nuestra metodología en 3 pilares</h2>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {pillars.map(([title, text], index) => (
            <article key={title} className="glow-card relative rounded-lg border border-white/10 bg-black/30 p-7">
              <span className="mb-8 grid h-12 w-12 place-items-center rounded bg-accent text-lg font-black text-black">{index + 1}</span>
              <h3 className="font-heading text-2xl font-bold">{title}</h3>
              <p className="mt-4 leading-7 text-white/68">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
