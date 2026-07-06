"use client";

import { EconomicData, RubroId } from "@/lib/types";

const salaryRanges: Partial<Record<RubroId, { label: string; value: number }[]>> = {
  retail: range([300000, 450000, 650000, 850000, 1150000, 1500000]),
  gastronomia: range([280000, 420000, 600000, 800000, 1050000, 1400000]),
  construccion: range([450000, 650000, 900000, 1200000, 1600000, 2100000]),
  salud: range([420000, 650000, 950000, 1300000, 1800000, 2400000]),
  "servicios-personales": range([260000, 380000, 550000, 750000, 1000000, 1300000]),
  "servicios-tecnicos": range([420000, 650000, 900000, 1200000, 1600000, 2100000]),
  logistica: range([380000, 580000, 800000, 1050000, 1400000, 1800000]),
  "servicios-profesionales": range([500000, 800000, 1200000, 1600000, 2200000, 3000000]),
  tecnologia: range([700000, 1100000, 1600000, 2200000, 3000000, 4200000]),
  "importacion-exportacion": range([500000, 800000, 1150000, 1600000, 2200000, 3000000]),
  agro: range([420000, 650000, 950000, 1300000, 1800000, 2400000]),
  educacion: range([300000, 480000, 700000, 950000, 1300000, 1700000]),
  manufactura: range([380000, 580000, 850000, 1150000, 1500000, 2000000]),
  inmobiliaria: range([420000, 650000, 950000, 1300000, 1800000, 2400000]),
  ecommerce: range([360000, 550000, 800000, 1100000, 1500000, 2000000]),
};
const defaultSalaryRanges = range([300000, 500000, 750000, 1000000, 1400000, 1900000]);
const delays = ["En el dia", "1 semana", "2 semanas", "1 mes o mas", "No tenemos informacion confiable"];
const lostSales = ["No", "1-2 casos", "3-5 casos", "Regularmente"];
const errorOptions = [
  ["Ninguno", 0],
  ["1-2", 2],
  ["3-5", 5],
  ["MÃ¡s de 5", 6],
] as const;

export function Paso4Cuantificacion({
  value,
  onChange,
  onNext,
  onBack,
  rubro,
}: {
  value: EconomicData;
  onChange: (data: EconomicData) => void;
  onNext: () => void;
  onBack: () => void;
  rubro: RubroId | "";
}) {
  const salaries = rubro ? salaryRanges[rubro] ?? defaultSalaryRanges : defaultSalaryRanges;
  const selectedSalary =
    value.salarioRango || salaries.find((salary) => salary.value === value.salarioPromedio)?.label || salaries[1].label;

  return (
    <div className="grid gap-7">
      <p className="rounded-lg border border-accent/25 bg-accent/10 p-5 text-white/78">
        Para estimar el impacto economico de forma simple, necesitamos algunos datos aproximados. No hace falta que sean exactos.
      </p>

      <label className="grid gap-3">
        <span className="font-bold">Horas semanales dedicadas a tareas administrativas repetitivas: {value.horasSemanaAdmin}hs</span>
        <input
          type="range"
          min={0}
          max={60}
          value={value.horasSemanaAdmin}
          onChange={(event) => onChange({ ...value, horasSemanaAdmin: Number(event.target.value) })}
        />
      </label>

      <Choice
        label="Costo mensual aproximado de una persona administrativa u operativa"
        options={salaries.map((salary) => salary.label)}
        value={selectedSalary}
        onSelect={(option) => {
          const salary = salaries.find((item) => item.label === option) ?? salaries[1];
          onChange({ ...value, salarioPromedio: salary.value, salarioRango: salary.label });
        }}
      />

      <Choice
        label="Errores administrativos relevantes del ultimo mes"
        options={errorOptions.map(([label]) => label)}
        value={errorOptions.find(([, amount]) => amount === value.erroresMensuales)?.[0] ?? "Ninguno"}
        onSelect={(option) => onChange({ ...value, erroresMensuales: errorOptions.find(([label]) => label === option)?.[1] ?? 0 })}
      />

      <Choice
        label="Cuanto tardas en tener informacion confiable para decidir?"
        options={delays}
        value={value.demoraBalance}
        onSelect={(option) => onChange({ ...value, demoraBalance: option })}
      />
      <Choice
        label="Perdiste ventas, clientes o cobranzas por falta de informacion?"
        options={lostSales}
        value={value.ventasPerdidas}
        onSelect={(option) => onChange({ ...value, ventasPerdidas: option })}
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <button className="rounded border border-white/12 px-6 py-4 font-bold" onClick={onBack} type="button">
          Volver
        </button>
        <button className="rounded bg-accent px-6 py-4 font-bold text-black" onClick={onNext} type="button">
          Ver resultados
        </button>
      </div>
    </div>
  );
}

function Choice({
  label,
  options,
  value,
  onSelect,
}: {
  label: string;
  options: string[];
  value: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div>
      <p className="mb-3 font-bold">{label}</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={`rounded border px-4 py-3 text-sm font-bold ${
              value === option ? "border-accent bg-accent/15 text-accent" : "border-white/10 bg-white/[0.03] text-white/72"
            }`}
            onClick={() => onSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function range(midpoints: number[]) {
  return midpoints.map((value, index) => {
    const lower = index === 0 ? 0 : midpoints[index - 1];
    const upper = index === midpoints.length - 1 ? null : midpoints[index + 1];
    return {
      value,
      label: upper ? `${money(lower)}-${money(upper)}` : `Más de ${money(value)}`,
    };
  });
}

function money(value: number) {
  if (value === 0) return "$0";
  if (value >= 1000000) return `$${(value / 1000000).toLocaleString("es-AR", { maximumFractionDigits: 1 })}M`;
  return `$${Math.round(value / 1000)}k`;
}




