"use client";

import * as Icons from "lucide-react";
import { rubros } from "@/lib/preguntas";
import { MaturityChoice, ProfileData } from "@/lib/types";

const profiles: { id: MaturityChoice; title: string; text: string }[] = [
  {
    id: "A",
    title: "Recién arrancando el orden",
    text: "La información está dispersa, las decisiones salen de cabeza y el dueño está en todo.",
  },
  {
    id: "B",
    title: "Tenemos estructura pero algo falla",
    text: "Hay áreas y algún sistema, pero aparecen demoras, errores o conflictos entre equipos.",
  },
  {
    id: "C",
    title: "Todo funciona, queremos escalar",
    text: "Los procesos están ordenados y buscan automatizar, medir mejor y ganar eficiencia.",
  },
];

export function Paso2Rubro({
  value,
  onChange,
  onNext,
  onBack,
}: {
  value: ProfileData;
  onChange: (data: ProfileData) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const disabled = !value.rubro || !value.perfilDeclarado || (value.rubro === "otro" && !value.rubroOtro);

  return (
    <div className="grid gap-8">
      <div>
        <h3 className="mb-5 font-heading text-2xl font-bold">Seleccioná tu rubro</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {rubros.map((rubro) => {
            const Icon = (Icons as unknown as Record<string, React.ComponentType<{ size?: number }>>)[rubro.icon] ?? Icons.Settings;
            return (
              <button
                key={rubro.id}
                type="button"
                className={`rounded-lg border p-4 text-left transition ${
                  value.rubro === rubro.id ? "border-accent bg-accent/12" : "border-white/10 bg-white/[0.03] hover:border-white/30"
                }`}
                onClick={() => onChange({ ...value, rubro: rubro.id })}
              >
                <Icon size={24} />
                <span className="mt-4 block text-sm font-bold">{rubro.label}</span>
              </button>
            );
          })}
        </div>
        {value.rubro === "otro" ? (
          <input
            className="input mt-4"
            placeholder="Indicanos el rubro"
            value={value.rubroOtro ?? ""}
            onChange={(event) => onChange({ ...value, rubroOtro: event.target.value })}
          />
        ) : null}
      </div>

      <div>
        <h3 className="mb-5 font-heading text-2xl font-bold">Perfil de madurez percibido</h3>
        <div className="grid gap-4 lg:grid-cols-3">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              type="button"
              className={`rounded-lg border p-5 text-left transition ${
                value.perfilDeclarado === profile.id ? "border-accent bg-accent/12" : "border-white/10 bg-white/[0.03] hover:border-white/30"
              }`}
              onClick={() => onChange({ ...value, perfilDeclarado: profile.id })}
            >
              <span className="text-sm font-bold text-accent">Perfil {profile.id}</span>
              <h4 className="mt-2 font-heading text-xl font-bold">{profile.title}</h4>
              <p className="mt-3 text-sm leading-6 text-white/66">{profile.text}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button className="rounded border border-white/12 px-6 py-4 font-bold" onClick={onBack} type="button">
          Volver
        </button>
        <button className="rounded bg-accent px-6 py-4 font-bold text-black disabled:cursor-not-allowed disabled:opacity-50" onClick={onNext} disabled={disabled} type="button">
          Continuar
        </button>
      </div>
    </div>
  );
}
