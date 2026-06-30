import { EconomicData, RevenueRange } from "./types";

export const revenueMap: Record<RevenueRange, number> = {
  "Hasta $500k": 500000,
  "$500k-$2M": 1250000,
  "$2M-$10M": 6000000,
  "$10M-$50M": 25000000,
  "+$50M": 50000000,
};

export function calcularImpacto(facturacion: RevenueRange | "", datos: EconomicData, riesgoCyber = 0) {
  const salarioMensual = datos.salarioPromedio;
  const horasSemanalesImprod = datos.horasSemanaAdmin;
  const facturacionPromedio = facturacion ? revenueMap[facturacion] : 1250000;

  const costoHoraImprod = (salarioMensual / 4 / 40) * 0.6;
  const costoMensualHoras = costoHoraImprod * horasSemanalesImprod * 4;
  const costoErrores =
    datos.erroresMensuales * salarioMensual * 0.05 + facturacionPromedio * errorRevenueFactor(datos.erroresMensuales);
  const riesgoPorDecisionesTardias =
    facturacionPromedio * (balanceDelayFactor(datos.demoraBalance) + lostSalesFactor(datos.ventasPerdidas));
  const total = costoMensualHoras + costoErrores + riesgoPorDecisionesTardias + riesgoCyber;

  return {
    costo_horas: Math.round(costoMensualHoras),
    costo_errores: Math.round(costoErrores),
    riesgo_decision: Math.round(riesgoPorDecisionesTardias),
    riesgo_cyber: Math.round(riesgoCyber),
    total_mensual: Math.round(total),
    total_anual: Math.round(total * 12),
  };
}

export function currency(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

function balanceDelayFactor(delay: string) {
  const factors: Record<string, number> = {
    "1 día": 0.005,
    "1 semana": 0.015,
    "2 semanas": 0.025,
    "1 mes o más": 0.04,
    "No tenemos balance": 0.055,
  };

  return factors[delay] ?? 0.015;
}

function lostSalesFactor(lostSales: string) {
  const factors: Record<string, number> = {
    No: 0,
    "1-2 casos": 0.005,
    "3-5 casos": 0.015,
    Regularmente: 0.03,
  };

  return factors[lostSales] ?? 0;
}

function errorRevenueFactor(errors: number) {
  if (errors <= 0) return 0;
  if (errors <= 2) return 0.003;
  if (errors <= 5) return 0.008;
  return 0.015;
}
