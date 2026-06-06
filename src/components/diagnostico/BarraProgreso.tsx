const steps = ["Empresa", "Perfil", "Preguntas", "Impacto", "Resultados"];

export function BarraProgreso({ step }: { step: number }) {
  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between text-xs font-bold uppercase tracking-[0.14em] text-white/55">
        {steps.map((label, index) => (
          <span key={label} className={index + 1 <= step ? "text-accent" : ""}>
            {label}
          </span>
        ))}
      </div>
      <div className="h-2 overflow-hidden rounded bg-white/10">
        <div className="h-full rounded bg-accent transition-all" style={{ width: `${(step / steps.length) * 100}%` }} />
      </div>
    </div>
  );
}
