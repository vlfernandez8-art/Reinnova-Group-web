"use client";

import { useState } from "react";
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
  const [showTerms, setShowTerms] = useState(false);

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

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            className="text-sm font-bold text-white/58 underline-offset-4 transition hover:text-accent hover:underline"
            onClick={() => setShowTerms(true)}
          >
            Terminos y condiciones del autodiagnostico
          </button>
        </div>
      </div>

      {showTerms ? <AutodiagnosticoTermsModal onClose={() => setShowTerms(false)} /> : null}
    </section>
  );
}

function AutodiagnosticoTermsModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/72 px-4 py-8" role="dialog" aria-modal="true" aria-labelledby="terms-title">
      <div className="max-h-[86vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-white/12 bg-[#101827] p-6 shadow-2xl md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Autodiagnostico Reinnova</p>
            <h2 id="terms-title" className="mt-2 font-heading text-2xl font-bold text-white">
              Terminos y condiciones de uso
            </h2>
          </div>
          <button type="button" className="rounded border border-white/12 px-3 py-2 text-sm font-bold text-white/72 hover:text-white" onClick={onClose}>
            Cerrar
          </button>
        </div>

        <div className="mt-6 grid gap-5 text-sm leading-6 text-white/72">
          <p>
            El autodiagnostico de Reinnova es una herramienta orientativa para relevar informacion operativa, administrativa,
            tecnologica y de ciberseguridad de una empresa. Sus resultados no constituyen asesoramiento profesional, legal,
            contable, financiero ni tecnico definitivo.
          </p>

          <section>
            <h3 className="font-heading text-lg font-bold text-white">Uso de datos de contacto</h3>
            <p className="mt-2">
              La informacion de contacto cargada, como nombre, empresa, cargo, email, telefono o WhatsApp, puede ser utilizada
              por Reinnova para enviar el diagnostico realizado, coordinar una devolucion, responder consultas relacionadas con
              el resultado y ofrecer informacion vinculada a los servicios solicitados o sugeridos por el autodiagnostico.
            </p>
          </section>

          <section>
            <h3 className="font-heading text-lg font-bold text-white">Uso estadistico sin datos personales</h3>
            <p className="mt-2">
              Reinnova puede utilizar la informacion cargada desde el rubro en adelante, excluyendo datos personales y datos
              identificatorios de la empresa, para elaborar estadisticas internas, identificar patrones por sector, mejorar la
              herramienta y fomentar mejores practicas de seguridad, continuidad operativa y gestion administrativa en cada rubro.
            </p>
          </section>

          <section>
            <h3 className="font-heading text-lg font-bold text-white">Alcance del resultado</h3>
            <p className="mt-2">
              Las estimaciones de impacto, riesgo, madurez y recomendaciones se calculan a partir de las respuestas ingresadas.
              Pueden variar si la informacion cargada es incompleta, aproximada o no refleja la realidad operativa de la empresa.
            </p>
          </section>

          <section>
            <h3 className="font-heading text-lg font-bold text-white">Aceptacion</h3>
            <p className="mt-2">
              Al completar y enviar el autodiagnostico, la persona usuaria declara contar con autorizacion suficiente para cargar
              la informacion ingresada y acepta estos terminos de uso.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
