"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useDiagnostico } from "@/hooks/useDiagnostico";
import { BarraProgreso } from "./BarraProgreso";
import { Paso1Empresa } from "./Paso1Empresa";
import { Paso2Rubro } from "./Paso2Rubro";
import { Paso3Preguntas } from "./Paso3Preguntas";
import { Paso4Cuantificacion } from "./Paso4Cuantificacion";
import { Paso5Resultados } from "./Paso5Resultados";

const titles = {
  1: ["Datos de la empresa", "Completá la base para personalizar el reporte."],
  2: ["Rubro y perfil", "Ajustamos las preguntas al contexto real de tu negocio."],
  3: ["Preguntas de diagnóstico", "Respondé con honestidad: el score interno no se muestra, solo orienta el resultado."],
  4: ["Cuantificación económica", "Transformamos fricciones operativas en una estimación de impacto mensual."],
  5: ["Resultados", "Tu nivel de madurez, impacto estimado y plan recomendado."],
};

export function DiagnosticoWizard() {
  const { state, setState, result, reset } = useDiagnostico();

  const goTo = (step: number) => setState((current) => ({ ...current, step }));
  const [title, subtitle] = titles[state.step as keyof typeof titles];

  return (
    <section className="section-shell pb-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">Auto-diagnóstico empresarial</p>
          <h1 className="mt-3 font-heading text-4xl font-bold md:text-6xl">{title}</h1>
          <p className="mt-4 text-lg text-white/66">{subtitle}</p>
        </div>

        <div className="glass rounded-lg p-5 md:p-8">
          <BarraProgreso step={state.step} />
          <AnimatePresence mode="wait">
            <motion.div
              key={state.step}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
            >
              {state.step === 1 ? (
                <Paso1Empresa
                  value={state.company}
                  onSubmit={(company) => setState((current) => ({ ...current, company, step: 2 }))}
                />
              ) : null}
              {state.step === 2 ? (
                <Paso2Rubro
                  value={state.profile}
                  onChange={(profile) => setState((current) => ({ ...current, profile }))}
                  onBack={() => goTo(1)}
                  onNext={() => goTo(3)}
                />
              ) : null}
              {state.step === 3 ? (
                <Paso3Preguntas
                  rubro={state.profile.rubro}
                  answers={state.answers}
                  onChange={(answers) => setState((current) => ({ ...current, answers }))}
                  onBack={() => goTo(2)}
                  onNext={() => goTo(4)}
                />
              ) : null}
              {state.step === 4 ? (
                <Paso4Cuantificacion
                  value={state.economic}
                  onChange={(economic) => setState((current) => ({ ...current, economic }))}
                  onBack={() => goTo(3)}
                  onNext={() => goTo(5)}
                  rubro={state.profile.rubro}
                />
              ) : null}
              {state.step === 5 ? <Paso5Resultados state={state} result={result} onBack={() => goTo(4)} onReset={reset} /> : null}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-5 text-sm font-bold text-white/58">
          <Link href="/politica-de-privacidad" className="underline-offset-4 transition hover:text-accent hover:underline">
            Política de privacidad
          </Link>
          <Link href="/terminos-de-uso" className="underline-offset-4 transition hover:text-accent hover:underline">
            Términos de uso
          </Link>
        </div>
      </div>
    </section>
  );
}
