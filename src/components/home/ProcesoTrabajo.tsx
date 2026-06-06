const steps = ["Diagnóstico gratuito", "Reunión de devolución", "Propuesta personalizada", "Implementación", "Seguimiento y mejora continua"];

export function ProcesoTrabajo() {
  return (
    <section className="py-24">
      <div className="section-shell">
        <h2 className="font-heading text-4xl font-bold md:text-5xl">Proceso de trabajo</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-5">
          {steps.map((step, index) => (
            <div key={step} className="glow-card rounded-lg border border-white/10 bg-white/[0.03] p-5">
              <span className="text-sm font-bold text-accent">0{index + 1}</span>
              <p className="mt-4 font-heading text-lg font-bold">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
