"use client";

import { Download, Filter, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { type DiagnosticSurveyRecord } from "@/lib/eventsTypes";
import { rubros } from "@/lib/preguntas";

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

type Filters = {
  from: string;
  to: string;
  rubro: string;
};

export function DiagnosticSurveyDashboard({ initialSurveys }: { initialSurveys: DiagnosticSurveyRecord[] }) {
  const [surveys, setSurveys] = useState(initialSurveys);
  const [filters, setFilters] = useState<Filters>({ from: "", to: "", rubro: "todos" });
  const [loading, setLoading] = useState(false);
  const summary = useMemo(() => buildSummary(surveys), [surveys]);
  const trends = useMemo(() => buildMonthlyTrend(surveys), [surveys]);
  const rubroDistribution = useMemo(() => buildDistribution(surveys, "rubro"), [surveys]);
  const riskDistribution = useMemo(() => buildDistribution(surveys, "cyberRiskLevel"), [surveys]);

  const query = new URLSearchParams();
  if (filters.from) query.set("from", filters.from);
  if (filters.to) query.set("to", filters.to);
  if (filters.rubro && filters.rubro !== "todos") query.set("rubro", filters.rubro);

  const applyFilters = async () => {
    setLoading(true);
    const response = await fetch(`/api/admin/diagnostics?${query.toString()}`);
    if (response.ok) {
      const payload = (await response.json()) as { surveys: DiagnosticSurveyRecord[] };
      setSurveys(payload.surveys);
    }
    setLoading(false);
  };

  return (
    <section className="section-shell py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">Soy Reinnova</p>
          <h2 className="font-heading text-4xl font-bold">Relevamiento de diagnosticos</h2>
        </div>
        <a
          href={`/api/admin/diagnostics/export?${query.toString()}`}
          className="inline-flex items-center gap-2 rounded bg-accent px-4 py-3 font-bold text-black"
        >
          <Download size={16} />
          Exportar en Excel
        </a>
      </div>

      <div className="mb-6 grid gap-3 rounded border border-white/12 bg-white/[0.03] p-4 md:grid-cols-[1fr_1fr_1.3fr_auto]">
        <Field label="Desde">
          <input className="input" type="date" value={filters.from} onChange={(event) => setFilters({ ...filters, from: event.target.value })} />
        </Field>
        <Field label="Hasta">
          <input className="input" type="date" value={filters.to} onChange={(event) => setFilters({ ...filters, to: event.target.value })} />
        </Field>
        <Field label="Rubro">
          <select className="input" value={filters.rubro} onChange={(event) => setFilters({ ...filters, rubro: event.target.value })}>
            <option value="todos">Todos los rubros</option>
            {rubros.map((rubro) => (
              <option key={rubro.id} value={rubro.id}>
                {rubro.label}
              </option>
            ))}
          </select>
        </Field>
        <button
          type="button"
          onClick={applyFilters}
          className="inline-flex items-center justify-center gap-2 rounded border border-white/14 px-4 py-3 font-bold md:self-end"
        >
          <Filter size={16} />
          {loading ? "Filtrando..." : "Filtrar"}
        </button>
      </div>

      <div className="mb-6 grid gap-3 md:grid-cols-4">
        <Metric label="Diagnosticos" value={String(summary.count)} />
        <Metric label="Impacto promedio" value={currency.format(summary.avgImpact)} />
        <Metric label="Madurez promedio" value={`${summary.avgMaturity}%`} />
        <Metric label="Madurez cyber" value={`${summary.avgCyberMaturity}%`} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="rounded border border-white/12 bg-white/[0.03] p-5">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-accent" />
            <h3 className="font-heading text-2xl font-bold">Reporte grafico de tendencias</h3>
          </div>
          <TrendChart data={trends} />
        </section>

        <section className="grid gap-6">
          <Distribution title="Diagnosticos por rubro" items={rubroDistribution} />
          <Distribution title="Riesgo cyber detectado" items={riskDistribution} />
        </section>
      </div>

      <section className="mt-6 overflow-hidden rounded border border-white/12 bg-white/[0.03]">
        <div className="border-b border-white/10 p-4">
          <h3 className="font-heading text-2xl font-bold">Resultados relevados</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="bg-white/[0.04] text-white/60">
              <tr>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Rubro</th>
                <th className="px-4 py-3">Perfil</th>
                <th className="px-4 py-3">Impacto mensual</th>
                <th className="px-4 py-3">Madurez</th>
                <th className="px-4 py-3">Cyber</th>
                <th className="px-4 py-3">Impacto cyber</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {surveys.length === 0 ? (
                <tr>
                  <td className="px-4 py-5 text-white/58" colSpan={7}>
                    Todavia no hay diagnosticos relevados para estos filtros.
                  </td>
                </tr>
              ) : (
                surveys.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3">{new Date(item.createdAt).toLocaleDateString("es-AR")}</td>
                    <td className="px-4 py-3">{item.rubroOtro || getRubroLabel(item.rubro)}</td>
                    <td className="px-4 py-3">{item.perfil}</td>
                    <td className="px-4 py-3">{currency.format(item.totalImpactMonthly)}</td>
                    <td className="px-4 py-3">{item.maturityScore}%</td>
                    <td className="px-4 py-3">{item.cyberRiskLevel}</td>
                    <td className="px-4 py-3">{currency.format(item.cyberImpactMonthly)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-white/78">
      {label}
      {children}
    </label>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded border border-white/12 bg-white/[0.035] p-4">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/48">{label}</p>
      <p className="mt-2 font-heading text-2xl font-bold">{value}</p>
    </article>
  );
}

function TrendChart({ data }: { data: { label: string; impact: number; cyber: number }[] }) {
  const max = Math.max(...data.flatMap((item) => [item.impact, item.cyber]), 1);

  if (data.length === 0) {
    return <p className="rounded border border-white/10 p-5 text-white/58">Sin datos para graficar.</p>;
  }

  return (
    <div className="grid h-80 grid-cols-[48px_1fr] gap-3">
      <div className="flex flex-col justify-between text-right text-xs text-white/42">
        <span>{currency.format(max)}</span>
        <span>{currency.format(Math.round(max / 2))}</span>
        <span>$0</span>
      </div>
      <div className="flex items-end gap-3 border-l border-b border-white/12 pl-3 pb-3">
        {data.map((item) => (
          <div key={item.label} className="flex min-w-14 flex-1 flex-col items-center gap-2">
            <div className="flex h-56 items-end gap-1">
              <span className="w-4 rounded-t bg-accent" style={{ height: `${Math.max(6, (item.impact / max) * 224)}px` }} title="Impacto total" />
              <span className="w-4 rounded-t bg-warning" style={{ height: `${Math.max(6, (item.cyber / max) * 224)}px` }} title="Impacto cyber" />
            </div>
            <span className="text-xs text-white/48">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Distribution({ title, items }: { title: string; items: { label: string; value: number }[] }) {
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <div className="rounded border border-white/12 bg-white/[0.03] p-5">
      <h3 className="font-heading text-xl font-bold">{title}</h3>
      <div className="mt-4 grid gap-3">
        {items.length === 0 ? (
          <p className="text-sm text-white/58">Sin datos disponibles.</p>
        ) : (
          items.map((item) => (
            <div key={item.label}>
              <div className="mb-1 flex justify-between gap-3 text-sm">
                <span className="text-white/72">{item.label}</span>
                <strong>{item.value}</strong>
              </div>
              <div className="h-2 rounded bg-white/10">
                <div className="h-2 rounded bg-accent" style={{ width: `${(item.value / max) * 100}%` }} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function getRubroLabel(rubroId: string) {
  return rubros.find((rubro) => rubro.id === rubroId)?.label ?? rubroId;
}

function buildSummary(items: DiagnosticSurveyRecord[]) {
  const count = items.length;
  const avg = (selector: (item: DiagnosticSurveyRecord) => number) => {
    if (!count) return 0;
    return Math.round(items.reduce((sum, item) => sum + selector(item), 0) / count);
  };

  return {
    count,
    avgImpact: avg((item) => item.totalImpactMonthly),
    avgMaturity: avg((item) => item.maturityScore),
    avgCyberMaturity: avg((item) => item.cyberMaturityScore),
  };
}

function buildMonthlyTrend(items: DiagnosticSurveyRecord[]) {
  const map = new Map<string, { impact: number; cyber: number; count: number }>();
  items.forEach((item) => {
    const date = new Date(item.createdAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const current = map.get(key) ?? { impact: 0, cyber: 0, count: 0 };
    map.set(key, {
      impact: current.impact + item.totalImpactMonthly,
      cyber: current.cyber + item.cyberImpactMonthly,
      count: current.count + 1,
    });
  });

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-8)
    .map(([label, value]) => ({
      label,
      impact: Math.round(value.impact / value.count),
      cyber: Math.round(value.cyber / value.count),
    }));
}

function buildDistribution(items: DiagnosticSurveyRecord[], key: "rubro" | "cyberRiskLevel") {
  const map = new Map<string, number>();
  items.forEach((item) => {
    const label = key === "rubro" ? getRubroLabel(item.rubro) : item[key] || "No informado";
    map.set(label, (map.get(label) ?? 0) + 1);
  });

  return Array.from(map.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}
