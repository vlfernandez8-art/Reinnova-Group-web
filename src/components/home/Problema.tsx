import { ClipboardList, Copy, DollarSign, LineChart, TimerReset } from "lucide-react";

const pains = [
  ["Trabajás 12 horas pero no ves las ganancias", TimerReset],
  ["Los reportes llegan cuando ya es tarde para decidir", LineChart],
  ["Tu equipo copia datos de un sistema a otro todo el día", Copy],
  ["Si falta alguien clave, todo se frena", ClipboardList],
  ["Sabés que estás perdiendo plata pero no sabés dónde", DollarSign],
  ["Tus áreas trabajan como islas sin comunicarse", ClipboardList],
];

export function Problema() {
  return (
    <section className="py-24">
      <div className="section-shell">
        <h2 className="font-heading text-4xl font-bold md:text-5xl">¿Te identificás con alguna de estas situaciones?</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pains.map(([text, Icon]) => (
            <article key={text as string} className="glow-card rounded-lg border border-white/10 bg-white/[0.035] p-6">
              <Icon className="mb-5 text-accent" size={28} />
              <h3 className="font-heading text-xl font-bold">{text as string}</h3>
            </article>
          ))}
        </div>
        <p className="mt-10 max-w-2xl text-xl leading-8 text-white/72">
          No es culpa tuya. Es un problema de estructura. Y tiene solución concreta y medible.
        </p>
      </div>
    </section>
  );
}
